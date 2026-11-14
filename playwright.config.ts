import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3101);
const DRAGCAVE_API_URL =
  process.env.DRAGCAVE_API_URL ?? 'http://127.0.0.1:3100/api/v2';
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `npm run dev -- --hostname 127.0.0.1 --port ${PORT}`,
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        API_KEY: 'test-api-key',
        DRAGCAVE_API_URL,
        NEXT_DIST_DIR: '.next-e2e',
        NEXT_PUBLIC_BASE_URL: '',
        NEXT_PUBLIC_POST_MESSAGE_ORIGIN: BASE_URL,
      },
    },
  ],
});
