import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { prisma } from "@/lib/db";
import { DishReviewAndAccount } from "@/types/DishReviewAndAccount";

async function getDishReviews(
  req: NextApiRequest,
  res: NextApiResponse<DishReviewAndAccount[] | ErrorResponse>
) {
  const { id } = req.query;

  const reviews = await prisma.dishReview.findMany({
    where: {
      dishId: id as string,
    },
    include: {
      account: true,
    },
  });

  if (!reviews)
    throw new createHttpError.NotFound("No hay reseñas para este plato");

  res.status(200).json(reviews);
}

export default apiHandler({
  GET: getDishReviews,
});
