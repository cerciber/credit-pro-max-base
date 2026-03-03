import { z } from 'zod';

export const jwtSecretSchema = z.string().min(1);
export type JwtSecret = z.infer<typeof jwtSecretSchema>;
