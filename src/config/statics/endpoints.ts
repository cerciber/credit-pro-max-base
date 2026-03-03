import { CLIENT_ENDPOINTS_CONFIG } from './client/endpoints';

export interface EndpointConfig {
  path: string;
  method: string;
  isPrivate: boolean;
  roles?: string[];
}

export const ENDPOINTS_CONFIG: EndpointConfig[] = [
  {
    path: '/api/auth/login',
    method: 'POST',
    isPrivate: false,
  },
  {
    path: '/api/auth/verify',
    method: 'POST',
    isPrivate: true,
  },
  {
    path: '/api/status/health',
    method: 'GET',
    isPrivate: true,
    roles: ['admin', 'cron'],
  },
  {
    path: '/api/users',
    method: 'GET',
    isPrivate: true,
    roles: ['admin'],
  },
  {
    path: '/api/users',
    method: 'POST',
    isPrivate: true,
    roles: ['admin'],
  },
  {
    path: '/api/users/:id',
    method: 'PUT',
    isPrivate: true,
    roles: ['admin'],
  },
  {
    path: '/api/users/:id',
    method: 'DELETE',
    isPrivate: true,
    roles: ['admin'],
  },
  ...CLIENT_ENDPOINTS_CONFIG,
];
