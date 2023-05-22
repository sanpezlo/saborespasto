import { z } from "zod";

export const FavoriteRestaurantSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  restaurantId: z.string(),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  deletedAt: z.string().datetime().or(z.date()).nullable(),
});

export const FavoriteRestaurantsSchema = z.array(FavoriteRestaurantSchema);

export type FavoriteRestaurant = z.infer<typeof FavoriteRestaurantSchema>;

export type FavoriteRestaurants = z.infer<typeof FavoriteRestaurantsSchema>;
