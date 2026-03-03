import { AppHandler } from '@/src/config/app-handler/app-handler';
import { getUsersInputSchema } from '@/src/modules/users/schemas/get-users-input-schema';
import {
  getUsersOutputSchema,
  GetUsersOutput,
} from '@/src/modules/users/schemas/get-users-output-schema';
import {
  createUserInputSchema,
  CreateUserInput,
} from '@/src/modules/users/schemas/create-user-input-schema';
import {
  createUserOutputSchema,
  CreateUserOutput,
} from '@/src/modules/users/schemas/create-user-output-schema';
import { UsersService } from '@/src/modules/users/services/users-service';

export const GET = AppHandler.create(
  {
    inputSchema: getUsersInputSchema,
    outputSchema: getUsersOutputSchema,
    roles: ['admin'],
  },
  async function (): Promise<GetUsersOutput> {
    const users = await new UsersService().getAllUsers();
    return {
      status: 200,
      message: 'Users retrieved successfully',
      data: users,
    };
  }
);

export const POST = AppHandler.create(
  {
    inputSchema: createUserInputSchema,
    outputSchema: createUserOutputSchema,
    roles: ['admin'],
  },
  async function (req: CreateUserInput): Promise<CreateUserOutput> {
    const result = await new UsersService().createUser(req.body);
    return result;
  }
);
