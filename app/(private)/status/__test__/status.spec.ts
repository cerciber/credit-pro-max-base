import { test, expect, Page } from '@playwright/test';
import { UsersRepository } from '../../../../src/modules/users/repository/users-repository';
import {
  generateTestUser,
  createUser,
  deleteUser,
} from '../../../../tests/helpers/user-helpers';
import { doLogin } from '../../../../tests/helpers/login-helpers';
import { CreateUser } from '../../../../src/modules/users/schemas/create-user-schema';

test.describe('Status page', () => {
  let usersRepository: UsersRepository;
  let testUser: CreateUser;

  const clickCheckHealth = async (page: Page): Promise<void> => {
    await page.click('[data-testid="check-health-button"]');
  };

  const waitForStatusValue = async (
    page: Page,
    expectedStatus: string
  ): Promise<void> => {
    await expect(page.locator('[data-testid="status-value"]')).toContainText(
      expectedStatus
    );
  };

  const waitForTimestampValue = async (page: Page): Promise<void> => {
    await expect(
      page.locator('[data-testid="timestamp-value"]')
    ).not.toContainText('-');
  };

  const mockHealthCheckError = async (page: Page): Promise<void> => {
    await page.route('**/api/status/health', async (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });
  };

  test.beforeAll(async () => {
    usersRepository = new UsersRepository();
  });

  test.beforeEach(async () => {
    testUser = generateTestUser('admin');
    await deleteUser(usersRepository, testUser);
    await createUser(usersRepository, testUser);
  });

  test.afterEach(async () => {
    await deleteUser(usersRepository, testUser);
  });

  doTest('Successfully', async ({ page }) => {
    await doLogin(page, testUser.username, testUser.password);
    await page.waitForURL('/home');
    await page.goto('/status');
    await clickCheckHealth(page);
    await waitForStatusValue(page, 'OK');
    await waitForTimestampValue(page);
  });

  doTest(
    'Error',
    async ({ page }) => {
      await mockHealthCheckError(page);
      await doLogin(page, testUser.username, testUser.password);
      await page.waitForURL('/home');
      await page.goto('/status');
      await clickCheckHealth(page);
      await waitForStatusValue(page, 'ERROR');
      await waitForTimestampValue(page);
    },
    { statusCodeExceptions: [500] }
  );
});
