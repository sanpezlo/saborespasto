import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { CreateDishReviewSchema, DishReview } from "@/types/DishReview";
import { prisma } from "@/lib/db";

async function createRestaurantReview(
  req: NextApiRequest,
  res: NextApiResponse<DishReview | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;

  const createDishReview = CreateDishReviewSchema.parse(req.body);

  const dish = await prisma.dish.findUnique({
    where: {
      id: createDishReview.dishId,
    },
  });

  if (!dish) {
    throw new createHttpError.NotFound("El platillo no existe");
  }

  const dishReviewExists = await prisma.dishReview.findFirst({
    where: {
      dishId: createDishReview.dishId,
      accountId: account.id,
    },
  });

  if (dishReviewExists) {
    throw new createHttpError.BadRequest("Ya has calificado este platillo");
  }

  const dishReview = await prisma.dishReview.create({
    data: {
      ...createDishReview,
      accountId: account.id,
    },
  });

  res.status(201).json(dishReview);

  updateDishRating(dish.id);
}

export default apiHandler({
  POST: withAuth(createRestaurantReview),
});

async function updateDishRating(id: string) {
  const dish = await prisma.dish.findUnique({
    where: {
      id: id,
    },
    include: {
      DishReview: true,
    },
  });

  if (!dish) throw new createHttpError.NotFound("El platillo no existe");

  const rating = dish.DishReview.reduce(
    (acc, dishReview) => acc + dishReview.rating,
    0
  );

  await prisma.dish.update({
    where: {
      id: id,
    },
    data: {
      rating: rating / dish.DishReview.length,
    },
  });
}
