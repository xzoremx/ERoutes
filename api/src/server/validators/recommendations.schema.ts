import { z } from "zod";

export const recommendationsRequestSchema = z.object({
  query: z.object({
    origin: z.string().optional(),
    destination: z.string().optional(),
    radiusKm: z.string().optional(),
    fuelProduct: z.string().optional()
  }),
  body: z.unknown().optional(),
  params: z.unknown().optional()
});
