import { CreateUser } from '../schemas/create-user-schema';
import { UserResponse } from '../schemas/user-response-schema';
import { UsersRepository } from '../repository/users-repository';
import { User } from '../schemas/user-schema';

export class UsersService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  public async createUser(userData: CreateUser): Promise<UserResponse> {
    const user = await this.usersRepository.createUser(userData);

    return {
      status: 201,
      message: 'User created successfully',
      data: user,
    };
  }

  public async deleteUser(id: string): Promise<UserResponse> {
    const user = await this.usersRepository.deleteUser(id);

    return {
      status: 200,
      message: 'User deleted successfully',
      data: user,
    };
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.getAllUsers();
  }

  public async updateUser(
    id: string,
    userData: Partial<CreateUser>
  ): Promise<UserResponse> {
    const user = await this.usersRepository.updateUser(id, userData);

    return {
      status: 200,
      message: 'User updated successfully',
      data: user,
    };
  }
}
