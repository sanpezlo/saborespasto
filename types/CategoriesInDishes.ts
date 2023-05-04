import { z } from "zod";

export const CategoriesInDishesSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  dishId: z.string(),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  deletedAt: z.string().datetime().or(z.date()).nullable(),
});

export const CreateCategoriesInDishesSchema = z.object({
  categories: z.array(
    z.string({
      required_error: "Debes seleccionar al menos una categoría",
      invalid_type_error: "Debes seleccionar al menos una categoría",
    }),
    {
      invalid_type_error: "Debes seleccionar al menos una categoría",
      required_error: "Debes seleccionar al menos una categoría",
    }
  ),
  dishId: z.string({
    required_error: "Debes seleccionar un platillo",
    invalid_type_error: "Debes seleccionar un platillo",
  }),
});

export type CategoriesInDishes = z.infer<typeof CategoriesInDishesSchema>;
export type CreateCategoriesInDishes = z.infer<
  typeof CreateCategoriesInDishesSchema
>;
