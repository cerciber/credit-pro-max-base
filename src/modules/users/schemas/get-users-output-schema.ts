import { z } from 'zod';
import { userSchema } from './user-schema';

export const getUsersOutputSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(userSchema),
});

export type GetUsersOutput = z.infer<typeof getUsersOutputSchema>;
