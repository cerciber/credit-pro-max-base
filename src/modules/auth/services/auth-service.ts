import { AuthOutputResponse } from '../schemas/auth-output-schema';
import { AuthenticatorService } from './authenticator-service';
import { UserCredentials } from '../schemas/user-credentials-schema';
import { VerifyOutputResponse } from '../schemas/verify-output-schema';
import { UserPayload } from '../../users/schemas/user-schema';

export class AuthService {
  private authenticatorService: AuthenticatorService;

  constructor() {
    this.authenticatorService = new AuthenticatorService();
  }

  public async login(
    credentials: UserCredentials
  ): Promise<AuthOutputResponse> {
    const user = await this.authenticatorService.authenticateUser(credentials);
    const token = this.authenticatorService.generateToken(credentials.username);
    return { status: 200, message: 'Success login', data: { token, user } };
  }

  public async verify(user: UserPayload): Promise<VerifyOutputResponse> {
    return {
      status: 200,
      message: 'Token verified',
      data: { user: user },
    };
  }
}
