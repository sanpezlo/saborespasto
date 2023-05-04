import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import {
  CreateRestaurantReviewSchema,
  RestaurantReview,
} from "@/types/RestaurantReview";

const prisma = new PrismaClient();

async function createRestaurantReview(
  req: NextApiRequest,
  res: NextApiResponse<RestaurantReview | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;

  const createRestaurantReview = CreateRestaurantReviewSchema.parse(req.body);

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: createRestaurantReview.restaurantId,
    },
    include: {
      RestaurantReview: true,
    },
  });

  if (!restaurant) {
    throw new createHttpError.NotFound("El restaurante no existe");
  }

  const restaurantReview = await prisma.restaurantReview.create({
    data: {
      ...createRestaurantReview,
      accountId: account.id,
    },
  });

  res.status(201).json(restaurantReview);

  const rating = restaurant.RestaurantReview.reduce(
    (acc, restaurantReview) => acc + restaurantReview.rating,
    createRestaurantReview.rating
  );

  await prisma.restaurant.update({
    where: {
      id: createRestaurantReview.restaurantId,
    },
    data: {
      rating: rating / (restaurant.RestaurantReview.length + 1),
    },
  });
}

export default apiHandler({
  POST: withAuth(createRestaurantReview),
});
