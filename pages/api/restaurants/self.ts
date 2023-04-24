import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { Restaurant } from "@/types/Restaurant";
import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";

const prisma = new PrismaClient();

async function getMyRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<Restaurant | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      adminId: account.id,
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
