import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { prisma } from "@/lib/db";
import { Account } from "@/types/Account";

async function deleteDish(
  req: NextApiRequest,
  res: NextApiResponse<{ success: true } | ErrorResponse>
) {
  const { id } = req.query;
  const account = JSON.parse(req.headers.account as string) as Account;

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      adminId: account.id,
    },
  });

  if (!restaurant)
    throw new createHttpError.BadRequest(
      "El administrador no tiene un restaurante"
    );

  const dish = await prisma.dish.findUnique({
    where: {
      id: id as string,
    },
  });
  if (!dish) throw new createHttpError.BadRequest("El plato no existe");
  if (dish.restaurantId !== restaurant.id)
    throw new createHttpError.BadRequest(
      "El plato no pertenece al restaurante"
    );

  await prisma.dish.update({
    where: {
      id: id as string,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  res.status(200).json({ success: true });
}

export default apiHandler({
  DELETE: withAdmin(deleteDish),
});
