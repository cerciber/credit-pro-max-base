import { test, expect, Page } from '@playwright/test';
import {
  verifyOutputResponseSchema,
  VerifyOutputResponse,
} from '../../../../src/modules/auth/schemas/verify-output-schema';
import { validate } from '../../../../src/lib/validate';
import { STATICS_CONFIG } from '@/app/config/statics';
import { doLogin } from '../../../../tests/helpers/login-helpers';
import { DEFAULT_ROUTES } from '@/app/config/routes';

test.describe('Verify', () => {
  const waitForVerifyRequest = async (page: Page): Promise<void> => {
    const response = await page.waitForResponse(
      (response) =>
        response.url().includes('/api/auth/verify') &&
        response.request().method() === 'POST'
    );
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    validate<VerifyOutputResponse>(
      responseData,
      verifyOutputResponseSchema,
      'Invalid verify response schema'
    );
  };

  const waitForFailedVerifyRequest = async (page: Page): Promise<void> => {
    const response = await page.waitForResponse(
      (response) =>
        response.url().includes('/api/auth/verify') &&
        response.request().method() === 'POST'
    );
    expect(response.status()).toBe(401);
  };

  const setInvalidToken = async (page: Page): Promise<void> => {
    await page.context().addCookies([
      {
        name: STATICS_CONFIG.cookies.authToken,
        value: 'invalid-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
  };

  const reload = async (page: Page, url: string): Promise<void> => {
    await page.waitForURL(url);
    await page.goto(url);
  };

  doTest('Successfully', async ({ page }) => {
    await doLogin(page, 'CC1000300001', '12345678');
    await reload(page, DEFAULT_ROUTES.privateRoute.path);
    await waitForVerifyRequest(page);
    await page.waitForURL(DEFAULT_ROUTES.privateRoute.path);
  });

  doTest(
    'Invalid token',
    async ({ page }) => {
      await setInvalidToken(page);
      await page.goto(DEFAULT_ROUTES.privateRoute.path);
      await waitForFailedVerifyRequest(page);
      await page.waitForURL(DEFAULT_ROUTES.publicRoute);
    },
    { statusCodeExceptions: [401] }
  );
});
