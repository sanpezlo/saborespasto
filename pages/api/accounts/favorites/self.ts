import type { NextApiRequest, NextApiResponse } from "next";
import createHttpError from "http-errors";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";

import { prisma } from "@/lib/db";
import { AccountAndFavorites } from "@/types/AccountAndFavorites";

async function self(
  req: NextApiRequest,
  res: NextApiResponse<AccountAndFavorites | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;

  const accountAndFavorites = await prisma.account.findUnique({
    where: {
      id: account.id,
    },
    include: {
      FavoriteRestaurant: {
        include: {
          restaurant: true,
        },
      },
      FavoriteDish: {
        include: {
          dish: true,
        },
      },
      RestaurantReview: true,
    },
  });

  if (!accountAndFavorites)
    throw new createHttpError.Unauthorized(
      "Cuenta no encontrada, inicie sesión nuevamente"
    );

  res.status(200).json(accountAndFavorites);
}

export default apiHandler({
  GET: withAuth(self),
});
