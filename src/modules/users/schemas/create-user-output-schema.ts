import { z } from 'zod';
import { userSchema } from './user-schema';

export const createUserOutputSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: userSchema,
});

export type CreateUserOutput = z.infer<typeof createUserOutputSchema>;
