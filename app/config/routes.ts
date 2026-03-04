import {
  CLIENT_API_ROUTES,
  CLIENT_DEFAULT_ROUTES,
  CLIENT_ROUTES_CONFIG,
} from './client/routes';

interface DefaultRouteConfig {
  publicRoute: string;
  privateRoute: {
    path: string;
    label: string;
    roles: string[];
  };
}
export interface RouteConfig {
  publicRoutes: Record<string, string>;
  privateRoutes: Record<
    string,
    {
      path: string;
      label: string;
      roles: string[];
    }
  >;
}

export const ROUTES_CONFIG: RouteConfig = {
  publicRoutes: {
    login: '/login',
    ...CLIENT_ROUTES_CONFIG.publicRoutes,
  },
  privateRoutes: {
    home: {
      path: '/home',
      label: 'Inicio',
      roles: ['admin', 'client'],
    },
    status: {
      path: '/status',
      label: 'Estado',
      roles: ['admin'],
    },
    users: {
      path: '/users',
      label: 'Usuarios',
      roles: ['admin'],
    },
    ...CLIENT_ROUTES_CONFIG.privateRoutes,
  },
} as const;

export const API_ROUTES = {
  auth: {
    verify: '/api/auth/verify',
    login: '/api/auth/login',
  },
  status: {
    health: '/api/status/health',
  },
  users: '/api/users',
  ...CLIENT_API_ROUTES,
};

export const DEFAULT_ROUTES: DefaultRouteConfig = {
  ...{
    publicRoute: ROUTES_CONFIG.publicRoutes.login,
    privateRoute: ROUTES_CONFIG.privateRoutes.home,
  },
  ...CLIENT_DEFAULT_ROUTES,
};

export const isPublicRoute = (pathname: string): boolean => {
  const normalizedPathname = pathname.replace(/\/$/, '');

  return Object.values(ROUTES_CONFIG.publicRoutes).some((route) => {
    const normalizedRoute = route.replace(/\/$/, '');
    return normalizedPathname === normalizedRoute;
  });
};

export const isAuthorizedRoute = (pathname: string, role: string): boolean => {
  const normalizedPathname = pathname.replace(/\/$/, '');
  const route = Object.values(ROUTES_CONFIG.privateRoutes).find((route) => {
    const normalizedRoute = route.path.replace(/\/$/, '');
    return normalizedPathname === normalizedRoute;
  });
  if (!route) {
    return true;
  }
  return route.roles.includes(role);
};
