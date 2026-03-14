# Test Suite Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add E2E browser tests (Playwright), accessibility audits (axe-core), and HTML validation (html-validate) that run automatically on every PR.

**Architecture:** A `package.json` introduces dev-only tooling — no changes to the served static files. Playwright uses its built-in `webServer` config to start `serve` on port 3000 before each test run. All tests live in a single `tests/site.spec.js` file. A new `test.yml` CI workflow runs on every PR alongside the existing `lint.yml`.

**Tech Stack:** Playwright (Chromium only), @axe-core/playwright, html-validate, serve@14, GitHub Actions

---

## Chunk 1: Project Setup

### Task 1: Create package.json

**Files:**
- Create: `package.json`

- [ ] **Step 1: Create package.json**

```json
{
  "devDependencies": {
    "@axe-core/playwright": "latest",
    "@playwright/test": "latest",
    "html-validate": "latest",
    "serve": "^14"
  },
  "scripts": {
    "test": "npm run test:html && npm run test:e2e",
    "test:html": "html-validate index.html",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 2: Run npm install to generate the lockfile**

```bash
npm install
```

Expected: `node_modules/` created, `package-lock.json` generated.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add package.json with test devDependencies"
```

---

### Task 2: Create playwright.config.js

**Files:**
- Create: `playwright.config.js`

- [ ] **Step 1: Create playwright.config.js**

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add playwright.config.js
git commit -m "chore: add playwright.config.js"
```

---

### Task 3: Create .htmlvalidate.json

**Files:**
- Create: `.htmlvalidate.json`

- [ ] **Step 1: Create .htmlvalidate.json**

```json
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "no-style-tag": "off"
  }
}
```

`no-style-tag` is disabled because `index.html` contains `<noscript><style>...</style></noscript>` by design.

- [ ] **Step 2: Run html-validate to verify index.html passes now**

```bash
npm run test:html
```

Expected: exits 0 with no output. If violations appear, add rule overrides for each one to `.htmlvalidate.json` with a comment explaining why, then re-run until clean.

- [ ] **Step 3: Commit**

```bash
git add .htmlvalidate.json
git commit -m "chore: add html-validate config"
```

---

### Task 4: Update .gitignore and install Playwright browsers

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add test artifact directories to .gitignore**

Append to `.gitignore`:
```
node_modules/
playwright-report/
test-results/
```

- [ ] **Step 2: Install Playwright's Chromium browser**

```bash
npx playwright install --with-deps chromium
```

Expected: Chromium and its OS dependencies are downloaded. No errors.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: add test artifact dirs to .gitignore"
```

---

## Chunk 2: Tests

### Task 5: Write page structure E2E tests

**Files:**
- Create: `tests/site.spec.js`

These tests verify that key elements exist and contain the correct content. Since they test existing working code, they should pass immediately. If one fails, the test assertion or selector is wrong — fix the test before moving on.

- [ ] **Step 1: Create tests/site.spec.js with the page structure tests**

```js
'use strict';

const { test, expect } = require('@playwright/test');
const { checkA11y, injectAxe } = require('@axe-core/playwright');

test.describe('Page structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page title contains "Fredstam Consulting"', async ({ page }) => {
    await expect(page).toHaveTitle(/Fredstam Consulting/);
  });

  test('meta description is non-empty', async ({ page }) => {
    const content = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(content).toBeTruthy();
  });

  test('all four nav links are present', async ({ page }) => {
    for (const href of ['#intro', '#services', '#about', '#contact']) {
      await expect(page.locator(`a.nav-link[href="${href}"]`)).toHaveCount(1);
    }
  });

  test('skip link is present', async ({ page }) => {
    await expect(page.locator('.skip-link')).toHaveCount(1);
  });

  test('footer year matches current year', async ({ page }) => {
    const result = await page.evaluate(() => ({
      footerYear: document.getElementById('footer-year')?.textContent?.trim(),
      currentYear: String(new Date().getFullYear()),
    }));
    expect(result.footerYear).toBe(result.currentYear);
  });

  test('all external links have rel="noopener noreferrer"', async ({ page }) => {
    const links = await page.locator('a[target="_blank"]').all();
    for (const link of links) {
      const rel = await link.getAttribute('rel');
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  });
});
```

- [ ] **Step 2: Run only the page structure tests**

```bash
npx playwright test --grep "Page structure"
```

Expected: 6 tests pass. If any fail, check the selector or assertion — the site is working code, so a failure here means the test is wrong.

- [ ] **Step 3: Commit**

