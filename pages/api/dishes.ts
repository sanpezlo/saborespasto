import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { CreateDishSchema } from "@/types/Dish";
import { DishAndCategories } from "@/types/DishAndCategories";

const prisma = new PrismaClient();

async function createDish(
  req: NextApiRequest,
  res: NextApiResponse<DishAndCategories | ErrorResponse>
) {
  const account = JSON.parse(req.headers.account as string) as Account;
  const createDish = CreateDishSchema.parse(req.body);

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      adminId: account.id,
    },
  });

  if (!restaurant)
    throw new createHttpError.BadRequest(
      "El administrador no tiene un restaurante"
    );

  const dish = await prisma.dish.create({
    data: {
      name: createDish.name,
      description: createDish.description,
      new_price: createDish.new_price,
      image: createDish.image,
      restaurantId: restaurant.id,
    },
  });

  createDish.categories.forEach(async (category) => {
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
        dishId: dish.id,
      },
    });
  });

  const dishWithCategories = await prisma.dish.findUnique({
    where: {
      id: dish.id,
    },
    include: {
      CategoriesInDishes: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!dishWithCategories)
    throw new createHttpError.BadRequest("El plato no existe");

  res.status(201).json(dishWithCategories);
}

export default apiHandler({
  POST: withAdmin(createDish),
});
