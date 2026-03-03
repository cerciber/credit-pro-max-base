import { z } from 'zod';
import { AppError } from '../config/app-error';

export function validate<T>(
  data: unknown,
  schema: z.ZodSchema,
  invalidMessage: string
): T {
  try {
    schema.parse(data);
    return data as T;
  } catch (error) {
    let errors: z.ZodIssue[] = [];
    if (error instanceof z.ZodError) {
      errors = error.issues;
    } else {
      errors = [
        {
          code: 'custom',
          message: (error as Error)?.message || 'Error desconocido',
          path: [],
        },
      ];
    }
    throw new AppError<any>(`${invalidMessage}`, errors, 400);
  }
}
