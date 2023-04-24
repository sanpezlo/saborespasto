import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { Account, CreateAccountSchema } from "@/types/Account";
import { apiHandler } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { genSalt, hash } from "bcrypt";

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

  if (current_account)
    throw new createHttpError.BadRequest(
      "Este correo electronico ya esta registrado"
    );

  const salt = await genSalt(10);
  const hashedPassword = await hash(createAccount.password, salt);

  const account = await prisma.account.create({
    data: {
      ...createAccount,
      password: hashedPassword,
    },
  });

  res.status(201).json(account);
}

export default apiHandler({
  POST: createAccount,
});