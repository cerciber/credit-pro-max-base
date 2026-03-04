import { z } from 'zod';

export const mulesoftUriSchema = z.string().min(1);
export type MulesoftUri = z.infer<typeof mulesoftUriSchema>;
