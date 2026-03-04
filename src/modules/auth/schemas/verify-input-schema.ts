import { z } from 'zod';
import { userPayloadSchema } from './user-schema';

const verifyInputBodySchema = z.object({});
export type VerifyInputBody = Record<string, never>;

export const verifyInputSchema = z.object({
  body: verifyInputBodySchema,
  user: userPayloadSchema,
});
export type VerifyInput = z.infer<typeof verifyInputSchema>;
