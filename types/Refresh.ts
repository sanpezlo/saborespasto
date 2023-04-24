import { z } from "zod";

export const RefreshSchema = z.object({
  refresh_token: z.string(),
});

export type Refresh = z.infer<typeof RefreshSchema>;
