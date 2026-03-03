import { UsersRepository } from '../../src/modules/users/repository/users-repository';
import { CreateUser } from '../../src/modules/users/schemas/create-user-schema';

export const generateTestUser = (role: string): CreateUser => {
  const timestamp = Date.now();
  return {
    username: `user${timestamp}`,
    email: `user${timestamp}@example.com`,
    role,
    name: `Test User`,
    genre: 'M',
    password: 'testpassword123',
  };
};

export const createUser = async (
  usersRepository: UsersRepository,
  testUser: CreateUser
): Promise<void> => {
  await usersRepository.createUser(testUser);
};

export const deleteUser = async (
  usersRepository: UsersRepository,
  testUser: CreateUser
): Promise<void> => {
  try {
    const collection = await import('../../src/lib/mongodb').then((m) =>
      m.getCollection('users')
    );
    const user = await collection.findOne({ username: testUser.username });
    if (user) {
      await usersRepository.deleteUser(user._id.toString());
    }
  } catch {
    // User not found, continue
  }
};
