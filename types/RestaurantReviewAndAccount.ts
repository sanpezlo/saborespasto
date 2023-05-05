import { z } from "zod";

import { RestaurantReviewSchema } from "@/types/RestaurantReview";
import { AccountSchema } from "@/types/Account";

export const RestaurantReviewAndAccountSchema = RestaurantReviewSchema.extend({
  account: AccountSchema,
});

export const RestaurantReviewsAndAccountSchema = z.array(
  RestaurantReviewAndAccountSchema
);

export type RestaurantReviewAndAccount = z.infer<
  typeof RestaurantReviewAndAccountSchema
>;
