import { test, expect, Page } from '@playwright/test';
import { STATICS_CONFIG } from '../../../config/statics';
import { jwtVerify } from 'jose';
import { validate } from '../../../../src/lib/validate';
import {
  UserPayload,
  userPayloadSchema,
} from '../../../../src/modules/auth/schemas/user-schema';
import {
  JwtSecret,
  jwtSecretSchema,
} from '../../../../src/modules/auth/schemas/jwt-secret-schema';
import { doLogin } from '../../../../tests/helpers/login-helpers';
import { DEFAULT_ROUTES } from '@/app/config/routes';

test.describe('Login', () => {
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

  doTest('Successfully', async ({ page }) => {
    await doLogin(page, 'CC1000300001', '12345678');
    await page.waitForURL(DEFAULT_ROUTES.privateRoute.path);
    await validateTokenInCookies(page);
  });

  doTest(
    'Bad credentials',
    async ({ page }) => {
      await doLogin(page, 'CC1000300001', 'wrongpassword');
      await checkErrorMessage(page, 'Usuario o contraseña incorrectos');
      await validateNoAuthCookie(page);
    },
    { statusCodeExceptions: [401] }
  );
});
