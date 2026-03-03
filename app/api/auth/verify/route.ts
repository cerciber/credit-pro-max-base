import { AppHandler } from '@/config/app-handler/app-handler';
import {
  verifyInputSchema,
  VerifyInput,
} from '@/modules/auth/schemas/verify-input-schema';
import {
  verifyOutputResponseSchema,
  VerifyOutputResponse,
} from '@/modules/auth/schemas/verify-output-schema';
import { AuthService } from '@/src/modules/auth/services/auth-service';

export const POST = AppHandler.create(
  {
    inputSchema: verifyInputSchema,
    outputSchema: verifyOutputResponseSchema,
  },
  async function (req: VerifyInput): Promise<VerifyOutputResponse> {
    return new AuthService().verify(req.user);
  }
);
