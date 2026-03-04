import { z } from 'zod';
import { userPayloadSchema } from './user-schema';

export const verifyOutputResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    user: userPayloadSchema,
  }),
});
export type VerifyOutputResponse = z.infer<typeof verifyOutputResponseSchema>;
