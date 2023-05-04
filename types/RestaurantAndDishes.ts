import { z } from "zod";

import { RestaurantSchema } from "@/types/Restaurant";
import { DishesAndCategoriesSchema } from "@/types/DishAndCategories";

export const RestaurantAndDishesSchema = RestaurantSchema.extend({
  Dish: DishesAndCategoriesSchema,
});

export type RestaurantAndDishes = z.infer<typeof RestaurantAndDishesSchema>;
