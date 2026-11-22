# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository. It is intentionally agent-agnostic — whether you are Claude Code, Codex, Gemini CLI, or another assistant, this file is the single source of truth for how to work here.

## Project Overview

Static single-page website for Marcus Fredstam, freelance embedded software consultant. No build step — files are served directly via GitHub Pages.

**Purpose:** Digital business card / marketing site for Fredstam Consulting.

**File structure:**
```
index.html          — home page: all markup, inline SVG icons, semantic structure
courses.html        — courses subpage
styles.css          — all styles, design tokens, responsive rules
script.js           — all JS behaviour (independent modules)
fonts/              — self-hosted Inter 4.1 WOFF2 (regular, medium, semibold, bold)
og-image.html       — source for the social share image
og-image.png        — generated share image (regenerate with `npm run og-image`)
scripts/            — dev-only Node scripts (og-image generator)
package.json        — dev-only test tooling (not deployed)
package-lock.json   — lockfile for npm ci in CI
playwright.config.js — Playwright config (Chromium, webServer, baseURL)
playwright.production.config.js — smoke tests against the live production site
.htmlvalidate.json  — html-validate rules config
tests/              — Playwright E2E + axe WCAG 2.1 AA tests (site.spec.js, courses.spec.js)
prompt.md           — original brief that generated the site (reference only)
.github/workflows/  — GitHub Actions: lint, tests, health check, AI assistant
```

## Development

Open `index.html` directly in a browser. No server needed for the site itself.

## Tests

Run the full test suite (html-validate + Playwright E2E + axe a11y):

```bash
npm install          # first time only — installs devDependencies
npm test             # html-validate + the full Playwright suite
npm run test:html    # html-validate only (fast, no browser)
npm run test:e2e     # Playwright only (auto-starts serve on localhost:3000)
npm run test:smoke   # Playwright smoke tests against the live production site
```

Tests run automatically on every PR via `.github/workflows/test.yml`. On failure, a Playwright HTML report is uploaded as a CI artifact (7-day retention).

**html-validate rule suppressions** (documented in `.htmlvalidate.json`):
- `no-style-tag` — `<noscript><style>` fallback in `<head>` is intentional (no-JS card reveal fix)
- `doctype-style` — `<!doctype html>` lowercase is correct HTML5 and what Prettier enforces
- `void-style` — self-closing void elements (`<meta ... />`) is what Prettier enforces
- `no-redundant-role` — explicit ARIA roles on semantic elements (`role="banner"` etc.) are intentional for accessibility clarity
- `no-implicit-button-type` — hamburger `<button>` has no `type` attribute; it is not inside a `<form>` so the default is harmless
- `long-title` — the `<title>` contains `&amp;` which the validator counts as 5 raw characters; the decoded text is 69 chars (within the 70-char limit)

## Checks

Run locally with `npx` (no install needed):

```
npx eslint script.js
npx stylelint styles.css
npx prettier --check index.html styles.css script.js
```

These same checks run automatically on every PR via `.github/workflows/lint.yml`.

## Architecture

**Single-page layout:** Hero (`#intro`) → Services (`#services`) → About (`#about`) → Contact (`#contact`), with sticky nav and scroll-spy active states. `courses.html` is a subpage sharing the same header/footer/styles.

**Page sections:**
- `#intro` — full-viewport hero with name, tagline, sub-copy, and LinkedIn CTA button
- `#services` — three service cards (Software Engineering, Safety-Critical, Cyber Security) on a grid
- `#about` — two paragraphs of bio text about Marcus's background and working style
- `#contact` — contact description, LinkedIn button, location line

**CSS custom properties** (all defined in `:root` in `styles.css`) drive the entire design system:

| Token | Value | Purpose |
|---|---|---|
| `--color-bg` | `#1A1D23` | Page background |
| `--color-surface` | `#252930` | Services section, header, footer |
| `--color-accent-blue` | `#4A6FA5` | Logo badge, primary button |
| `--color-accent-teal` | `#3D8B85` | Nav active underline, card icons, eyebrow |
| `--color-text-primary` | `#D0D5DD` | Headings, body |
| `--color-text-secondary` | `#8B939E` | Subtext, descriptions |
| `--color-cta` | `#5A9BF5` | Links, button hover, focus ring |
| `--color-border` | `#333840` | Section dividers, card borders |
| `--navbar-height` | `4rem` (64px) | Sticky header height, scroll offset |
| `--container-max` | `1100px` | Max content width |

**Typography:** Self-hosted Inter via `@font-face` with `font-display: swap`. No Google Fonts, no CDN.

**JavaScript** (`script.js`) has four independent modules in order:
1. **Footer year** — writes `new Date().getFullYear()` to `#footer-year`
2. **Hamburger toggle** — opens/closes mobile nav; also closes on nav link click and `Escape` key
3. **Scroll-spy** — `IntersectionObserver` watches `section[id]` elements; adds `.is-active` to matching `.nav-link`
4. **Card reveal** — `IntersectionObserver` adds `.is-visible` to `.service-card` elements as they enter viewport, staggered 100 ms per card

## Key Conventions

