import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { Restaurant } from "@/types/Restaurant";
import { apiHandler } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { prisma } from "@/lib/db";

async function getRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<Restaurant | ErrorResponse>
) {
  const { slug } = req.query;
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: slug as string,
    },
  });

  if (!restaurant)
    throw new createHttpError.NotFound("Restaurante no encontrado");

  res.status(200).json(restaurant);
}

export default apiHandler({
  GET: getRestaurant,
});
