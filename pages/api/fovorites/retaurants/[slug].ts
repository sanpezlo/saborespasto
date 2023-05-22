import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { RestaurantReviewAndAccount } from "@/types/RestaurantReviewAndAccount";
import { prisma } from "@/lib/db";
import { Account } from "@/types/Account";
import { FavoriteRestaurant } from "@/types/FavoriteRestaurant";

async function createFavoriteRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<FavoriteRestaurant | ErrorResponse>
) {
  const { slug } = req.query;
  const account = JSON.parse(req.headers.account as string) as Account;

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: slug as string,
    },
  });

  if (!restaurant)
    throw new createHttpError.NotFound("El restaurante no existe");

  const favoriteRestaurantAlreadyCreated =
    await prisma.favoriteRestaurant.findFirst({
      where: {
        restaurantId: restaurant.id,
        accountId: account.id,
      },
    });

  if (favoriteRestaurantAlreadyCreated)
    throw new createHttpError.BadRequest("El restaurante ya es favorito");

  const favoriteRestaurant = await prisma.favoriteRestaurant.create({
    data: {
      restaurantId: restaurant.id,
      accountId: account.id,
    },
  });

  res.status(201).json(favoriteRestaurant);
}

export default apiHandler({
  POST: withAuth(createFavoriteRestaurant),
});
