import { z } from "zod";

export const SigninSchema = z.object({
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
});

export type Signin = z.infer<typeof SigninSchema>;
