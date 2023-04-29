import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { ErrorResponse } from "@/types/ErrorResponse";
import { apiHandler, withAdmin } from "@/lib/api";
import { Account } from "@/types/Account";
import { DishesInOrder } from "@/types/DishesInOrder";

const prisma = new PrismaClient();

async function getMyDishesInOrder(
  req: NextApiRequest,
  res: NextApiResponse<DishesInOrder[] | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  const { id } = req.query;

  const dishes = await prisma.dishesInOrder.findMany({
    where: {
      orderId: id as string,
      order: {
        restaurant: {
          adminId: account.id,
        },
      },
    },
    include: {
      dish: true,
    },
  });

  if (!dishes)
    throw new createHttpError.BadRequest(
      "El pedido no existe o no tiene platos registrados"
    );

  res.status(200).json(dishes);
}

export default apiHandler({
  GET: withAdmin(getMyDishesInOrder),
});
