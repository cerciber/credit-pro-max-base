import jwt from 'jsonwebtoken';
import { UserCredentials } from '../schemas/user-credentials-schema';
import { AuthenticatorRepository } from '../repository/authenticator-repository';
import { AppError } from '../../../config/app-error';
import { validate } from '@/src/lib/validate';
import { JwtSecret, jwtSecretSchema } from '../schemas/jwt-secret-schema';
import { CustomerAlreadyExistsResponse } from '../schemas/user-management-v1-customer-schema';

export class AuthenticatorService {
  private jwtSecret: string;
  private jwtExpiresIn: number;
  private repository: AuthenticatorRepository;

  constructor() {
    this.jwtSecret = validate<JwtSecret>(
      process.env.JWT_SECRET,
      jwtSecretSchema,
      'Invalid JWT_SECRET environment variable'
    );
    this.jwtExpiresIn = 24 * 60 * 60 * 1000;
    this.repository = new AuthenticatorRepository();
  }

  public generateToken(username: string): string {
    return jwt.sign({ username, role: 'client' }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }

  public async authenticateUser(
    credentials: UserCredentials
  ): Promise<CustomerAlreadyExistsResponse> {
    if (credentials.password !== '12345678') {
      throw new AppError('Invalid password', undefined, 401);
    }
    return this.repository.findUserByIdentSerialNum(credentials.username);
  }
}
