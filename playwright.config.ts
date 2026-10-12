import { defineConfig } from '@playwright/test';

const PORT = 9009;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  // Tests interact with the same Storybook server, so keep the report readable
  // and avoid overwhelming the dev server on CI.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: {
    // Mirrors Cypress' generous `defaultCommandTimeout` so retry-able
    // assertions have time to settle while menus/popovers animate.
    timeout: 20_000,
  },
  use: {
    baseURL,
    viewport: { width: 1024, height: 768 },
    // Required so `locator.tap()` (the `cy.realTouch()` equivalent) works.
    hasTouch: true,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
