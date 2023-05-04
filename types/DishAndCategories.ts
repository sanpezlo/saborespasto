import { z } from "zod";

import { DishSchema } from "@/types/Dish";
import { CategoriesInDishesSchema } from "@/types/CategoriesInDishes";
import { CategorySchema } from "@/types/Category";

export const DishAndCategoriesSchema = DishSchema.extend({
  CategoriesInDishes: z.array(
    CategoriesInDishesSchema.extend({
      category: CategorySchema,
    })
  ),
});

export type DishAndCategories = z.infer<typeof DishAndCategoriesSchema>;

export const DishesAndCategoriesSchema = z.array(DishAndCategoriesSchema);

export type DishesAndCategories = z.infer<typeof DishesAndCategoriesSchema>;
