import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3101);
const MOCK_PORT = Number(process.env.MOCK_DRAGCAVE_PORT ?? 3100);
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
      command: 'node tests/mock-dragcave-api.mjs',
      url: `http://127.0.0.1:${MOCK_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        MOCK_DRAGCAVE_PORT: String(MOCK_PORT),
      },
    },
    {
      command: `npm run dev -- --hostname 127.0.0.1 --port ${PORT}`,
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        API_KEY: 'test-api-key',
        DRAGCAVE_API_BASE_URL: `http://127.0.0.1:${MOCK_PORT}/api/v2`,
        NEXT_DIST_DIR: '.next-e2e',
        NEXT_PUBLIC_BASE_URL: '',
        NEXT_PUBLIC_POST_MESSAGE_ORIGIN: BASE_URL,
      },
    },
  ],
});
