import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isPublicRoute,
  isAuthorizedRoute,
  ROUTES_CONFIG,
  DEFAULT_ROUTES,
} from './app/config/routes';
import { STATICS_CONFIG } from './app/config/statics';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { jwtVerify } from 'jose';
import {
  User,
  UserPayload,
  userPayloadSchema,
} from './src/modules/users/schemas/user-schema';
import { validate } from './src/lib/validate';
import {
  JwtSecret,
  jwtSecretSchema,
} from './src/modules/auth/schemas/jwt-secret-schema';
import { AppError } from './src/config/app-error';

function getToken(request: NextRequest): RequestCookie | undefined {
  return request.cookies.get(STATICS_CONFIG.cookies.authToken);
}

function getPathname(request: NextRequest): string {
  return request.nextUrl.pathname;
}

async function getUserFromToken(
  token: RequestCookie | undefined
): Promise<User | null> {
  if (!token) return null;

  const jwtSecret = validate<JwtSecret>(
    process.env.JWT_SECRET,
    jwtSecretSchema,
    'Invalid JWT_SECRET environment variable'
  );

  const secret = new TextEncoder().encode(jwtSecret);

  let payload: UserPayload;
  try {
    payload = (await jwtVerify(token.value, secret)).payload as UserPayload;
  } catch {
    return null;
  }
  const userPayload = validate<UserPayload>(
    payload,
    userPayloadSchema,
    'Invalid token user payload'
  );
  return {
    name: userPayload.name,
    id: userPayload.id,
    username: userPayload.username,
    email: userPayload.email,
    role: userPayload.role,
    genre: userPayload.genre,
  };
}

async function isForbidden(
  pathname: string,
  token: RequestCookie | undefined
): Promise<boolean> {
  if (isPublicRoute(pathname)) {
    return false;
  }

  if (!token) {
    return true;
  }

  const user = await getUserFromToken(token);
  if (!user) {
    return true;
  }

  const routeExists = Object.values(ROUTES_CONFIG.privateRoutes).some(
    (route) => {
      const normalizedRoute = route.path.replace(/\/$/, '');
      const normalizedPathname = pathname.replace(/\/$/, '');
      return normalizedPathname === normalizedRoute;
    }
  );

  if (!routeExists) {
    return true;
  }

  return !isAuthorizedRoute(pathname, user.role);
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    const pathname = getPathname(request);
    const token = getToken(request);

    if (await isForbidden(pathname, token)) {
      const user = await getUserFromToken(token);

      if (!user) {
        return NextResponse.redirect(
          new URL(DEFAULT_ROUTES.publicRoute, request.url)
        );
      } else {
        return NextResponse.redirect(
          new URL(DEFAULT_ROUTES.privateRoute.path, request.url)
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    let errorData: { status: number; message: string; data: any };
    if (error instanceof AppError) {
      errorData = {
        status: error.status,
        message: error.message,
        data: error.data,
      };
    } else {
      errorData = {
        status: 500,
        message: `Unhandled error: ${(error as Error)?.message || 'Unknown error'}`,
        data: JSON.stringify(error),
      };
    }
    // eslint-disable-next-line no-console
    console.error(errorData);
    return NextResponse.json({
      status: 500,
      message: 'Unhandled error, try again later.',
      data: errorData,
    });
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
