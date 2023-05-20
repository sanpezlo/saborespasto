import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { DishAndCategories } from "@/types/DishAndCategories";
import { prisma } from "@/lib/db";

async function getDishes(
  req: NextApiRequest,
  res: NextApiResponse<DishAndCategories[] | ErrorResponse>
) {
  const { slug } = req.query;
  const dishes = await prisma.dish.findMany({
    where: {
      restaurant: {
        slug: slug as string,
      },
    },
    include: {
      CategoriesInDishes: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!dishes)
    throw new createHttpError.BadRequest(
      "El restaurante no existe o no tiene platos registrados"
    );

  res.status(200).json(dishes);
}

export default apiHandler({
  GET: getDishes,
});
