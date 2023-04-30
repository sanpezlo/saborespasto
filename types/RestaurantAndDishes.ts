import { z } from "zod";
import { RestaurantSchema } from "@/types/Restaurant";
import { DishesSchema } from "@/types/Dish";

export const RestaurantAndDishesSchema = RestaurantSchema.extend({
  Dish: DishesSchema,
});

export type RestaurantAndDishes = z.infer<typeof RestaurantAndDishesSchema>;
