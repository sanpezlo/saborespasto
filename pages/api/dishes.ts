import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { CreateDishSchema, Dish } from "@/types/Dish";

const prisma = new PrismaClient();

async function createDish(
  req: NextApiRequest,
  res: NextApiResponse<Dish | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  const createDish = CreateDishSchema.parse(req.body);

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      adminId: account.id,
    },
  });

  if (!restaurant)
    throw new createHttpError.BadRequest(
      "El administrador no tiene un restaurante"
    );

  const dish = await prisma.dish.create({
    data: {
      ...createDish,
      restaurantId: restaurant.id,
    },
  });

  res.status(201).json(dish);
}

export default apiHandler({
  POST: withAdmin(createDish),
});
