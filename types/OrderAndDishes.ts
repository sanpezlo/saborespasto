import { z } from "zod";

import { OrderSchema } from "@/types/Order";
import { DishesInOrdersSchema } from "@/types/DishesInOrder";

export const OrderAndDishesSchema = OrderSchema.extend({
  DishesInOrder: DishesInOrdersSchema,
});

export type OrderAndDishes = z.infer<typeof OrderAndDishesSchema>;
