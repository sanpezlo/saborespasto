import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import {
  CreateRestaurantReviewSchema,
  RestaurantReview,
} from "@/types/RestaurantReview";
import { prisma } from "@/lib/db";

async function createRestaurantReview(
  req: NextApiRequest,
  res: NextApiResponse<RestaurantReview | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;

  const { slug, ...createRestaurantReview } =
    CreateRestaurantReviewSchema.parse(req.body);

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: slug,
    },
    include: {
      RestaurantReview: true,
    },
  });

  if (!restaurant) {
    throw new createHttpError.NotFound("El restaurante no existe");
  }

  const restaurantReviewExists = await prisma.restaurantReview.findFirst({
    where: {
      restaurantId: restaurant.id,
      accountId: account.id,
    },
  });

  if (restaurantReviewExists) {
    throw new createHttpError.BadRequest("Ya has calificado este restaurante");
  }

  const restaurantReview = await prisma.restaurantReview.create({
    data: {
      ...createRestaurantReview,
      restaurantId: restaurant.id,
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
      id: restaurant.id,
    },
    data: {
      rating: rating / (restaurant.RestaurantReview.length + 1),
    },
  });
}

export default apiHandler({
  POST: withAuth(createRestaurantReview),
});
