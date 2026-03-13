# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for Marcus Fredstam, freelance embedded software consultant. No build step — files are served directly via GitHub Pages.

**Purpose:** Digital business card / marketing site for Fredstam Consulting.

**File structure:**
```
index.html          — all markup, inline SVG icons, semantic structure
styles.css          — all styles, design tokens, responsive rules
script.js           — all JS behaviour (4 independent modules)
fonts/              — self-hosted Inter 4.1 WOFF2 (regular, medium, semibold, bold)
prompt.md           — original brief that generated the site (reference only)
.github/workflows/  — GitHub Actions: Claude Code assistant + automated PR review
```

## Development

Open `index.html` directly in a browser. No server, build tools, or package manager needed.

There are no tests. Validate visually in browser, and check browser devtools console for JS errors.

## Checks

Run locally with `npx` (no install needed):

```
npx eslint script.js
npx stylelint styles.css
npx prettier --check index.html styles.css script.js
```

These same checks run automatically on every PR via `.github/workflows/lint.yml`.

## Architecture

**Single-page layout:** Hero (`#intro`) → Services (`#services`) → Contact (`#contact`), with sticky nav and scroll-spy active states.

**Page sections:**
- `#intro` — full-viewport hero with name, tagline, sub-copy, and LinkedIn CTA button
- `#services` — three service cards (Software Engineering, Safety-Critical, Cyber Security) on a grid
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
- **Hamburger state** is driven by `aria-expanded` on `#hamburger-btn`; the CSS `[aria-expanded="true"]` selector morphs bars into an X; JS reads this attribute to determine open/closed state
- **Mobile nav open state** uses `.is-open` class on `#site-nav` (opacity/transform/visibility animated transition); hamburger morphing uses `aria-expanded` attribute CSS selectors
- **Service card animations** use `IntersectionObserver` + `.is-visible` CSS class; `prefers-reduced-motion` makes cards immediately visible via `opacity: 1; transform: none` in the media query
- **`<noscript>`** fallback in `<head>` also forces `opacity: 1; transform: none` on `.service-card` for no-JS environments
- **Mobile nav** breakpoint: `max-width: 767px` (hamburger shown); desktop nav: `min-width: 768px`
- **Container padding** changes at `min-width: 640px` (from `--space-4` to `--space-8`)
- **Hero height** uses `calc(100svh - var(--navbar-height))` — `svh` (small viewport height) for iOS Safari compatibility
- **Anchor scroll offset** handled via `scroll-padding-top: var(--navbar-height)` on `html`, not JS
- **All SVG icons** are inline in `index.html` with `aria-hidden="true"` and consistent `stroke-width: 1.75`
- **Scroll-spy rootMargin** accounts for navbar height by reading `--navbar-height` CSS custom property via `getComputedStyle`
- **Focus rings** use `:focus-visible` (keyboard-only), not `:focus`, with `--color-cta` outline
- **Minimum tap targets** are 44px (`min-height: 44px` on `.nav-link`, `.btn`, `.hamburger`)

## Accessibility

- Skip-to-content link (`.skip-link`) visually hidden until focused
- Semantic HTML: `<header role="banner">`, `<main id="main-content">`, `<footer role="contentinfo">`, `<nav aria-label="Primary navigation">`, `<section aria-labelledby="...">`, `<article aria-labelledby="...">`
- All external links have `rel="noopener noreferrer"` and `aria-label` describing they open in a new tab
- SVG icons have `aria-hidden="true"` throughout
- Hamburger button updates `aria-label` text dynamically between "Open navigation menu" / "Close navigation menu"

## Deployment

Hosted on GitHub Pages from the `main` branch. Push to `main` to deploy — no build step needed.

## GitHub Actions

Two workflows in `.github/workflows/`:

- **`claude.yml`** — Triggers on `@claude` mentions in issues/PRs/comments. Uses `anthropics/claude-code-action@v1` with `CLAUDE_CODE_OAUTH_TOKEN` secret.
- **`claude-code-review.yml`** — Auto-reviews every PR (opened, synchronize, ready_for_review, reopened) using the `code-review` Claude Code plugin.

Both workflows require the `CLAUDE_CODE_OAUTH_TOKEN` repository secret to be configured.
