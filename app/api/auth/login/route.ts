import { AppHandler } from '@/config/app-handler/app-handler';
import {
  authInputSchema,
  AuthInput,
} from '@/modules/auth/schemas/auth-input-schema';
import {
  authOutputResponseSchema,
  AuthOutputResponse,
} from '@/modules/auth/schemas/auth-output-schema';
import { AuthService } from '@/modules/auth/services/auth-service';

export const POST = AppHandler.create(
  {
    inputSchema: authInputSchema,
    outputSchema: authOutputResponseSchema,
  },
  async function (req: AuthInput): Promise<AuthOutputResponse> {
    return new AuthService().login(req.body);
  }
);
