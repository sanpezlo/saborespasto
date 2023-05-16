import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { Restaurant, UpdateRestaurantSchema } from "@/types/Restaurant";
import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";

const prisma = new PrismaClient();

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

async function updateRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<{ success: true } | ErrorResponse>
) {
  const { slug } = req.query;
  const account = JSON.parse(req.headers.account as string) as Account;

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: slug as string,
    },
  });

  if (!restaurant)
    throw new createHttpError.NotFound("Restaurante no encontrado");

  if (restaurant.adminId !== account.id)
    throw new createHttpError.Unauthorized("No autorizado");

  const updateRestaurant = UpdateRestaurantSchema.parse(req.body);

  await prisma.restaurant.update({
    where: {
      id: restaurant.id as string,
    },
    data: {
      name: updateRestaurant.name,
      description: updateRestaurant.description,
      slug: updateRestaurant.slug,
      address: updateRestaurant.address,
      phone: updateRestaurant.phone,
      image: updateRestaurant.image,
    },
  });

  res.status(200).json({ success: true });
}

export default apiHandler({
  GET: getRestaurant,
  PUT: withAdmin(updateRestaurant),
});
