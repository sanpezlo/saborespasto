import { z } from "zod";

export const RefreshPayloadSchema = z.object({
  id: z.string(),
});

export type RefreshPayload = z.infer<typeof RefreshPayloadSchema>;

export const AccessPayloadSchema = z.object({
  id: z.string(),
  updatedAt: z.number(),
});

export type AccessPayload = z.infer<typeof AccessPayloadSchema>;
