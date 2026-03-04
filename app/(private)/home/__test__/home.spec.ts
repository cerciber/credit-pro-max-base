import { test } from '@playwright/test';
import { doLogin } from '../../../../tests/helpers/login-helpers';
import { DEFAULT_ROUTES } from '@/app/config/routes';

test.describe('Home page', () => {
  doTest('Successfully', async ({ page }) => {
    await doLogin(page, 'CC1000300001', '12345678');
    await page.waitForURL(DEFAULT_ROUTES.privateRoute.path);
  });
});
