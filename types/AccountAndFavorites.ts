import { z } from "zod";

import { AccountSchema } from "@/types/Account";
import { FavoriteRestaurantsAndRestaurantsSchema } from "@/types/FavoriteRestaurant";
import { FavoriteDishessAndDishessSchema } from "@/types/FavoriteDish";
import { RestaurantReviewSchema } from "@/types/RestaurantReview";
import { DishReviewSchema } from "@/types/DishReview";

export const AccountAndFavoritesSchema = AccountSchema.extend({
  FavoriteRestaurant: FavoriteRestaurantsAndRestaurantsSchema,
  FavoriteDish: FavoriteDishessAndDishessSchema,
  RestaurantReview: z.array(RestaurantReviewSchema),
  DishReview: z.array(DishReviewSchema),
});

export type AccountAndFavorites = z.infer<typeof AccountAndFavoritesSchema>;
