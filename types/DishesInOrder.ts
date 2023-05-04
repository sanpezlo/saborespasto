import { z } from "zod";

import { DishAndCategoriesSchema } from "@/types/DishAndCategories";

export const DishesInOrderSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  dishId: z.string(),
  dish: DishAndCategoriesSchema,
  orderId: z.string(),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  deletedAt: z.string().datetime().or(z.date()).nullable(),
});

export const DishesInOrdersSchema = z.array(DishesInOrderSchema);

export type DishesInOrder = z.infer<typeof DishesInOrderSchema>;
