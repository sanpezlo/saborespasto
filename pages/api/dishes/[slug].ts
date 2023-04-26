import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { apiHandler } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Dish } from "@/types/Dish";

const prisma = new PrismaClient();

async function getDishes(
  req: NextApiRequest,
  res: NextApiResponse<Dish[] | ErrorResponse>
) {
  const { slug } = req.query;
  const dishes = await prisma.dish.findMany({
    where: {
      restaurant: {
        slug: slug as string,
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
