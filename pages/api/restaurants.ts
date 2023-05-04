import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { CreateRestaurantSchema, Restaurant } from "@/types/Restaurant";
import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { RestaurantAndDishes } from "@/types/RestaurantAndDishes";

const prisma = new PrismaClient();

async function createRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<RestaurantAndDishes | ErrorResponse>
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
    include: {
      Dish: {
        include: {
          CategoriesInDishes: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  res.status(201).json(restaurant);
}

async function getRestaurants(
  req: NextApiRequest,
  res: NextApiResponse<Restaurant[] | ErrorResponse>
) {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      deletedAt: null,
    },
  });

  res.status(200).json(restaurants);
}

export default apiHandler({
  POST: withAdmin(createRestaurant),
  GET: getRestaurants,
});
