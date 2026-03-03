import bcrypt from 'bcryptjs';

export class PasswordEncryption {
  private static readonly SALT_ROUNDS = 10;

  public static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  public static async compare(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
