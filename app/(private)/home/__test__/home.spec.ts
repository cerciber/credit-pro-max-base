import { test, expect, Page } from '@playwright/test';
import { UsersRepository } from '../../../../src/modules/users/repository/users-repository';
import {
  generateTestUser,
  createUser,
  deleteUser,
} from '../../../../tests/helpers/user-helpers';
import { doLogin } from '../../../../tests/helpers/login-helpers';
import { CreateUser } from '../../../../src/modules/users/schemas/create-user-schema';

test.describe('Home page', () => {
  let usersRepository: UsersRepository;
  let testUser: CreateUser;

  const checkWelcomeCard = async (page: Page): Promise<void> => {
    await expect(page.locator('[data-testid="welcome-card"]')).toBeVisible();
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
    await checkWelcomeCard(page);
  });
});
