import { z } from 'zod';
import { userSchema } from '../../users/schemas/user-schema';

const authOutputSchema = z.object({
  token: z.string(),
  user: userSchema,
});

export const authOutputResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: authOutputSchema,
});
export type AuthOutputResponse = z.infer<typeof authOutputResponseSchema>;
