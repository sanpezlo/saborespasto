import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { Order } from "@/types/Order";
import { prisma } from "@/lib/db";

async function getMyOrders(
  req: NextApiRequest,
  res: NextApiResponse<Order[] | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  const orders = await prisma.order.findMany({
    where: {
      restaurant: {
        adminId: account.id,
      },
      deletedAt: null,
      status: {
        not: "completed",
      },
    },
  });

  if (!orders)
    throw new createHttpError.BadRequest(
      "El administrador no tiene un restaurante o no tiene pedidos registrados"
    );

  res.status(200).json(orders);
}

export default apiHandler({
  GET: withAdmin(getMyOrders),
});
