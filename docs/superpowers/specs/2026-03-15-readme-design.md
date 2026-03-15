---
name: README design
description: Spec for adding a README.md to the fredstamconsulting repo
type: project
---

# README Design Spec

## Context

Static single-page consulting website for Marcus Fredstam, hosted on GitHub Pages.
No existing README. CLAUDE.md serves as the developer reference for AI agents.

## Goals

- Serve two audiences: Marcus working on the site, and GitHub visitors
- Minimal/pragmatic tone — no marketing language, just facts
- Standalone and self-contained (not dependent on CLAUDE.md)

## Out of Scope

- CI status badges
- Contribution guidelines
- License section
- Callout blocks or extended explanatory prose

## Structure

### 1. Header

```
# fredstam-consulting
```

One-line description: "Source for [fredstamconsulting.se](https://fredstamconsulting.se) — static single-page site for Marcus Fredstam, freelance embedded software consultant."

### 2. File Structure

Indented list of key files with one-line descriptions:

```
index.html              — markup, inline SVG icons, page structure
styles.css              — all styles and design tokens
script.js               — JS behaviour (footer year, hamburger, scroll-spy, card reveal)
fonts/                  — self-hosted Inter WOFF2 (regular, medium, semibold, bold)
tests/site.spec.js      — Playwright E2E + axe WCAG 2.1 AA tests
.github/workflows/      — GitHub Actions: lint and test on every PR
```

### 3. Development

```
# No build step — open index.html directly in a browser

npm install          # install dev dependencies (first time only)
npm test             # html-validate + all Playwright tests
npm run test:html    # html-validate only (fast, no browser)
npm run test:e2e     # Playwright only
```

Linting:

```
npx eslint script.js
npx stylelint styles.css
npx prettier --check index.html styles.css script.js
```

### 4. Deployment

Two sentences: hosted on GitHub Pages from `main` branch, push to deploy (no build step).

### 5. CI

Two bullets:
- `lint.yml` — runs ESLint, Stylelint, Prettier on every PR
- `test.yml` — runs html-validate and Playwright tests on every PR; uploads HTML report as artifact on failure

## Implementation Notes

- File: `README.md` at project root
- ~60–80 lines
- No external dependencies or badge URLs
