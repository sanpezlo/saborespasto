import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import {
  CreateRestaurantReviewSchema,
  DeleteRestaurantReviewSchema,
  RestaurantReview,
  UpdateRestaurantReviewSchema,
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

  updateRestaurantRating(restaurant.id);
}

async function updateRestaurantReview(
  req: NextApiRequest,
  res: NextApiResponse<RestaurantReview | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;

  const { id, ...updateRestaurantReview } = UpdateRestaurantReviewSchema.parse(
    req.body
  );

  const restaurantReview = await prisma.restaurantReview.findUnique({
    where: {
      id: id,
    },
    include: {
      restaurant: {
        include: {
          RestaurantReview: true,
        },
      },
    },
  });

  if (!restaurantReview) {
    throw new createHttpError.NotFound("La reseña no existe");
  }

  if (restaurantReview.accountId !== account.id) {
    throw new createHttpError.Unauthorized(
      "No tienes permiso para actualizar esta reseña"
    );
  }

  const updatedRestaurantReview = await prisma.restaurantReview.update({
    where: {
      id: id,
    },
    data: updateRestaurantReview,
  });

  res.status(200).json(updatedRestaurantReview);

  updateRestaurantRating(restaurantReview.restaurantId);
}

async function deleteRestaurantReview(
  req: NextApiRequest,
  res: NextApiResponse<{ success: true } | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;

  const deleteRestaurantReview = DeleteRestaurantReviewSchema.parse(req.body);

  const restaurantReview = await prisma.restaurantReview.findUnique({
    where: {
      id: deleteRestaurantReview.id,
    },
  });

  if (!restaurantReview)
    throw new createHttpError.NotFound("La reseña no existe");

  if (restaurantReview.accountId !== account.id)
    throw new createHttpError.Unauthorized(
      "No tienes permiso para eliminar esta reseña"
    );

  await prisma.restaurantReview.delete({
    where: {
      id: deleteRestaurantReview.id,
    },
  });

  res.status(200).json({ success: true });

  updateRestaurantRating(restaurantReview.restaurantId);
}

export default apiHandler({
  POST: withAuth(createRestaurantReview),
  PUT: withAuth(updateRestaurantReview),
  PATCH: withAuth(deleteRestaurantReview),
});

async function updateRestaurantRating(id: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: id,
    },
    include: {
      RestaurantReview: true,
    },
  });

  if (!restaurant) {
    throw new createHttpError.NotFound("El restaurante no existe");
  }

  const rating = restaurant.RestaurantReview.reduce(
    (acc, restaurantReview) => acc + restaurantReview.rating,
    0
  );

  await prisma.restaurant.update({
    where: {
      id: restaurant.id,
    },
    data: {
      rating: rating / restaurant.RestaurantReview.length,
    },
  });
}
