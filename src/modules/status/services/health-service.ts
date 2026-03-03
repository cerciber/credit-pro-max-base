import { HealthOutputResponse } from '../schemas/health-output-schema';

export class HealthService {
  public async getHealth(): Promise<HealthOutputResponse> {
    return {
      status: 200,
      message: 'Server is running correctly',
      data: { status: 'OK', timestamp: new Date().toISOString() },
    };
  }
}
