import type { NextApiRequest, NextApiResponse } from "next";
import createHttpError from "http-errors";

import { apiHandler, withAuth } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { CreateOrderSchema, Order } from "@/types/Order";
import { prisma } from "@/lib/db";

async function createOrder(
  req: NextApiRequest,
  res: NextApiResponse<Order | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;

  let createOrder = await CreateOrderSchema.parse({
    ...req.body,
    accountId: account.id,
  });

  if (createOrder.dishes.length === 0)
    throw new createHttpError.BadRequest(
      "El pedido debe tener al menos un plato"
    );

  const order = await prisma.order.create({
    data: {
      name: createOrder.name,
      address: createOrder.address,
      phone: createOrder.phone,
      restaurantId: createOrder.restaurantId,
      accountId: account.id,
    },
  });

  createOrder.dishes.forEach(async (dish) => {
    await prisma.dishesInOrder.create({
      data: {
        orderId: order.id,
        dishId: dish.id,
        quantity: dish.quantity,
      },
    });
  });

  res.status(201).json(order);
}

export default apiHandler({
  POST: withAuth(createOrder),
});
