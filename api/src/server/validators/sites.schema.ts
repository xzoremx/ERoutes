import { z } from "zod";

export const sitesRequestSchema = z.object({
  query: z.object({}),
  body: z.unknown().optional(),
  params: z.unknown().optional()
});
