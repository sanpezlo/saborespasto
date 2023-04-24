import { z } from "zod";

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  admin: z.boolean(),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  deletedAt: z.string().datetime().or(z.date()).nullable(),
});

export const CreateAccountSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre debe tener máximo 50 caracteres" })
    .nonempty({ message: "El nombre no puede estar vacío" }),
  email: z
    .string({
      required_error: "El email es requerido",
      invalid_type_error: "El email debe ser una cadena de texto",
    })
    .email({
      message: "El email debe ser un email válido",
    }),
  password: z
    .string({
      required_error: "La contraseña es requerida",
      invalid_type_error: "La contraseña debe ser una cadena de texto",
    })
    .regex(new RegExp(".*[A-z].*"), {
      message: "La contraseña debe contener al menos una letra",
    })
    .regex(new RegExp(".*\\d.*"), {
      message: "La contraseña debe contener al menos un número",
    })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  address: z
    .string({
      required_error: "La dirección es requerida",
      invalid_type_error: "La dirección debe ser una cadena de texto",
    })
    .min(10, {
      message: "La dirección debe tener al menos 10 caracteres",
    })
    .nullable()
    .default(null),
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
    })
    .nullable()
    .default(null),
  admin: z.boolean({
    required_error: "El campo admin es requerido",
    invalid_type_error: "El campo admin debe ser un booleano",
  }),
});

export type CreateAccount = z.infer<typeof CreateAccountSchema>;

export type Account = z.infer<typeof AccountSchema>;
