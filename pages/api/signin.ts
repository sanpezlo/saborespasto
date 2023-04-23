import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

import { apiHandler } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { AuthResponse } from "@/types/AuthResponse";
import { SigninSchema } from "@/types/Signin";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "@/lib/config";
import { accessToken, refreshToken } from "@/lib/auth";
import { setCookie } from "cookies-next";

const prisma = new PrismaClient();

async function signin(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse | ErrorResponse>
) {
  const signin = SigninSchema.parse(req.body);

  const current_account = await prisma.account.findUnique({
    where: {
      email: signin.email,
    },
  });

  if (
    !current_account ||
    !(await compare(signin.password, current_account.password))
  )
    throw new createHttpError.Unauthorized(
      "Correo electronico o contraseña incorrectos"
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
  POST: signin,
});
