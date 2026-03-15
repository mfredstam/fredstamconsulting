# fredstam-consulting

Source for [fredstamconsulting.se](https://fredstamconsulting.se) — static single-page site for Marcus Fredstam, freelance embedded software consultant.

## Files

```
index.html              — markup, inline SVG icons, page structure
styles.css              — all styles and design tokens
script.js               — JS behaviour (footer year, hamburger, scroll-spy, card reveal)
fonts/                  — self-hosted Inter WOFF2 (regular, medium, semibold, bold)
tests/site.spec.js      — Playwright E2E + axe WCAG 2.1 AA tests
.github/workflows/      — GitHub Actions: lint and test on every PR
```

## Development

No build step — open `index.html` directly in a browser.

```bash
npm install          # install dev dependencies (first time only)
npm test             # html-validate + all Playwright tests
npm run test:html    # html-validate only (fast, no browser)
npm run test:e2e     # Playwright only
```

Linting:

```bash
npx eslint script.js
npx stylelint styles.css
npx prettier --check index.html styles.css script.js
```

## Deployment

Hosted on GitHub Pages from the `main` branch. Push to `main` to deploy — no build step needed.

## CI

- `lint.yml` — runs ESLint, Stylelint, and Prettier on every PR
- `test.yml` — runs html-validate and Playwright tests on every PR; uploads HTML report as artifact on failure
