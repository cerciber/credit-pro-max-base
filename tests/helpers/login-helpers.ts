import { Page } from '@playwright/test';

export const doLogin = async (
  page: Page,
  username: string,
  password: string
): Promise<void> => {
  await page.goto('/login');
  await page.fill('[data-testid="login-username-input"]', username);
  await page.fill('[data-testid="login-password-input"]', password);
  await page.click('[data-testid="login-button"]');
};
