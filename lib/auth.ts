import { sign } from "jsonwebtoken";

import { Account } from "@/types/Account";
import { AccessPayload, RefreshPayload } from "@/types/AuthPayload";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from "@/lib/config";

export async function accessToken(account: Account) {
  const accessPayload: AccessPayload = {
    id: account.id,
    updatedAt: new Date(account.updatedAt).getTime(),
  };

  return await sign(accessPayload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

export async function refreshToken(account: Account) {
  const refreshPayload: RefreshPayload = {
    id: account.id,
  };

  return await sign(
    refreshPayload,
    REFRESH_TOKEN_SECRET + new Date(account.updatedAt).getTime(),
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
}
