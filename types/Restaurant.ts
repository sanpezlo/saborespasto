import { z } from "zod";

export const RestaurantSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  address: z.string(),
  phone: z.string(),
  image: z.string(),
  adminId: z.string(),
  rating: z.number().min(0).max(5),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  deletedAt: z.string().datetime().or(z.date()).nullable(),
});

export const RestaurantsSchema = z.array(RestaurantSchema);

export const CreateRestaurantSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
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
  slug: z
    .string({
      required_error: "El slug es requerido",
      invalid_type_error: "El slug debe ser una cadena de texto",
    })
    .regex(new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$"), {
      message:
        "El slug debe ser una cadena de texto en minúsculas y sin espacios",
    }),
  address: z
    .string({
      required_error: "La dirección es requerida",
      invalid_type_error: "La dirección debe ser una cadena de texto",
    })
    .min(10, {
      message: "La dirección debe tener al menos 10 caracteres",
    }),
  phone: z
    .string({
      required_error: "El teléfono es requerido",
      invalid_type_error: "El teléfono debe ser una cadena de texto",
    })
    .length(10, {
      message: "El teléfono debe tener 10 dígitos",
    })
    .regex(new RegExp("^[0-9]*$"), {
      message: "El teléfono debe ser una cadena de texto numérica",
    }),
  image: z
    .string({
      required_error: "La imagen es requerida",
      invalid_type_error: "La imagen debe ser una cadena de texto",
    })
    .url({
      message: "La imagen debe ser una url válida",
    }),
});

export type CreateRestaurant = z.infer<typeof CreateRestaurantSchema>;

export type Restaurant = z.infer<typeof RestaurantSchema>;
