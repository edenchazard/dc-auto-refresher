import { defineConfig, devices } from '@playwright/test';

const baseUrl = `http://127.0.0.1:3101`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: baseUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: [
    {
      command: `npm run dev -- --hostname 127.0.0.1 --port 3101`,
      url: baseUrl,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        API_KEY: 'test-api-key',
        DRAGCAVE_API_URL: process.env.DRAGCAVE_API_URL,
        NEXT_DIST_DIR: '.next-e2e',
        NEXT_PUBLIC_BASE_URL: '',
        NEXT_PUBLIC_POST_MESSAGE_ORIGIN: baseUrl,
      },
    },
  ],
});
