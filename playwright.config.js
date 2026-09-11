// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',

      use: {

        // Use installed Google Chrome
        channel: 'chrome',

        // Use actual browser window size
        viewport: null,

        // Maximize Chrome window
        launchOptions: {
          args: [
            '--start-maximized',
            '--force-device-scale-factor=0.6',
          ],
        },
      },
    },
  ],
});