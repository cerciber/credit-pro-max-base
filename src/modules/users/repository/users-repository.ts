import { CreateUser } from '../schemas/create-user-schema';
import { User } from '../schemas/user-schema';
import { AppError } from '../../../config/app-error';
import { getCollection } from '../../../lib/mongodb';
import { PasswordEncryption } from '../../../lib/password-encryption';

export class UsersRepository {
  public async createUser(userData: CreateUser): Promise<User> {
    const collection = await getCollection('users');

    const hashedPassword = await PasswordEncryption.hash(userData.password);
    const userDataWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };

    const result = await collection.insertOne(userDataWithHashedPassword);
    const user = await collection.findOne({ _id: result.insertedId });

    if (!user) {
      throw new AppError<undefined>(
        'User not found after creation',
        undefined,
        404
      );
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      genre: user.genre,
    };
  }

  public async deleteUser(id: string): Promise<User> {
    const collection = await getCollection('users');
    const { ObjectId } = await import('mongodb');
    const user = await collection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new AppError<undefined>('User not found', undefined, 404);
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new AppError<undefined>('User not found', undefined, 404);
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      genre: user.genre,
    };
  }

  public async getAllUsers(): Promise<User[]> {
    const collection = await getCollection('users');
    const users = await collection.find({}).toArray();

    return users.map((user) => ({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      genre: user.genre,
    }));
  }

  public async updateUser(
    id: string,
    userData: Partial<CreateUser>
  ): Promise<User> {
    const collection = await getCollection('users');
    const { ObjectId } = await import('mongodb');

    let dataToUpdate = userData;
    if (userData.password) {
      const hashedPassword = await PasswordEncryption.hash(userData.password);
      dataToUpdate = {
        ...userData,
        password: hashedPassword,
      };
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: dataToUpdate },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new AppError<undefined>('User not found', undefined, 404);
    }

    return {
      id: result._id.toString(),
      username: result.username,
      email: result.email,
      role: result.role,
      name: result.name,
      genre: result.genre,
    };
  }
}
