import { z } from "zod";

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  admin: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const CreateAccountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .regex(new RegExp(".*[A-z].*"), "One character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .min(8),
  address: z.string().nullable().default(null),
  phone: z.string().nullable().default(null),
  admin: z.boolean(),
});

export type Account = z.infer<typeof AccountSchema>;
