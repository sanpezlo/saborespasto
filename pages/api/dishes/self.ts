import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { ErrorResponse } from "@/types/ErrorResponse";
import { apiHandler, withAdmin } from "@/lib/api";
import { Account } from "@/types/Account";
import { DishAndCategories } from "@/types/DishAndCategories";

const prisma = new PrismaClient();

async function getMyDishes(
  req: NextApiRequest,
  res: NextApiResponse<DishAndCategories[] | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;

  const dishes = await prisma.dish.findMany({
    where: {
      restaurant: {
        adminId: account.id,
      },
    },
    include: {
      CategoriesInDishes: {
        include: {
          category: true,
        },
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
  GET: withAdmin(getMyDishes),
});
