import createHttpError from "http-errors";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

import { ErrorResponse } from "@/types/ErrorResponse";
import { Method } from "@/types/Method";
import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/lib/config";
import { AccessPayload } from "@/types/AuthPayload";
import { Account } from "@/types/Account";
import { getCookie, hasCookie } from "cookies-next";

export type ApiMethodHandlers = {
  [key in Uppercase<Method>]?: NextApiHandler;
};

export function apiHandler(handler: ApiMethodHandlers) {
  return async (req: NextApiRequest, res: NextApiResponse<ErrorResponse>) => {
    try {
      const method = req.method
        ? (req.method.toUpperCase() as keyof ApiMethodHandlers)
        : undefined;

      if (!method)
        throw new createHttpError.MethodNotAllowed(
          `No se especificó ningún método en la ruta ${req.url}!`
        );

      const methodHandler = handler[method];
      if (!methodHandler)
        throw new createHttpError.MethodNotAllowed(
          `Método ${req.method} no permitido en la ruta ${req.url}!`
        );

      await methodHandler(req, res);
    } catch (err) {
      errorHandler(err, res);
    }
  };
}

function errorHandler(err: unknown, res: NextApiResponse<ErrorResponse>) {
  if (createHttpError.isHttpError(err) && err.expose) {
    return res
      .status(err.statusCode)
      .json({ error: { message: err.message }, status: err.statusCode });
  } else if (err instanceof ZodError) {
    return res.status(400).json({
      error: { message: "Solicitud incorrecta", err: err.format() },
      status: 400,
    });
  } else {
    return res.status(500).json({
      error: { message: "Error interno del servidor", err: err },
      status: createHttpError.isHttpError(err) ? err.statusCode : 500,
    });
  }
}

export function withAuth(handler: NextApiHandler) {
  const prisma = new PrismaClient();

  return async (req: NextApiRequest, res: NextApiResponse<ErrorResponse>) => {
    if (hasCookie("access_token", { req, res }))
      req.headers.authorization = `Bearer ${getCookie("access_token", {
        req,
        res,
      })}`;

    const { authorization } = req.headers;
    if (!authorization)
      throw new createHttpError.Unauthorized("No se ha proporcionado un token");

    const access_token = authorization.split(" ")[1];
    if (!access_token)
      throw new createHttpError.Unauthorized("No se ha proporcionado un token");

    const { id, updatedAt } = (await verify(
      access_token,
      ACCESS_TOKEN_SECRET
    )) as AccessPayload;
    const current_account = await prisma.account.findFirst({
      where: {
        id,
        updatedAt: new Date(updatedAt),
      },
    });
    if (!current_account)
      throw new createHttpError.Unauthorized("Token inválido");

    req.headers.account = JSON.stringify(current_account);

    await handler(req, res);
  };
}

export function withAdmin(handler: NextApiHandler) {
  return withAuth(
    async (req: NextApiRequest, res: NextApiResponse<ErrorResponse>) => {
      const account = JSON.parse(req.headers.account as string) as Account;
      if (!account.admin)
        throw new createHttpError.Unauthorized("No autorizado");

      await handler(req, res);
    }
  );
}
