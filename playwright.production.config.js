'use strict';

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: { baseURL: 'https://fredstamconsulting.se' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  reporter: [['html', { open: 'never' }]],
  retries: 1,
});
