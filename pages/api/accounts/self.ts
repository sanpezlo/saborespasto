import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { getCookies } from "cookies-next";

async function self(
  req: NextApiRequest,
  res: NextApiResponse<Account | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  res.status(200).json(account);
}

export default apiHandler({
  GET: withAuth(self),
});
