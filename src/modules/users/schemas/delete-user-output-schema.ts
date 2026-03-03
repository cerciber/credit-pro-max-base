import { z } from 'zod';
import { userSchema } from './user-schema';

export const deleteUserOutputSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: userSchema,
});

export type DeleteUserOutput = z.infer<typeof deleteUserOutputSchema>;
