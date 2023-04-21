import { z } from "zod";

export const ErrorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
    err: z.unknown().optional(),
  }),
  status: z.number().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
