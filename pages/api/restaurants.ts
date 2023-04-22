import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { CreateRestaurantSchema, Restaurant } from "@/types/Restaurant";
import { apiHandler } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";

const prisma = new PrismaClient();

async function createRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<Restaurant | ErrorResponse>
) {
  const createRestaurant = CreateRestaurantSchema.parse(req.body);

  const restaurantAlreadyCreated = await prisma.restaurant.findUnique({
    where: {
      adminId: createRestaurant.adminId,
    },
  });

  if (restaurantAlreadyCreated) {
    res.status(400).json({
      error: { message: "El administrador ya tiene un restaurante" },
      status: 400,
    });
    return;
  }

  const invalidSlug = await prisma.restaurant.findUnique({
    where: {
      slug: createRestaurant.slug,
    },
  });

  if (invalidSlug) {
    res.status(400).json({
      error: { message: "El restaurante con este slug ya existe" },
      status: 400,
    });
    return;
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      ...createRestaurant,
    },
  });

  res.status(201).json(restaurant);
}

export default apiHandler({
  POST: createRestaurant,
});
