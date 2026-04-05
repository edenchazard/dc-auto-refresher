import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: `http://127.0.0.1:4123/`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --host 0.0.0.0 --port 4123`,
    url: `http://127.0.0.1:4123/`,
    timeout: 120 * 1000,
    env: {
      ...process.env,
      BASE_URL: '/',
    },
  },
});
