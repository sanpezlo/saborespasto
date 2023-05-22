import { z } from "zod";

import { AccountSchema } from "@/types/Account";
import { FavoriteRestaurantsSchema } from "@/types/FavoriteRestaurant";

export const AccountAndFavoritesSchema = AccountSchema.extend({
  FavoriteRestaurant: FavoriteRestaurantsSchema,
});

export type AccountAndFavorites = z.infer<typeof AccountAndFavoritesSchema>;
