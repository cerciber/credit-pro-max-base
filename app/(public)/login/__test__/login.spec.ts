import { test, expect, Page } from '@playwright/test';
import { UsersRepository } from '../../../../src/modules/users/repository/users-repository';
import { STATICS_CONFIG } from '../../../config/statics';
import { jwtVerify } from 'jose';
import { validate } from '../../../../src/lib/validate';
import {
  UserPayload,
  userPayloadSchema,
} from '../../../../src/modules/users/schemas/user-schema';
import {
  JwtSecret,
  jwtSecretSchema,
} from '../../../../src/modules/auth/schemas/jwt-secret-schema';
import {
  generateTestUser,
  createUser,
  deleteUser,
} from '../../../../tests/helpers/user-helpers';
import { doLogin } from '../../../../tests/helpers/login-helpers';
import { CreateUser } from '../../../../src/modules/users/schemas/create-user-schema';

test.describe('Login', () => {
  let usersRepository: UsersRepository;
  let testUser: CreateUser;

  const checkErrorMessage = async (
    page: Page,
    expectedMessage: string
  ): Promise<void> => {
    await expect(
      page.locator('[data-testid="alert-notification"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="alert-notification"]')
    ).toContainText(expectedMessage);
  };

  const validateTokenInCookies = async (page: Page): Promise<void> => {
    const cookies = await page.context().cookies();
    const authCookie = cookies.find(
      (cookie) => cookie.name === STATICS_CONFIG.cookies.authToken
    );
    const token = authCookie?.value ?? '';
    const jwtSecret = validate<JwtSecret>(
      process.env.JWT_SECRET,
      jwtSecretSchema,
      'Invalid JWT_SECRET environment variable'
    );
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);
    validate<UserPayload>(
      payload,
      userPayloadSchema,
      'Invalid token user payload'
    );
  };

  const validateNoAuthCookie = async (page: Page): Promise<void> => {
    const cookies = await page.context().cookies();
    const authCookie = cookies.find(
      (cookie) => cookie.name === STATICS_CONFIG.cookies.authToken
    );
    expect(authCookie).toBeUndefined();
  };

  test.beforeAll(async () => {
    usersRepository = new UsersRepository();
  });

  test.beforeEach(async () => {
    testUser = generateTestUser('client');
    await deleteUser(usersRepository, testUser);
    await createUser(usersRepository, testUser);
  });

  test.afterEach(async () => {
    await deleteUser(usersRepository, testUser);
  });

  doTest('Successfully', async ({ page }) => {
    await doLogin(page, testUser.username, testUser.password);
    await page.waitForURL('/home');
    await validateTokenInCookies(page);
  });

  doTest(
    'Bad credentials',
    async ({ page }) => {
      await doLogin(page, testUser.username, 'wrongpassword');
      await checkErrorMessage(page, 'Usuario o contraseña incorrectos');
      await validateNoAuthCookie(page);
    },
    { statusCodeExceptions: [401] }
  );
});
