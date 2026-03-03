import { z } from 'zod';

export const deleteUserInputSchema = z.object({
  url: z.string(),
});

export type DeleteUserInput = z.infer<typeof deleteUserInputSchema>;
