import { z } from "zod";

export const OrderSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  status: z.string(),
  accountId: z.string(),
  restaurantId: z.string(),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  deletedAt: z.string().datetime().or(z.date()).nullable(),
});

export const OrdersSchema = z.array(OrderSchema);

export const CreateOrderSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre debe tener máximo 50 caracteres" })
    .nonempty({ message: "El nombre no puede estar vacío" }),
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
  restaurantId: z
    .string({
      required_error: "El id del restaurante es requerido",
      invalid_type_error: "El id del restaurante debe ser una cadena de texto",
    })
    .uuid({
      message: "El id del restaurante debe ser un uuid válido",
    }),
  dishes: z
    .array(
      z.object({
        id: z
          .string({
            required_error: "El id del platillo es requerido",
            invalid_type_error:
              "El id del platillo debe ser una cadena de texto",
          })
          .uuid({
            message: "El id del platillo debe ser un uuid válido",
          }),
        quantity: z
          .number({
            required_error: "La cantidad del platillo es requerida",
          })
          .int({
            message: "La cantidad del platillo debe ser un número entero",
          })
          .positive({
            message: "La cantidad del platillo debe ser un número positivo",
          }),
      }),
      {
        required_error: "Los platillos son requeridos",
        invalid_type_error: "Los platillos deben ser un arreglo de objetos",
      }
    )
    .min(1, {
      message: "Los platillos deben tener al menos un platillo",
    }),
});

export const UpdateStatusOrderSchema = z.object({
  status: z
    .string({
      required_error: "El estatus del pedido es requerido",
      invalid_type_error: "El estatus del pedido debe ser una cadena de texto",
    })
    .nonempty({
      message: "El estatus del pedido no puede estar vacío",
    }),
});

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
