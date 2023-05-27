import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { deleteCookie } from "cookies-next";

async function logout(
  req: NextApiRequest,
  res: NextApiResponse<{ success: true } | ErrorResponse>
) {
  deleteCookie("access_token", { req, res });
  deleteCookie("refresh_token", { req, res });

  res.status(200).json({ success: true });
}

export default apiHandler({
  POST: withAuth(logout),
});
