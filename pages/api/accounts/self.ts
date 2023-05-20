import type { NextApiRequest, NextApiResponse } from "next";
import createHttpError from "http-errors";
import { setCookie } from "cookies-next";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account, UpdateAccountSchema } from "@/types/Account";
import { AuthResponse } from "@/types/AuthResponse";
import { accessToken, refreshToken } from "@/lib/auth";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "@/lib/config";
import { prisma } from "@/lib/db";

async function self(
  req: NextApiRequest,
  res: NextApiResponse<Account | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  res.status(200).json(account);
}

async function update(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;

  const updateAccount = UpdateAccountSchema.parse(req.body);

  await prisma.account.update({
    where: {
      id: account.id,
    },
    data: {
      name: updateAccount.name,
      email: updateAccount.email,
      phone: updateAccount.phone,
      address: updateAccount.address,
    },
  });

  const current_account = await prisma.account.findUnique({
    where: {
      id: account.id,
    },
  });

  if (!current_account)
    throw new createHttpError.Unauthorized(
      "Cuenta no encontrada, inicie sesión nuevamente"
    );

  const access_token = await accessToken(current_account);

  const refresh_token = await refreshToken(current_account);

  setCookie("access_token", access_token, {
    req: req,
    res: res,
    httpOnly: true,
    secure: true,
    maxAge: ACCESS_TOKEN_EXPIRES_IN,
    sameSite: "strict",
  });

  setCookie("refresh_token", refresh_token, {
    req: req,
    res: res,
    httpOnly: true,
    secure: true,
    maxAge: REFRESH_TOKEN_EXPIRES_IN,
    sameSite: "strict",
  });

  res.status(200).json({
    token_type: "Bearer",
    access_token,
    expires_in: ACCESS_TOKEN_EXPIRES_IN,
    refresh_token,
    refresh_token_expires_in: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export default apiHandler({
  GET: withAuth(self),
  PUT: withAuth(update),
});
