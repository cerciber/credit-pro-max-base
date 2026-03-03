import { test as originalTest, Page } from '@playwright/test';
import { Exceptions } from './global-test';

type TestBody = { page: Page };

export type Exceptions = {
  statusCodeExceptions?: number[];
};

declare global {
  function doTest(
    title: string,
    testFn: (context: TestBody) => Promise<void>,
    exceptions?: Exceptions = {}
  ): ReturnType<typeof originalTest>;
}
