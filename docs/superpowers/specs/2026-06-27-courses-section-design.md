# Courses Section Design

**Date:** 2026-06-27
**Status:** Approved

## Context

Marcus Fredstam Consulting offers training in safety-critical software and cybersecurity — areas directly aligned with his three service pillars. Adding a courses section to the website lets potential customers discover and book training without needing an initial consulting conversation. The three selected courses are real offerings Marcus intends to deliver; the "Popular" badge is used as a conversion device since no actual booking history exists yet. An on-demand callout below the grid signals flexibility for custom training.

---

## Page Structure Change

**Before:** Hero → Services → About → Contact
**After:** Hero → Services → **Courses** → About → Contact

A "Courses" link is added to the sticky nav (desktop and mobile).

---

## Section Spec

**ID:** `#courses`
**Nav label:** `Courses`

### Header

| Element | Content |
|---|---|
| Eyebrow | `Training & Education` |
| Heading | `Popular Courses` |
| Subtitle | `Practical, hands-on training in safety-critical software and cybersecurity — delivered at your organisation.` |

### Background

Plain `--color-bg` (`#1A1D23`) — alternates visually from the `--color-surface` gradient used by `#services`.
Top and bottom `1px solid var(--color-border)` dividers (same convention as other sections).

---

## Course Cards

Three cards in the same 3-column grid as `.services-grid` (1 column on mobile, 3 on desktop). Each card is an `<article class="course-card">` inside an `<li>` in a `<ul role="list" class="courses-grid">`.

Each card contains:
1. **"Popular" badge** — small pill, top-right of card, teal background (`--color-accent-teal`), white text, `font-size: 0.75rem`, `font-weight: 600`
2. **Icon** — inline SVG, `aria-hidden="true"`, `stroke-width: 1.75`, teal colour (`--color-accent-teal`), 2.5rem square
3. **Title** — `<h3 class="card-title">`
4. **Description** — `<p class="card-desc">`
5. **"Book this course" button** — `<a class="btn btn--outline">` → `mailto:` link

### Card Content

**Card 1 — Threat Modeling for Embedded Systems**
- Icon: shield with a search/magnify motif (or shield-alert)
- Description: *Hands-on application of STRIDE and TARA to identify, assess, and prioritise cybersecurity threats in embedded and connected products — structured around IEC 62443 and ISO 21434. Leave with a repeatable threat modelling process you can apply to your own architecture from day one.*
- mailto: `hello@fredstamconsulting.se?subject=Course%20Enquiry%3A%20Threat%20Modeling%20for%20Embedded%20Systems`

**Card 2 — Safety-Critical Software Fundamentals**
- Icon: clipboard-check or shield-check motif
- Description: *A practical introduction to the engineering discipline behind safety-critical software — covering the core requirements of DO-178C and ISO 26262, from development assurance levels to traceability and verification. Build the mental model that turns compliance from an obstacle into an engineering practice.*
- mailto: `hello@fredstamconsulting.se?subject=Course%20Enquiry%3A%20Safety-Critical%20Software%20Fundamentals`

**Card 3 — Secure Coding for Embedded C/C++**
- Icon: code brackets with a lock motif
- Description: *Defensive coding techniques for embedded C and C++ — covering memory safety, common vulnerability classes, MISRA alignment, and secure-by-design patterns. Write code that holds up under adversarial conditions and satisfies the security evidence requirements of your next certification.*
- mailto: `hello@fredstamconsulting.se?subject=Course%20Enquiry%3A%20Secure%20Coding%20for%20Embedded%20C%2FC%2B%2B`

### Card Styling

Course cards reuse `.service-card` styles:
- `background-color: var(--color-surface)` — section bg is `--color-bg`, so cards use `--color-surface` to stand out (inverse of the services section, where section = `--color-surface` and cards = `--color-bg`)
- `border: 1px solid var(--color-border)`
- `border-radius: var(--radius-lg)`
- `padding: var(--space-8)`
- Hover: `border-color: var(--color-accent-teal)` + teal box-shadow
- Scroll-reveal: same `IntersectionObserver` + `.is-visible` pattern, staggered 100 ms per card

The "Popular" badge is positioned `absolute` top-right within the card (`position: relative` on the card). It uses `background-color: var(--color-accent-teal)`, `color: #fff`, `border-radius: var(--radius)`, `padding: 0.25rem 0.625rem`.

---

## On-Demand Callout

Below the `.courses-grid`, a centred block:

> *"Need something tailored to your team? I also deliver custom training on any topic — adapted to your domain, standards, and experience level."*

Followed by a **"Get in touch"** button (`btn btn--primary`) → `mailto:hello@fredstamconsulting.se?subject=Custom%20Course%20Enquiry`

Styling: `max-width: 600px`, centred, `margin-top: var(--space-12)`, description text in `--color-text-secondary`.

---

## Navigation

Add `<a href="#courses" class="nav-link">Courses</a>` to both:
- Desktop nav (`<ul class="nav-links">`)
- Mobile nav (same list, shown at `max-width: 767px`)

The scroll-spy `IntersectionObserver` already watches `section[id]` elements — no JS change needed.

---

## Accessibility

- Section uses `<section id="courses" aria-labelledby="courses-title">`
- Heading has `id="courses-title"`
- Each `<article>` has `aria-labelledby` pointing to its `<h3 id>`
- Book buttons have descriptive `aria-label`: `"Book course: Threat Modeling for Embedded Systems (opens email)"`
- All SVG icons `aria-hidden="true"`
- "Popular" badge included in the accessible name of the article (via `aria-label` or visible text within the `aria-labelledby` chain)

---

## Verification

1. Open `index.html` directly in a browser — confirm:
   - Courses section appears between Services and About
   - Nav "Courses" link scrolls to section and activates scroll-spy
   - Cards reveal on scroll with stagger
   - "Popular" badge visible on each card
   - "Book this course" buttons open default mail client with correct `to` and `subject` pre-filled
   - "Get in touch" opens mail client with `Custom Course Enquiry` subject
   - Mobile: hamburger nav includes "Courses" link; cards stack to 1 column
2. Run `npm test` — all 11 existing Playwright tests pass; new nav link and section are reachable
3. Run `npx prettier --check index.html styles.css` and `npx stylelint styles.css`
