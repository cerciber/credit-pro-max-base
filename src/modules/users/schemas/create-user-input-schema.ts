import { z } from 'zod';
import { getRoles } from '@/src/lib/get-roles';

export const createUserBodySchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(1, 'El nombre es requerido'),
  role: z.enum(getRoles()),
  genre: z.enum(['M', 'F']),
});

export const createUserInputSchema = z.object({
  body: createUserBodySchema,
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
