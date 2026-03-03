import { z } from 'zod';
import { userCredentialsSchema } from './user-credentials-schema';

export const authInputSchema = z.object({
  body: userCredentialsSchema,
});
export type AuthInput = z.infer<typeof authInputSchema>;
