import { z } from "zod";

import { DishSchema } from "@/types/Dish";

export const FavoriteDishSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  dishId: z.string(),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  deletedAt: z.string().datetime().or(z.date()).nullable(),
});

export const FavoriteDishAndDishSchema = FavoriteDishSchema.extend({
  dish: DishSchema,
});

export const FavoriteDishesSchema = z.array(FavoriteDishSchema);

export const FavoriteDishessAndDishessSchema = z.array(
  FavoriteDishAndDishSchema
);

export type FavoriteDish = z.infer<typeof FavoriteDishSchema>;

export type FavoriteDishAndDish = z.infer<typeof FavoriteDishAndDishSchema>;

export type FavoriteDishes = z.infer<typeof FavoriteDishesSchema>;
