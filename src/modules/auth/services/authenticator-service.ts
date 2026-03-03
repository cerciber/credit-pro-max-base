import jwt from 'jsonwebtoken';
import { User, UserWithPassword } from '../../users/schemas/user-schema';
import { UserCredentials } from '../schemas/user-credentials-schema';
import { AuthenticatorRepository } from '../repository/authenticator-repository';
import { AppError } from '../../../config/app-error';
import { validate } from '@/src/lib/validate';
import { JwtSecret, jwtSecretSchema } from '../schemas/jwt-secret-schema';
import { PasswordEncryption } from '../../../lib/password-encryption';

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

  public generateToken(user: User): string {
    return jwt.sign(user, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  private removePassword(user: UserWithPassword): User {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async comparePassword(
    password: string,
    storedPassword: string
  ): Promise<void> {
    const isValid = await PasswordEncryption.compare(password, storedPassword);
    if (!isValid) {
      throw new AppError<undefined>('Invalid password', undefined, 401);
    }
  }

  public async authenticateUser(credentials: UserCredentials): Promise<User> {
    const user = await this.repository.findUserByUsername(credentials.username);
    await this.comparePassword(credentials.password, user.password);
    return this.removePassword(user);
  }
}
