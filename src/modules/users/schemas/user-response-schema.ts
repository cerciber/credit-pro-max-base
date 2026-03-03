import { z } from 'zod';
import { userSchema } from './user-schema';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userResponseSchema = z
  .object({
    status: z.number(),
    message: z.string(),
    data: userSchema,
  })
  .strict();
export type UserResponse = z.infer<typeof userResponseSchema>;
