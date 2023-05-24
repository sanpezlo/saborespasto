import { z } from "zod";

import { RestaurantSchema } from "@/types/Restaurant";

export const FavoriteRestaurantSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  restaurantId: z.string(),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  deletedAt: z.string().datetime().or(z.date()).nullable(),
});

export const FavoriteRestaurantAndRestaurantSchema =
  FavoriteRestaurantSchema.extend({
    restaurant: RestaurantSchema,
  });

export const FavoriteRestaurantsSchema = z.array(FavoriteRestaurantSchema);

export const FavoriteRestaurantsAndRestaurantsSchema = z.array(
  FavoriteRestaurantAndRestaurantSchema
);

export type FavoriteRestaurant = z.infer<typeof FavoriteRestaurantSchema>;

export type FavoriteRestaurantAndRestaurant = z.infer<
  typeof FavoriteRestaurantAndRestaurantSchema
>;

export type FavoriteRestaurants = z.infer<typeof FavoriteRestaurantsSchema>;
