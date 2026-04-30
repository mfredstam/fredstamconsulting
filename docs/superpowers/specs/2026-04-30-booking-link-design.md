# Design: Add Google Calendar Booking Link

**Date:** 2026-04-30
**Status:** Approved

## Context

The website currently offers only one conversion path — a LinkedIn button. Adding a direct Google Calendar booking link gives visitors an alternative that removes friction for people who are ready to schedule a meeting immediately rather than initiate a LinkedIn conversation first.

## Goal

Add a "Book a Meeting" button in the `#contact` section that opens Marcus's Google Calendar appointment page (`https://calendar.app.google/rnSpPJT3fTj9bpxi9`) in a new tab, alongside the existing LinkedIn button.

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Placement | `#contact` section only | Semantically correct location; visitors who want to get in touch arrive here |
| Button style | `.btn--primary` (same as LinkedIn) | Treats both CTAs as equal-weight options |
| Button label | "Book a Meeting" | Direct, action-oriented |
| Description text | Add one sentence | Makes the booking option discoverable before the user reaches the button |

## Changes

### `index.html`

**1. Update second `<p class="contact-desc">` in `#contact`**

Add the sentence _"You can also book a meeting directly via Google Calendar."_ at the end of the paragraph that currently ends with "answered within one business day."

Before:
```html
<p class="contact-desc">
  Reach out via LinkedIn to start a conversation. Initial enquiries are typically answered
  within one business day.
</p>
```

After:
```html
<p class="contact-desc">
  Reach out via LinkedIn to start a conversation. Initial enquiries are typically answered
  within one business day. You can also book a meeting directly via Google Calendar.
</p>
```

**2. Add "Book a Meeting" button inside `.contact-actions`**

Following the exact same pattern as the LinkedIn button (same classes, `target="_blank"`, `rel="noopener noreferrer"`, descriptive `aria-label`):

```html
<a
  class="btn btn--primary"
  href="https://calendar.app.google/rnSpPJT3fTj9bpxi9"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Book a meeting with Marcus Fredstam via Google Calendar (opens in new tab)"
>
  Book a Meeting
</a>
```

### `styles.css`

**Add `gap` to `.contact-actions`**

The `.contact-actions` div is already a flex container. With two buttons it needs explicit spacing:

```css
.contact-actions {
  gap: 0.75rem;   /* add this */
}
```

No new CSS classes, no JS changes, no new files.

## Accessibility

- `aria-label` follows the existing convention: describes the action and notes "(opens in new tab)"
- `rel="noopener noreferrer"` matches all other external links on the page
- Button is `<a>` with `href` — keyboard accessible, meets 44px minimum tap target from existing `.btn` styles

## Verification

1. Open `index.html` in a browser, scroll to `#contact`
2. Confirm two buttons appear side by side with consistent spacing
3. Confirm "Book a Meeting" opens `https://calendar.app.google/rnSpPJT3fTj9bpxi9` in a new tab
4. Confirm the new sentence appears in the description paragraph
5. Run `npm test` — all existing Playwright and axe tests must pass
6. Run `npx prettier --check index.html styles.css` — no formatting issues
