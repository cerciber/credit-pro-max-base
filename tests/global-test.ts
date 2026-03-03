// Este archivo se importa automáticamente en todas las pruebas
import { test as originalTest, Page } from '@playwright/test';
import { ClientHelper } from './helpers/client-helper';
import { Exceptions } from './global-types';

type TestBody = { page: Page };

async function waitForStablePage(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => {
    return new Promise((resolve) => {
      window.addEventListener('load', () => resolve(true));
      if (document.readyState === 'complete') {
        resolve(true);
      }
    });
  });
}

global.doTest = function (
  title: string,
  testFn: (context: TestBody) => Promise<void>,
  exceptions: Exceptions = {}
): ReturnType<typeof originalTest> {
  return originalTest(title, async ({ page }: TestBody) => {
    const clientHelper = new ClientHelper(page, exceptions);
    try {
      await testFn({ page });
      await waitForStablePage(page);
      clientHelper.validateNoErrors();
    } catch (error) {
      clientHelper.validateNoErrors();
      throw error;
    }
  });
};
