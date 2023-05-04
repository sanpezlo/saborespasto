import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Category, CreateCategorySchema } from "@/types/Category";
import {
  CategoriesInDishes,
  CreateCategoriesInDishesSchema,
} from "@/types/CategoriesInDishes";
import createHttpError from "http-errors";

const prisma = new PrismaClient();

async function createCategoriesInDishes(
  req: NextApiRequest,
  res: NextApiResponse<{ success: true } | ErrorResponse>
) {
  const createCategoriesInDishes = CreateCategoriesInDishesSchema.parse(
    req.body
  );

  createCategoriesInDishes.categories.forEach(async (category) => {
    const categoryExists = await prisma.category.findUnique({
      where: {
        name: category,
      },
    });

    if (!categoryExists)
      throw new createHttpError.BadRequest("Categoria no existe");

    await prisma.categoriesInDishes.create({
      data: {
        categoryId: categoryExists.id,
        dishId: createCategoriesInDishes.dishId,
      },
    });
  });

  return res.status(201).json({ success: true });
}

export default apiHandler({
  POST: withAdmin(createCategoriesInDishes),
});
