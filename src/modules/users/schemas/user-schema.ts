import { z } from 'zod';
import { getRoles } from '@/src/lib/get-roles';

export const userSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    role: z.enum(getRoles()),
    name: z.string(),
    genre: z.enum(['M', 'F']),
  })
  .strict();
export type User = z.infer<typeof userSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userWithPasswordSchema = userSchema.extend({
  password: z.string().min(1),
});

export type UserWithPassword = z.infer<typeof userWithPasswordSchema>;

export const userPayloadSchema = userSchema.extend({
  iat: z.number(),
  exp: z.number(),
});
export type UserPayload = z.infer<typeof userPayloadSchema>;
