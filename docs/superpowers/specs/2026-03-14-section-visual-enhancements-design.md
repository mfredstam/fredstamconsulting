# Section Visual Enhancements — Design Spec

**Date:** 2026-03-14
**Status:** Approved

## Problem

The hero section has a subtle radial gradient accent (`::before` pseudo-element) that gives it depth and visual interest. The Services, About, and Contact sections use flat solid background colours and feel comparatively plain.

## Goal

Make non-hero sections feel more polished and alive while preserving the clean, professional dark aesthetic. No new animations, no layout changes, no structural modifications.

## Design Direction

**Option C — Gradient card borders + section background fades.**

No ambient glows (Option A discarded). No accent lines (Option B discarded).

---

## Changes

### 1. Service card gradient borders

**Technique:** CSS `::before` pseudo-element on `.service-card`.

The pseudo sits behind the card at `z-index: -1`, slightly larger (1px bleed on all sides via negative inset), with a `linear-gradient` background blending from a diluted teal into the regular border colour. This gives the appearance of a gradient border without using `border-image` (which is incompatible with `border-radius`) and without adding DOM elements.

```
gradient: linear-gradient(135deg,
  color-mix(in srgb, var(--color-accent-teal) 35%, var(--color-border)),
  var(--color-border) 50%,
  var(--color-border)
)
```

Gradient angle 135° places the teal accent at the top-left corner of each card — the natural entry point as the eye scans left-to-right.

The existing hover state (solid teal `border-color` + teal `box-shadow`) is **not changed**. The gradient border is a resting-state treatment only; hover remains more vivid.

Because `.service-card` uses `opacity: 0` / `transform: translateY(24px)` for its reveal animation, the `::before` pseudo inherits those states automatically — no extra animation work needed.

**CSS changes:** `.service-card` in `styles.css` — add `position: relative` (if not already set), `isolation: isolate`, and the `::before` rule.

### 2. Section background fades

Replace flat `background-color` with `linear-gradient(180deg, ...)` on three sections. All tints use `color-mix(in srgb, ...)` — the same technique already used for the navbar backdrop and button shadow elsewhere in the codebase.

| Section | Selector | From (top) | To (bottom) | Tint colour |
|---|---|---|---|---|
| Services | `.section--services` | `var(--color-surface)` | `color-mix(in srgb, var(--color-surface) 94%, var(--color-accent-teal))` | teal |
| About | `.section--about` | `var(--color-surface)` | `color-mix(in srgb, var(--color-surface) 94%, var(--color-accent-blue))` | blue |
| Contact | `.section--contact` | `var(--color-bg)` | `color-mix(in srgb, var(--color-bg) 94%, var(--color-accent-teal))` | teal |

The 6% tint ratio is deliberately subtle — just enough to add warmth and visual separation between sections without drawing attention to itself.

---

## What Does Not Change

- Hero section (gradient, layout, copy) — untouched
- Card hover states (teal border + glow) — untouched
- Card reveal animations (`.is-visible`, `IntersectionObserver`) — untouched
- All spacing, typography, and layout — untouched
- `prefers-reduced-motion` overrides — untouched (card `::before` carries no animation)
- `<noscript>` fallback styles — untouched

---

## Constraints

- Zero new dependencies
- CSS-only changes to `styles.css`; no changes to `index.html` or `script.js`
- Must pass `npx stylelint styles.css` and `npx prettier --check styles.css`
- Must degrade gracefully: `color-mix()` is supported in all modern browsers; older browsers will fall back to the flat background colour already present

---

## Files Affected

- `styles.css` — two targeted additions:
  1. `.service-card` block: add `position: relative`, `isolation: isolate`, and `::before` rule
  2. `.section--services`, `.section--about`, `.section--contact` blocks: replace `background-color` with `background`/gradient
