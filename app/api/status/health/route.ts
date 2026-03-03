import { STATICS_CONFIG } from '@/app/config/statics';
import { AppHandler } from '../../../../src/config/app-handler/app-handler';
import { healthInputSchema } from '../../../../src/modules/status/schemas/health-input-schema';
import {
  healthOutputResponseSchema,
  HealthOutputResponse,
} from '../../../../src/modules/status/schemas/health-output-schema';
import { HealthService } from '../../../../src/modules/status/services/health-service';

export const GET = AppHandler.create(
  {
    inputSchema: healthInputSchema,
    outputSchema: healthOutputResponseSchema,
    roles: [STATICS_CONFIG.roles.admin, STATICS_CONFIG.roles.cron],
  },
  async function (): Promise<HealthOutputResponse> {
    return new HealthService().getHealth();
  }
);
