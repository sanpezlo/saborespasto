import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { OrderAndDishes } from "@/types/OrderAndDishes";
import { prisma } from "@/lib/db";

async function getMyOrders(
  req: NextApiRequest,
  res: NextApiResponse<OrderAndDishes | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  const { id } = req.query;

  if (account.admin) {
    const order = await prisma.order.findFirst({
      where: {
        id: id as string,
        restaurant: {
          adminId: account.id,
        },
      },
      include: {
        DishesInOrder: {
          include: {
            dish: {
              include: {
                CategoriesInDishes: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order)
      throw new createHttpError.BadRequest(
        "El administrador no tiene un restaurante o no tiene pedidos registrados"
      );

    res.status(200).json(order);
  } else {
    const order = await prisma.order.findFirst({
      where: {
        id: id as string,
        accountId: account.id,
      },
      include: {
        DishesInOrder: {
          include: {
            dish: {
              include: {
                CategoriesInDishes: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order)
      throw new createHttpError.BadRequest(
        "El usuario no tiene pedidos registrados"
      );

    res.status(200).json(order);
  }
}

export default apiHandler({
  GET: withAuth(getMyOrders),
});
