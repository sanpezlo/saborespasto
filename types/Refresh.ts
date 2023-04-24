import { z } from "zod";

export const RefreshSchema = z.object({
  refresh_token: z.string({
    required_error: "El refresh token es requerido",
    invalid_type_error: "El refresh token debe ser una cadena de texto",
  }),
});

export type Refresh = z.infer<typeof RefreshSchema>;
