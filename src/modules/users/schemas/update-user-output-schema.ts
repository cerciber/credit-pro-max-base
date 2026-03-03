import { z } from 'zod';
import { userSchema } from './user-schema';

export const updateUserOutputSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: userSchema,
});

export type UpdateUserOutput = z.infer<typeof updateUserOutputSchema>;
