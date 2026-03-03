import { CustomNextRequest } from '../app-handler';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../../../modules/users/schemas/user-schema';
import { AppError } from '../../app-error';
import { ENDPOINTS_CONFIG, EndpointConfig } from '../../statics/endpoints';
import { validate } from '../../../lib/validate';
import {
  JwtSecret,
  jwtSecretSchema,
} from '../../../modules/auth/schemas/jwt-secret-schema';

enum AuthState {
  AUTHORIZED = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
}

interface AuthData {
  url: string;
  method: string;
  token: string;
}

export class AuthAction {
  private secret: string;

  constructor() {
    this.secret = validate<JwtSecret>(
      process.env.JWT_SECRET,
      jwtSecretSchema,
      'Invalid JWT_SECRET environment variable'
    );
  }

  private getAuthActionError(
    message: string,
    state: AuthState,
    data: AuthData
  ): AppError<AuthData> {
    return new AppError<AuthData>(message, data, state);
  }

  private matchPath(pattern: string, path: string): boolean {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) return false;

    return patternParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index];
    });
  }

  private validateEndpoint(req: CustomNextRequest): EndpointConfig {
    const url = req.url || '';
    const method = req.method || '';

    const endpoint = ENDPOINTS_CONFIG.find(
      (config: EndpointConfig) =>
        this.matchPath(config.path, url) && config.method === method
    );
    if (!endpoint) {
      throw this.getAuthActionError('Endpoint not found', AuthState.NOT_FOUND, {
        url,
        method,
        token: '',
      });
    }
    return endpoint;
  }

  private isPublicEndpoint(endpoint: EndpointConfig): boolean {
    return !endpoint.isPrivate;
  }

  private getToken(req: CustomNextRequest, endpoint: EndpointConfig): string {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw this.getAuthActionError(
        'No token provided',
        AuthState.UNAUTHORIZED,
        {
          url: endpoint.path,
          method: endpoint.method,
          token: 'Not token provided',
        }
      );
    }
    return token;
  }

  private validateCronToken(token: string): UserPayload | undefined {
    const cronSecret = process.env.CRON_SECRET || 'default-secret';
    if (!cronSecret || token !== cronSecret) {
      return undefined;
    }

    return {
      id: 'cron',
      email: 'cron@system',
      role: 'cron',
      name: 'Cron System',
      username: 'cron',
      genre: 'M',
      iat: 0,
      exp: 0,
    };
  }

  private validateJwtToken(
    token: string,
    endpoint: EndpointConfig
  ): UserPayload {
    let decodedUser: UserPayload;
    try {
      decodedUser = jwt.verify(token, this.secret) as UserPayload;
      if (!decodedUser) {
        throw this.getAuthActionError(
          'Token does not contain user',
          AuthState.UNAUTHORIZED,
          {
            url: endpoint.path,
            method: endpoint.method,
            token,
          }
        );
      }
      return decodedUser;
    } catch {
      throw this.getAuthActionError('Invalid token', AuthState.UNAUTHORIZED, {
        url: endpoint.path,
        method: endpoint.method,
        token,
      });
    }
  }

  private validateToken(token: string, endpoint: EndpointConfig): UserPayload {
    const decodedCronUser = this.validateCronToken(token);
    if (decodedCronUser) return decodedCronUser;
    return this.validateJwtToken(token, endpoint);
  }

  private assignUserToReq(req: CustomNextRequest, user: UserPayload): void {
    req.user = user;
  }

  private validateRoles(
    endpoint: EndpointConfig,
    user: UserPayload,
    token: string,
    allowedRoles?: string[]
  ): void {
    if (!allowedRoles || allowedRoles.length === 0) return;

    if (!allowedRoles.includes(user.role)) {
      throw this.getAuthActionError(
        'User does not have the required role to access this endpoint',
        AuthState.FORBIDDEN,
        {
          url: endpoint.path,
          method: endpoint.method,
          token,
        }
      );
    }
  }

  public validate(req: CustomNextRequest, allowedRoles?: string[]): void {
    const endpoint = this.validateEndpoint(req);
    if (this.isPublicEndpoint(endpoint)) return;
    const token = this.getToken(req, endpoint);
    const decodedUser = this.validateToken(token, endpoint);
    this.validateRoles(endpoint, decodedUser, token, allowedRoles);
    this.assignUserToReq(req, decodedUser);
  }
}
