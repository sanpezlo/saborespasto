import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { Order, UpdateStatusOrderSchema } from "@/types/Order";

const prisma = new PrismaClient();

async function getMyOrders(
  req: NextApiRequest,
  res: NextApiResponse<Order | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  const { id } = req.query;
  const order = await prisma.order.findFirst({
    where: {
      id: id as string,
      restaurant: {
        adminId: account.id,
      },
    },
  });

  if (!order)
    throw new createHttpError.BadRequest(
      "El administrador no tiene un restaurante o no tiene pedidos registrados"
    );

  res.status(200).json(order);
}

async function updateStatusOrder(
  req: NextApiRequest,
  res: NextApiResponse<{ update: true } | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  const { id } = req.query;

  const updateStatusOrder = UpdateStatusOrderSchema.parse(req.body);

  const order = await prisma.order.updateMany({
    where: {
      id: id as string,
      restaurant: {
        adminId: account.id,
      },
    },
    data: {
      status: updateStatusOrder.status,
      deletedAt: updateStatusOrder.status === "canceled" ? new Date() : null,
    },
  });

  if (!order)
    throw new createHttpError.BadRequest(
      "El administrador no tiene un restaurante o no tiene pedidos registrados"
    );

  res.status(200).json({ update: true });
}

export default apiHandler({
  GET: withAdmin(getMyOrders),
  PUT: withAdmin(updateStatusOrder),
});
