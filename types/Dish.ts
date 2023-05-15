import { z } from "zod";

export const DishSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive().nullable(),
  new_price: z.number().positive(),
  image: z.string(),
  restaurantId: z.string(),
  rating: z.number().min(0).max(5),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  deletedAt: z.string().datetime().or(z.date()).nullable(),
});

export const DishesSchema = z.array(DishSchema);

export const DishBaseSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(3, {
      message: "El nombre debe tener al menos 3 caracteres",
    })
    .max(50, {
      message: "El nombre debe tener máximo 50 caracteres",
    }),
  description: z
    .string({
      required_error: "La descripción es requerida",
      invalid_type_error: "La descripción debe ser una cadena de texto",
    })
    .min(10, {
      message: "La descripción debe tener al menos 10 caracteres",
    })
    .max(280, {
      message: "La descripción debe tener máximo 280 caracteres",
    }),
  new_price: z
    .number({
      required_error: "El precio es requerido",
      invalid_type_error: "El precio debe ser un número",
    })
    .positive({
      message: "El precio debe ser un número positivo",
    }),
  image: z
    .string({
      required_error: "La imagen es requerida",
      invalid_type_error: "La imagen debe ser una cadena de texto",
    })
    .url({
      message: "La imagen debe ser una URL válida",
    }),
});

export const UpdateDishSchema = DishBaseSchema.extend({
  id: z.string({
    required_error: "El id es requerido",
    invalid_type_error: "El id debe ser una cadena de texto",
  }),
});

export const CreateDishSchema = DishBaseSchema.extend({
  categories: z.array(
    z.string({
      required_error: "Las categorías son requeridas",
      invalid_type_error: "Las categorías deben ser una cadena de texto",
    }),
    {
      required_error: "Las categorías son requeridas",
      invalid_type_error:
        "Las categorías deben ser un arreglo de cadenas de texto",
    }
  ),
});

export type Dish = z.infer<typeof DishSchema>;

export type UpdateDish = z.infer<typeof UpdateDishSchema>;

export type CreateDish = z.infer<typeof CreateDishSchema>;
