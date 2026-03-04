import { z } from 'zod';

const usernameWithIdentTypeRegex = /^[A-Za-z]{2,10}\d+$/;

export const userCredentialsSchema = z.object({
  username: z
    .string()
    .min(1)
    .regex(
      usernameWithIdentTypeRegex,
      'Username must start with ident type and end with numeric document'
    ),
  password: z.string().min(1),
});
export type UserCredentials = z.infer<typeof userCredentialsSchema>;
