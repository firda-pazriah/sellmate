import { z } from "zod";

export const cogsSchema = z.object({
  id: z.string(),
  product_name: z.string(),
  cogs_price: z.number(),
  recommendation_price: z.number(),
});

export const cogsListSchema = cogsSchema.array();

export type COGS = z.infer<typeof cogsSchema>;
