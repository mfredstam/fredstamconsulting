# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for Marcus Fredstam, freelance embedded software consultant. No build step — files are served directly via GitHub Pages.

**Files:** `index.html`, `styles.css`, `script.js`, `fonts/` (Inter 4.1 WOFF2)

## Development

Open `index.html` directly in a browser. No server, build tools, or package manager needed.

## Architecture

**Single-page layout:** Hero → Services → Contact, with sticky nav and scroll-spy active states.

**CSS custom properties** (defined in `:root` in `styles.css`) drive the entire design system — colors, spacing, typography, and layout tokens. All colors, spacing, and sizing reference these variables.

**JavaScript** (`script.js`) has four independent modules: footer year, hamburger toggle, scroll-spy, and card reveal — all using `IntersectionObserver`. No external libraries.

## Key Conventions

- **Zero external dependencies** — no CDN, no npm packages, no frameworks
- **Hamburger state** is controlled via `aria-expanded` attribute on the button; CSS selectors respond to this attribute (not a class)
- **Service card animations** use `IntersectionObserver` + `.is-visible` CSS class; `prefers-reduced-motion` makes cards immediately visible
- **Mobile nav** breakpoint is 768px; container padding changes at 640px
- **Hero height** uses `100svh` (not `100vh`) for iOS Safari compatibility
- **Anchor scroll offset** handled via `scroll-padding-top` on `html`, not JS
- All SVG icons are inline in `index.html`
