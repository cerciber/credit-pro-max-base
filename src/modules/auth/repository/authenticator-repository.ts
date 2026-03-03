import { UserWithPassword } from '../../users/schemas/user-schema';
import { AppError } from '../../../config/app-error';
import { getCollection } from '../../../lib/mongodb';

export class AuthenticatorRepository {
  public async findUserByUsername(username: string): Promise<UserWithPassword> {
    const collection = await getCollection('users');
    const user = await collection.findOne({ username });
    if (!user) throw new AppError<undefined>('User not found', undefined, 404);
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      name: user.name,
      genre: user.genre,
    };
  }
}
