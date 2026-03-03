import { z } from 'zod';
import { customerAlreadyExistsSchema } from './user-management-v1-customer-schema';

const authOutputSchema = z.object({
  token: z.string(),
  user: customerAlreadyExistsSchema,
});

export const authOutputResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: authOutputSchema,
});
export type AuthOutputResponse = z.infer<typeof authOutputResponseSchema>;
