import { z } from "zod";

import { AccountSchema } from "@/types/Account";
import { FavoriteRestaurantsAndRestaurantsSchema } from "@/types/FavoriteRestaurant";

export const AccountAndFavoritesSchema = AccountSchema.extend({
  FavoriteRestaurant: FavoriteRestaurantsAndRestaurantsSchema,
});

export type AccountAndFavorites = z.infer<typeof AccountAndFavoritesSchema>;
