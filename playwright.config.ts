import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import './tests/global-test';

dotenv.config({ path: '.env', quiet: true });

const port = process.env.PORT;
const url = process.env.BASE_URL || `http://localhost:${port}`;

const webServer = {
  command: `PORT=${port} npm run dev:test`,
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
