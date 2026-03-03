import { AppHandler } from '@/src/config/app-handler/app-handler';
import {
  updateUserInputSchema,
  UpdateUserInput,
} from '@/src/modules/users/schemas/update-user-input-schema';
import {
  updateUserOutputSchema,
  UpdateUserOutput,
} from '@/src/modules/users/schemas/update-user-output-schema';
import {
  deleteUserInputSchema,
  DeleteUserInput,
} from '@/src/modules/users/schemas/delete-user-input-schema';
import {
  deleteUserOutputSchema,
  DeleteUserOutput,
} from '@/src/modules/users/schemas/delete-user-output-schema';
import { UsersService } from '@/src/modules/users/services/users-service';

export const PUT = AppHandler.create(
  {
    inputSchema: updateUserInputSchema,
    outputSchema: updateUserOutputSchema,
    roles: ['admin'],
  },
  async function (req: UpdateUserInput): Promise<UpdateUserOutput> {
    const pathParts = req.url.split('/');
    const id = pathParts[pathParts.length - 1];

    const result = await new UsersService().updateUser(id, req.body);
    return result;
  }
);

export const DELETE = AppHandler.create(
  {
    inputSchema: deleteUserInputSchema,
    outputSchema: deleteUserOutputSchema,
    roles: ['admin'],
  },
  async function (req: DeleteUserInput): Promise<DeleteUserOutput> {
    const pathParts = req.url.split('/');
    const id = pathParts[pathParts.length - 1];

    const result = await new UsersService().deleteUser(id);
    return result;
  }
);
