import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { Account, CreateAccountSchema } from "@/types/Account";
import { apiHandler } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";

const prisma = new PrismaClient();

async function createAccount(
  req: NextApiRequest,
  res: NextApiResponse<Account | ErrorResponse>
) {
  const createAccount = CreateAccountSchema.parse(req.body);
  const current_account = await prisma.account.findUnique({
    where: {
      email: createAccount.email,
    },
  });

  if (current_account) {
    res.status(400).json({
      error: { message: "Este email ya está registrado" },
      status: 400,
    });
    return;
  }
  const account = await prisma.account.create({
    data: {
      ...createAccount,
    },
  });

  res.status(201).json(account);
}

export default apiHandler({
  POST: createAccount,
});
