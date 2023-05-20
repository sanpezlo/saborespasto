import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAdmin } from "@/lib/api";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { CreateDishSchema, UpdateDishSchema } from "@/types/Dish";
import { DishAndCategories } from "@/types/DishAndCategories";
import { prisma } from "@/lib/db";

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

async function updateDish(
  req: NextApiRequest,
  res: NextApiResponse<{ success: true } | ErrorResponse>
) {
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

  const updateDish = UpdateDishSchema.parse(req.body);

  const dish = await prisma.dish.findUnique({
    where: {
      id: updateDish.id,
    },
  });

  if (!dish) throw new createHttpError.BadRequest("El plato no existe");
  if (dish.restaurantId !== restaurant.id)
    throw new createHttpError.BadRequest(
      "El plato no pertenece al restaurante"
    );

  await prisma.dish.update({
    where: {
      id: updateDish.id,
    },
    data: {
      name: updateDish.name,
      description: updateDish.description,
      price: dish.new_price === updateDish.new_price ? null : dish.new_price,
      new_price: updateDish.new_price,
      image: updateDish.image,
    },
  });

  res.status(200).json({ success: true });
}

export default apiHandler({
  POST: withAdmin(createDish),
  PUT: withAdmin(updateDish),
});
