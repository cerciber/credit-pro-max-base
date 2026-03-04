import { test, expect, Page } from '@playwright/test';
import { doLogin } from '../../../../tests/helpers/login-helpers';

test.describe('Home page', () => {
  const checkWelcomeCard = async (page: Page): Promise<void> => {
    await expect(page.locator('[data-testid="welcome-card"]')).toBeVisible();
  };

  doTest('Successfully', async ({ page }) => {
    await doLogin(page, 'CC1000300001', '12345678');
    await page.waitForURL('/home');
    await checkWelcomeCard(page);
  });
});
