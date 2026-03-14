'use strict';

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'npx serve@14 . -l 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  reporter: [['html', { open: 'never' }]],
});
