import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { RestaurantReviewAndAccount } from "@/types/RestaurantReviewAndAccount";
import { prisma } from "@/lib/db";
import { Account } from "@/types/Account";
import { FavoriteRestaurant } from "@/types/FavoriteRestaurant";
import { FavoriteDish } from "@/types/FavoriteDish";

async function createFavoriteRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<FavoriteDish | ErrorResponse>
) {
  const { id } = req.query;
  const account = JSON.parse(req.headers.account as string) as Account;

  const dish = await prisma.dish.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!dish) throw new createHttpError.NotFound("El plato no existe");

  const favoriteDishAlreadyCreated = await prisma.favoriteDish.findFirst({
    where: {
      dishId: dish.id,
      accountId: account.id,
    },
  });

  if (favoriteDishAlreadyCreated)
    throw new createHttpError.BadRequest("El plato ya es favorito");

  const favoriteDish = await prisma.favoriteDish.create({
    data: {
      dishId: dish.id,
      accountId: account.id,
    },
  });

  res.status(201).json(favoriteDish);
}

export default apiHandler({
  POST: withAuth(createFavoriteRestaurant),
});