- **Zero external dependencies** — no CDN, no npm packages, no frameworks; fonts are local WOFF2 files
- **Hamburger state** is driven by `aria-expanded` on `#hamburger-btn`; the CSS `[aria-expanded=\"true\"]` selector morphs bars into an X; JS reads this attribute to determine open/closed state
- **Mobile nav open state** uses `.is-open` class on `#site-nav` (opacity/transform/visibility animated transition); hamburger morphing uses `aria-expanded` attribute CSS selectors
- **Service card animations** use `IntersectionObserver` + `.is-visible` CSS class; `prefers-reduced-motion` makes cards immediately visible via `opacity: 1; transform: none` in the media query
- **`<noscript>`** fallback in `<head>` also forces `opacity: 1; transform: none` on `.service-card` for no-JS environments
- **Mobile nav** breakpoint: `max-width: 767px` (hamburger shown); desktop nav: `min-width: 768px`
- **Container padding** changes at `min-width: 640px` (from `--space-4` to `--space-8`)
- **Hero height** uses `calc(100svh - var(--navbar-height))` — `svh` (small viewport height) for iOS Safari compatibility
- **Anchor scroll offset** handled via `scroll-padding-top: var(--navbar-height)` on `html`, not JS
- **All SVG icons** are inline in `index.html` with `aria-hidden=\"true\"` and consistent `stroke-width: 1.75`
- **Scroll-spy rootMargin** accounts for navbar height by reading `--navbar-height` CSS custom property via `getComputedStyle`
- **Focus rings** use `:focus-visible` (keyboard-only), not `:focus`, with `--color-cta` outline
- **Minimum tap targets** are 44px (`min-height: 44px` on `.nav-link`, `.btn`, `.hamburger`)

## Accessibility

- Skip-to-content link (`.skip-link`) visually hidden until focused
- Semantic HTML: `<header role="banner">`, `<main id="main-content">`, `<footer role="contentinfo">`, `<nav aria-label="Primary navigation">`, `<section aria-labelledby="...">`, `<article aria-labelledby="...">`
- All external links have `rel="noopener noreferrer"` and `aria-label` describing they open in a new tab
- SVG icons have `aria-hidden="true"` throughout
- Hamburger button updates `aria-label` text dynamically between "Open navigation menu" / "Close navigation menu"

## Deployment & Releases

Hosted on **GitHub Pages** (legacy build type, serving the **root of the `deploy` branch**) with custom domain **https://fredstamconsulting.se/** (`CNAME`). There is **no build step** — pushing to `deploy` publishes the site as-is within a couple of minutes. Note that `main` is *not* the branch Pages serves; feature work lands on `main` and is then synced to `deploy`.

Every deployment is also a **GitHub release**, following the established pattern (`v1.0` … `v1.1.0`, see `git tag` / `gh release list`):

- The version is a **semver tag `vX.Y.Z` placed on the head commit of `deploy`** (the merge commit, e.g. v1.1.0 → the "Merge pull request #24 from mfredstam/main" commit) — never on a `main` commit.
- A **published GitHub release** (not draft, not prerelease) is created for that tag. Feature releases get a hand-written `## What's new` bullet list and a title like `v1.1.0 — Courses Section`; fix-only releases use generated notes (commit list + `Full Changelog` compare link) with a plain `vX.Y.Z` title.
- The version number exists **only as the tag/release** — there is no version field in `package.json` or anywhere in the site files to update.

**When — and only when — the user explicitly asks to deploy** (e.g. "deploy", "ship it", "push to production"), run this procedure from the repo root:

1. **Update `main` and test — deploy only a green main:**
   ```bash
   git fetch origin --tags
   git checkout main
   git pull --ff-only origin main
   npm test
   ```
2. **Compute the next version number** (use the sorted tag list, not `git describe` — release tags live on `deploy` and are not reachable from `main`):
   ```bash
   LAST=$(git tag -l 'v*' --sort=-v:refname | head -1)   # e.g. v1.1.0
   git log "$LAST"..origin/main --oneline                 # conventional-commit prefixes decide the bump
   ```
   Bump **minor** if any commit since `$LAST` is a `feat:` (as v1.0.5 → v1.1.0 for the courses section), **patch** for fix-only changes (as v1.0.4 → v1.0.5), **major** for breaking changes (`!` / `BREAKING CHANGE`). Set the result, e.g. `VERSION=v1.2.0`.
3. **Sync `main` into the Pages-served branch and push:**
   ```bash
   git checkout deploy
   git merge origin/main --no-edit   # resolve any conflicts in favor of main, then continue
   git push origin deploy
   ```
   GitHub Pages rebuilds automatically on the push — nothing else to run.
4. **Tag the `deploy` head and create the release** (`gh release create` creates and pushes the tag on the target automatically):
   ```bash
   # Feature release — hand-written notes and a descriptive title:
   gh release create "$VERSION" --target deploy \
     --title "$VERSION — <short feature name>" \
     --notes "## What's new

   - <one bullet per user-facing change since $LAST>"

   # Fix-only release — generated notes (commits + Full Changelog compare link):
   gh release create "$VERSION" --target deploy --generate-notes
   ```
5. **Verify, then return to `main`:**
   ```bash
   gh release view "$VERSION"                            # published; tag points at the deploy head
   gh api repos/mfredstam/fredstamconsulting/pages      # "status": "built", source branch "deploy"
   npm run test:smoke                                   # optional: smoke tests against the live site
   git checkout main
   ```

**Never deploy or release on your own initiative.** Do not push to `deploy`, tag, or create a release unless the user explicitly asked for a deployment in that message. If the user asks to deploy and tests fail, stop and report the failures instead of deploying.

## GitHub Actions

Four workflows in `.github/workflows/`:

- **`lint.yml`** — on every PR: ESLint, Stylelint, Prettier
- **`test.yml`** — on every PR: html-validate + Playwright E2E; uploads an HTML report artifact (7-day retention) on failure
- **`health-check.yml`** — twice daily (06:00 and 18:00 UTC) and on demand (`workflow_dispatch`): runs the production smoke tests against the live site
- **`claude.yml`** — triggers on `@claude` mentions in issues/PRs/comments and runs Claude Code via `anthropics/claude-code-action@v1`; requires the `CLAUDE_CODE_OAUTH_TOKEN` repository secret
