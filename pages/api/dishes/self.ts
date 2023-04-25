import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { Dish } from "@/types/Dish";
import { ErrorResponse } from "@/types/ErrorResponse";
import { apiHandler, withAdmin } from "@/lib/api";
import { Account } from "@/types/Account";

const prisma = new PrismaClient();

async function getDishes(
  req: NextApiRequest,
  res: NextApiResponse<Dish[] | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;

  const dishes = await prisma.dish.findMany({
    where: {
      restaurant: {
        adminId: account.id,
      },
    },
  });
  if (!dishes)
    throw new createHttpError.BadRequest(
      "El administrador no tiene un restaurante o no tiene platos registrados"
    );

  res.status(200).json(dishes);
}

export default apiHandler({
  GET: withAdmin(getDishes),
});
