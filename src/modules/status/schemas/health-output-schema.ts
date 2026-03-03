import { z } from 'zod';

const healthOutputSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
});

export const healthOutputResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: healthOutputSchema,
});
export type HealthOutputResponse = z.infer<typeof healthOutputResponseSchema>;
