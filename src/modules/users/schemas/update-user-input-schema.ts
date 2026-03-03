import { z } from 'zod';
import { getRoles } from '@/src/lib/get-roles';

export const updateUserBodySchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido').optional(),
  email: z.string().email('Debe ser un email válido').optional(),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional(),
  name: z.string().min(1, 'El nombre es requerido').optional(),
  role: z.enum(getRoles()).optional(),
  genre: z.enum(['M', 'F']).optional(),
});

export const updateUserInputSchema = z.object({
  url: z.string(),
  body: updateUserBodySchema,
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
