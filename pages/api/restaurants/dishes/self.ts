import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { RestaurantAndDishes } from "@/types/RestaurantAndDishes";
import { prisma } from "@/lib/db";

async function getMyRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<RestaurantAndDishes | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  const restaurant = await prisma.restaurant.findUnique({
    where: {
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
        where: {
          deletedAt: null,
        },
      },
    },
  });

  if (!restaurant)
    throw new createHttpError.NotFound(
      "El administrador no tiene un restaurante registrado"
    );

  res.status(200).json(restaurant);
}

export default apiHandler({
  GET: withAdmin(getMyRestaurant),
});
