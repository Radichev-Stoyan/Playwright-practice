// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 40 * 1000,

  expect: {
    timeout: 5000,
  },

  reporter: 'html',
  projects: [
    {
      name: 'Safari',
      use: {
        browserName: 'webkit',
        headless: process.env.CI ? true : false,
        screenshot: 'on',
        trace: 'on', // on, off, retain-on-failure
        ...devices['iPhone 14 Pro'],
        // viewport: { width: 1920, height: 1080 },
      }
    },
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
        headless: process.env.CI ? true : false,
        screenshot: 'on',
        trace: 'on', // on, off, retain-on-failure
        // ignoreHTTPSErrors: true,
        // permissions: ['geolocation'],
      }
    }
  ]
});