# Test Suite Design — Fredstam Consulting Static Site

**Date:** 2026-03-14
**Status:** Approved

## Overview

Add an automated test suite to the static site that runs on every PR. The site itself remains static (no build step, no server runtime). Test tooling is dev-only infrastructure managed via `package.json`.

## Goals

- Catch regressions in user-interaction behaviour (hamburger, nav, footer) before they reach `main`
- Enforce accessibility (WCAG 2.1 AA) on every PR via axe-core
- Validate HTML structure and aria usage via html-validate

## Non-goals

- Unit testing JS modules in isolation (no jsdom, no mocking)
- Visual regression / screenshot diffing
- Testing against the live GitHub Pages URL

## Tools

| Tool | Purpose | Version |
|---|---|---|
| `@playwright/test` | Browser automation + test runner | latest |
| `@axe-core/playwright` | Accessibility audit within Playwright | latest |
| `html-validate` | HTML structure validation (no browser) | latest |

Chromium is the only browser target. Firefox and WebKit are out of scope.

## File Structure

```
package.json                    ← devDependencies + test scripts
playwright.config.js            ← Playwright config (Chromium, baseURL)
.htmlvalidate.json              ← html-validate rules config
tests/
  site.spec.js                  ← all Playwright + axe tests
.github/workflows/
  test.yml                      ← new CI workflow (runs on every PR)
  lint.yml                      ← existing, unchanged
```

No changes to `index.html`, `styles.css`, or `script.js`.

## Test Coverage

### E2E (Playwright — Chromium)

| Test | Description |
|---|---|
| Page title | `<title>` contains "Fredstam Consulting" |
| Meta description | `<meta name="description">` is non-empty |
| Nav links | All four links (`#intro`, `#services`, `#about`, `#contact`) present with correct hrefs |
| Skip link | `.skip-link` exists in the DOM |
| Footer year | `#footer-year` is populated and matches current year |
| External links | All `target="_blank"` links have `rel="noopener noreferrer"` |
| Hamburger open | At 375px viewport width, clicking `#hamburger-btn` adds `.is-open` to `#site-nav` and sets `aria-expanded="true"` |
| Hamburger Escape | Pressing Escape closes the nav and returns focus to `#hamburger-btn` |
| Hamburger nav link | Clicking a nav link while menu is open closes the nav |

### Accessibility (axe-core via `@axe-core/playwright`)

| Test | Description |
|---|---|
| Desktop a11y | Full-page axe scan at 1280×720 — zero violations |
| Mobile a11y | Full-page axe scan at 375×812 — zero violations |

### HTML Validation (html-validate CLI)

| Test | Description |
|---|---|
| HTML structure | `index.html` passes html-validate with standard ruleset |

## CI Workflow (`.github/workflows/test.yml`)

Triggers: `pull_request` (opened, synchronize, ready_for_review, reopened) — same events as `lint.yml`.

Steps:
1. Checkout code
2. Setup Node 20
3. `npm ci`
4. Install Playwright browsers (Chromium only) — cached via `actions/cache`
5. Run `html-validate index.html` (fast, no browser)
6. Start static file server in background (`npx serve . --listen 3000`)
7. Run `npx playwright test`
8. Upload Playwright report as artifact on failure

The existing `lint.yml` is unchanged. Lint and tests run as independent PR status checks.

## Local Development

```bash
npm test            # full suite (html-validate + Playwright)
npm run test:html   # html-validate only (fast)
npm run test:e2e    # Playwright only
```

## Constraints

- Zero changes to the served static files (`index.html`, `styles.css`, `script.js`, `fonts/`)
- `package.json` and test files are dev infrastructure only — not deployed
- `npx` continues to work for the existing lint checks (no change to CLAUDE.md workflow)
