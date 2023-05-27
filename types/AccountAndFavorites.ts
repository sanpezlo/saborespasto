import { z } from "zod";

import { AccountSchema } from "@/types/Account";
import { FavoriteRestaurantsAndRestaurantsSchema } from "@/types/FavoriteRestaurant";
import { FavoriteDishessAndDishessSchema } from "@/types/FavoriteDish";
import { RestaurantReviewSchema } from "./RestaurantReview";

export const AccountAndFavoritesSchema = AccountSchema.extend({
  FavoriteRestaurant: FavoriteRestaurantsAndRestaurantsSchema,
  FavoriteDish: FavoriteDishessAndDishessSchema,
  RestaurantReview: z.array(RestaurantReviewSchema),
});

export type AccountAndFavorites = z.infer<typeof AccountAndFavoritesSchema>;