```bash
git add tests/site.spec.js
git commit -m "test: add page structure E2E tests"
```

---

### Task 6: Add hamburger menu tests

**Files:**
- Modify: `tests/site.spec.js`

The hamburger is only rendered at `max-width: 767px`. These tests use `test.use({ viewport: { width: 375, height: 812 } })` to force mobile viewport for the whole describe block.

- [ ] **Step 1: Append hamburger tests to tests/site.spec.js**

Add after the existing `test.describe('Page structure', ...)` block:

```js
test.describe('Hamburger menu', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking hamburger opens the nav', async ({ page }) => {
    await page.locator('#hamburger-btn').click();
    await expect(page.locator('#site-nav')).toHaveClass(/is-open/);
    await expect(page.locator('#hamburger-btn')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  test('pressing Escape closes the nav and focuses hamburger', async ({
    page,
  }) => {
    await page.locator('#hamburger-btn').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#site-nav')).not.toHaveClass(/is-open/);
    await expect(page.locator('#hamburger-btn')).toBeFocused();
  });

  test('clicking a nav link closes the nav', async ({ page }) => {
    await page.locator('#hamburger-btn').click();
    await page.locator('#site-nav .nav-link').first().click();
    await expect(page.locator('#site-nav')).not.toHaveClass(/is-open/);
  });
});
```

- [ ] **Step 2: Run only the hamburger tests**

```bash
npx playwright test --grep "Hamburger menu"
```

Expected: 3 tests pass. A failure here means either the selector is wrong or the CSS transition delay is causing a race — if so, add a `await page.waitForTimeout(300)` after the click as a last resort (but check the selector first).

- [ ] **Step 3: Commit**

```bash
git add tests/site.spec.js
git commit -m "test: add hamburger menu E2E tests"
```

---

### Task 7: Add accessibility tests

**Files:**
- Modify: `tests/site.spec.js`

axe-core audits the full page at desktop and mobile viewports. Tests use `injectAxe` to load the axe script into the page, then `checkA11y` to run the audit. The `runOnly` option restricts to WCAG 2.1 AA rules (`wcag2a` + `wcag2aa`), excluding `best-practice` extras.

- [ ] **Step 1: Append accessibility tests to tests/site.spec.js**

Add after the hamburger describe block:

```js
test.describe('Accessibility', () => {
  test('desktop: no WCAG 2.1 AA violations', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await injectAxe(page);
    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
      },
    });
  });

  test('mobile: no WCAG 2.1 AA violations', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await injectAxe(page);
    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
      },
    });
  });
});
```

- [ ] **Step 2: Run only the accessibility tests**

```bash
npx playwright test --grep "Accessibility"
```

Expected: 2 tests pass. If violations are reported, axe will print a detailed list — fix the actual a11y issue in `index.html` before proceeding. Do not suppress violations.

- [ ] **Step 3: Run the full test suite to confirm everything passes together**

```bash
npm test
```

Expected: `html-validate` passes (0 output), then 11 Playwright tests pass across 1 worker.

- [ ] **Step 4: Commit**

```bash
git add tests/site.spec.js
git commit -m "test: add axe WCAG 2.1 AA accessibility tests"
```

---

## Chunk 3: CI Workflow

### Task 8: Create test.yml CI workflow

**Files:**
- Create: `.github/workflows/test.yml`

- [ ] **Step 1: Create .github/workflows/test.yml**

```yaml
name: Test

on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Validate HTML
        run: npm run test:html

      - name: Run Playwright tests
        run: npm run test:e2e

      - name: Upload test report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

- [ ] **Step 2: Verify lint.yml is unchanged**

```bash
cat .github/workflows/lint.yml
```

Expected: the file is identical to before — `Lint` workflow, `npx --yes eslint`, `npx --yes stylelint`, `npx --yes prettier`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/test.yml
git commit -m "ci: add test workflow (Playwright + html-validate on every PR)"
```

---

### Task 9: Final verification

- [ ] **Step 1: Run the full local test suite one more time from a clean state**

```bash
npm test
```

Expected: all 11 tests pass, html-validate exits 0.

- [ ] **Step 2: Check git status is clean**

```bash
git status
```

Expected: `nothing to commit, working tree clean`.

- [ ] **Step 3: Push to a branch and open a PR to verify CI triggers**

Create a PR against `main`. Both `Lint` and `Test` checks should appear and pass. If `Test` fails in CI but passes locally, check the artifact uploaded to the PR for the Playwright HTML report.
