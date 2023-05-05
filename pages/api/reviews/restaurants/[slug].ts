import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { apiHandler } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { RestaurantReviewAndAccount } from "@/types/RestaurantReviewAndAccount";

const prisma = new PrismaClient();

async function getRestaurantReviews(
  req: NextApiRequest,
  res: NextApiResponse<RestaurantReviewAndAccount[] | ErrorResponse>
) {
  console.log("a");
  const { slug } = req.query;

  const reviews = await prisma.restaurantReview.findMany({
    where: {
      restaurant: {
        slug: slug as string,
      },
    },
    include: {
      account: true,
    },
  });

  if (!reviews)
    throw new createHttpError.NotFound("No hay reseñas para este restaurante");

  res.status(200).json(reviews);
}

export default apiHandler({
  GET: getRestaurantReviews,
});
