import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteUserSchema = z
  .object({
    username: z.string().min(1),
  })
  .strict();

export type DeleteUser = z.infer<typeof deleteUserSchema>;
