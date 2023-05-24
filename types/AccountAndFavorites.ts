import { z } from "zod";

import { AccountSchema } from "@/types/Account";
import { FavoriteRestaurantsAndRestaurantsSchema } from "@/types/FavoriteRestaurant";
import { FavoriteDishessAndDishessSchema } from "@/types/FavoriteDish";

export const AccountAndFavoritesSchema = AccountSchema.extend({
  FavoriteRestaurant: FavoriteRestaurantsAndRestaurantsSchema,
  FavoriteDish: FavoriteDishessAndDishessSchema,
});

export type AccountAndFavorites = z.infer<typeof AccountAndFavoritesSchema>;
