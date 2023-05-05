import { z } from "zod";

export const DishReviewSchema = z.object({
  id: z.string(),
  comment: z.string(),
  rating: z.number().int().min(1).max(5),
  accountId: z.string(),
  dishId: z.string(),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  deletedAt: z.string().datetime().or(z.date()).nullable(),
});

export const CreateDishReviewSchema = z.object({
  comment: z
    .string({
      required_error: "El comentario es requerido",
      invalid_type_error: "El comentario debe ser una cadena de texto",
    })
    .min(10, {
      message: "El comentario debe tener al menos 10 caracteres",
    })
    .max(280, {
      message: "El comentario debe tener máximo 280 caracteres",
    }),
  rating: z
    .number({
      required_error: "La calificación es requerida",
      invalid_type_error: "La calificación debe ser un número",
    })
    .int({
      message: "La calificación debe ser un número entero",
    })
    .min(1, {
      message: "La calificación debe ser mínimo 1",
    })
    .max(5, {
      message: "La calificación debe ser máximo 5",
    }),
  dishId: z
    .string({
      required_error: "El id del platillo es requerido",
      invalid_type_error: "El id del platillo debe ser una cadena de texto",
    })
    .uuid({
      message: "El id del platillo debe ser un UUID válido",
    }),
});

export type DishReview = z.infer<typeof DishReviewSchema>;

export type CreateDishReview = z.infer<typeof CreateDishReviewSchema>;
