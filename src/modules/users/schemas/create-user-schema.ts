import { z } from 'zod';
import { userSchema } from './user-schema';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUserSchema = userSchema.omit({ id: true }).extend({
  password: z.string().min(1),
});
export type CreateUser = z.infer<typeof createUserSchema>;
