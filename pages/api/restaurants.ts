import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { CreateRestaurantSchema, Restaurant } from "@/types/Restaurant";
import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";

const prisma = new PrismaClient();

async function createRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<Restaurant | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  const createRestaurant = CreateRestaurantSchema.parse(req.body);

  const restaurantAlreadyCreated = await prisma.restaurant.findUnique({
    where: {
      adminId: account.id,
    },
  });

  if (restaurantAlreadyCreated)
    throw new createHttpError.BadRequest(
      "El administrador ya tiene un restaurante"
    );

  const invalidSlug = await prisma.restaurant.findUnique({
    where: {
      slug: createRestaurant.slug,
    },
  });

  if (invalidSlug)
    throw new createHttpError.BadRequest(
      "El restaurante con este slug ya existe"
    );

  const restaurant = await prisma.restaurant.create({
    data: {
      ...createRestaurant,
      adminId: account.id,
    },
  });

  res.status(201).json(restaurant);
}

export default apiHandler({
  POST: withAdmin(createRestaurant),
});
