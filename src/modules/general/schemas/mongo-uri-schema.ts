import { z } from 'zod';

export const mongoUriSchema = z.string().min(1);
export type MongoUri = z.infer<typeof mongoUriSchema>;
