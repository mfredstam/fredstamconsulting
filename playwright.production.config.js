'use strict';

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  // courses.html is unlisted (noindex) — only exercised by the local suite, not the production smoke run
  testIgnore: '**/courses.spec.js',
  use: { baseURL: 'https://fredstamconsulting.se' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  reporter: [['html', { open: 'never' }]],
  retries: 1,
});
