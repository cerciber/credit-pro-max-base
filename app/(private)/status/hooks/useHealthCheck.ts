import { useState } from 'react';
import { api } from '../../../lib/api';
import { API_ROUTES } from '../../../config/routes';
import { HealthOutputResponse } from '@/src/modules/status/schemas/health-output-schema';

export function useHealthCheck(): {
  status: {
    status: 'idle' | 'loading' | 'success' | 'error';
    serverStatus?: string;
    timestamp?: string;
  };
  checkHealth: () => Promise<void>;
} {
  const [status, setStatus] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    serverStatus?: string;
    timestamp?: string;
  }>({
    status: 'idle',
  });

  const checkHealth = async (): Promise<void> => {
    setStatus({ status: 'loading' });

    try {
      const response = await api.get<HealthOutputResponse>(
        API_ROUTES.status.health
      );
      setStatus({
        status: 'success',
        serverStatus: response.data.status,
        timestamp: response.data.timestamp,
      });
    } catch {
      setStatus({
        status: 'error',
        serverStatus: 'ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  return { status, checkHealth };
}
