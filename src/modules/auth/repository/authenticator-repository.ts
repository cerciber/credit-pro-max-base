import { mulesoftApi } from '../../../lib/mulesoft-api';
import { AppError } from '@/src/config/app-error';
import {
  customerAlreadyExistsSchema,
  customerQuerySchema,
  CustomerAlreadyExistsResponse,
  CustomerQuery,
} from '../schemas/user-management-v1-customer-schema';

export class AuthenticatorRepository {
  public async findUserByIdentSerialNum(
    identSerialNum: string
  ): Promise<CustomerAlreadyExistsResponse> {
    const result = await mulesoftApi.get<
      CustomerQuery,
      CustomerAlreadyExistsResponse
    >('/api/userManagement/v1/Customer', {
      input: {
        govIssueIdentType: 'CC',
        identSerialNum,
        value: 'CREAR',
      },
      inputSchema: customerQuerySchema,
      outputSchema: customerAlreadyExistsSchema,
      expectedSuccessStatus: 400,
    });

    if (result.ok) {
      return result.data;
    }

    throw new AppError(
      'Mulesoft customer request failed',
      result.error,
      401
    );
  }
}
