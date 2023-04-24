import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verify, decode } from "jsonwebtoken";

import { apiHandler } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { AuthResponse } from "@/types/AuthResponse";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from "@/lib/config";
import { RefreshPayload, RefreshPayloadSchema } from "@/types/AuthPayload";
import { accessToken, refreshToken } from "@/lib/auth";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { RefreshSchema } from "@/types/Refresh";

const prisma = new PrismaClient();

async function refresh(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse | ErrorResponse>
) {
  if (hasCookie("refresh_token", { req, res })) {
    req.body = {
      refresh_token: getCookie("refresh_token", { req, res }),
    };
  }
  const refresh = RefreshSchema.parse(req.body);

  const payload = decode(refresh.refresh_token) as RefreshPayload;

  const refreshPayload = RefreshPayloadSchema.parse(payload);

  const current_account = await prisma.account.findUnique({
    where: {
      id: refreshPayload.id,
    },
  });

  if (!current_account)
    throw new createHttpError.Unauthorized("Invalid refresh token");

  await verify(
    refresh.refresh_token,
    REFRESH_TOKEN_SECRET + current_account.updatedAt.getTime()
  );

  const access_token = await accessToken(current_account);

  const new_refresh_token = await refreshToken(current_account);

  setCookie("access_token", access_token, {
    req: req,
    res: res,
    httpOnly: true,
    secure: true,
    maxAge: ACCESS_TOKEN_EXPIRES_IN,
    sameSite: "strict",
  });

  setCookie("refresh_token", new_refresh_token, {
    req: req,
    res: res,
    httpOnly: true,
    secure: true,
    maxAge: REFRESH_TOKEN_EXPIRES_IN,
    sameSite: "strict",
  });

  res.status(200).json({
    access_token,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_EXPIRES_IN,
    refresh_token: new_refresh_token,
    refresh_token_expires_in: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export default apiHandler({
  POST: refresh,
});
