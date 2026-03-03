import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import './tests/global-test';

dotenv.config({ path: '.env.test', quiet: true });

const url = 'http://localhost:3000';

const webServer = {
  command: 'npm run dev:test',
  url,
};

export default defineConfig({
  testDir: './',
  use: {
    baseURL: url,
  },
  webServer: process.env.USE_WEBSERVER === 'true' ? webServer : undefined,
  projects: [
    {
      name: 'chromium',
      use: {
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    },
  ],
});
