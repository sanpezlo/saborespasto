import { z } from "zod";

import { DishReviewSchema } from "@/types/DishReview";
import { AccountSchema } from "@/types/Account";

export const DishReviewAndAccountSchema = DishReviewSchema.extend({
  account: AccountSchema,
});

export const DishReviewsAndAccountSchema = z.array(DishReviewAndAccountSchema);

export type DishReviewAndAccount = z.infer<typeof DishReviewAndAccountSchema>;
