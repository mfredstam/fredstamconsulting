# Section Visual Enhancements Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add gradient card borders and subtle section background fades to the Services, About, and Contact sections to match the visual depth of the hero.

**Architecture:** CSS-only changes to `styles.css`. Service cards use a `::before` pseudo-element for the gradient border effect (replaces the existing solid border). Sections use `linear-gradient` backgrounds replacing flat `background-color` declarations.

**Tech Stack:** Vanilla CSS (`color-mix()`, `linear-gradient`, `::before` pseudo-element). No JS, no build step.

**Spec:** `docs/superpowers/specs/2026-03-14-section-visual-enhancements-design.md`

---

## Chunk 1: All changes

### Task 1: Gradient borders on service cards

**Context:** The `.service-card` block is in `styles.css` around line 582. The current approach uses `border: 1px solid var(--color-border)`. We're replacing that with a `::before` pseudo-element that provides a gradient border at rest and transitions to solid teal on hover — matching the existing hover visual exactly.

The technique:
- Remove `border` from the card; the visual boundary comes from the pseudo-element
- `::before` sits at `z-index: -1` (behind the card), extends 1px beyond the card on all sides via `inset: -1px`, and has a gradient background
- `isolation: isolate` on the card creates a stacking context so the pseudo stays behind card content
- On hover, the pseudo's background transitions to solid teal — same visual result as the old `border-color: var(--color-accent-teal)`

**Files:**
- Modify: `styles.css` — `.service-card` block and `.service-card:hover` block

- [ ] **Step 1: Open `index.html` in browser and note the current card appearance**

  Open `index.html` directly (no server needed — `file://` protocol works). Scroll to Services. Note: cards have a flat grey border, no gradient. This is your before-state.

- [ ] **Step 2: Apply gradient border to `.service-card`**

  In `styles.css`, find the `.service-card` block (currently starts around line 582). Make the following changes:

  **Remove** `border: 1px solid var(--color-border);` from `.service-card`.

  **Add** `position: relative;` and `isolation: isolate;` to `.service-card`.

  **Remove** `border-color 0.25s ease,` from the `transition` property in `.service-card`.

  The `.service-card` block should now read:

  ```css
  .service-card {
    background-color: var(--color-bg);
    border-radius: var(--radius-lg);
    padding: var(--space-8);
    position: relative;
    isolation: isolate;
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease,
      box-shadow 0.25s ease;
  }
  ```

- [ ] **Step 3: Add the `::before` pseudo-element rule**

  Insert the following **immediately after** the `.service-card` block (before `.service-card.is-visible`):

  ```css
  .service-card::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-accent-teal) 35%, var(--color-border)),
      var(--color-border) 50%
    );
    z-index: -1;
    pointer-events: none;
    transition: background 0.25s ease;
  }
  ```

- [ ] **Step 4: Update the hover state**

  Find `.service-card:hover`. Remove `border-color: var(--color-accent-teal);` (the card no longer has a border to colour). Keep `box-shadow`. The block should read:

  ```css
  .service-card:hover {
    box-shadow: 0 4px 24px color-mix(in srgb, var(--color-accent-teal) 12%, transparent);
  }
  ```

  Then add a new rule immediately after:

  ```css
  .service-card:hover::before {
    background: var(--color-accent-teal);
  }
  ```

- [ ] **Step 5: Visual check — card borders**

  Hard-refresh `index.html` in the browser (Ctrl+Shift+R). Scroll to Services.

  Expected:
  - Each card has a subtle gradient border — teal-tinted top-left corner blending to grey
  - On hover: border transitions to solid teal, box-shadow appears (same as before)
  - Cards still fade in on scroll (reveal animation unchanged)

  If the gradient border isn't visible, check that `z-index: -1` is on `::before` and `isolation: isolate` is on `.service-card`. Open DevTools → Elements → select a card → check Computed styles.

- [ ] **Step 6: Run linters**

  ```bash
  npx stylelint styles.css
  npx prettier --check styles.css
  ```

  Expected: no errors. If Prettier reports a diff, run `npx prettier --write styles.css` and review the diff before committing.

- [ ] **Step 7: Commit**

  ```bash
  git add styles.css
  git commit -m "feat: add gradient border to service cards via ::before pseudo-element"
  ```

---

### Task 2: Section background fades

**Context:** Three sections need background gradient fades. Two have existing background declarations to replace; one (Contact) needs a new rule added.

- `.section--services` (~line 554): has `background-color: var(--color-surface)` — replace with teal-tinted gradient
- `.section--about` (~line 668): has `background: var(--color-surface)` — replace with blue-tinted gradient
- `.section--contact`: **no existing background rule** — add a new block with teal-tinted gradient

**Files:**
- Modify: `styles.css` — `.section--services`, `.section--about`, and new `.section--contact` rule

- [ ] **Step 1: Update `.section--services` background**

  Find `.section--services`. Replace:

  ```css
  background-color: var(--color-surface);
  ```

  With:

  ```css
  background: linear-gradient(
    180deg,
    var(--color-surface) 0%,
    color-mix(in srgb, var(--color-surface) 94%, var(--color-accent-teal)) 100%
  );
  ```

  (Keep the existing `border-top` and `border-bottom` lines untouched.)

- [ ] **Step 2: Update `.section--about` background**

  Find `.section--about`. Replace:

  ```css
  background: var(--color-surface);
  ```

  With:

  ```css
  background: linear-gradient(
    180deg,
    var(--color-surface) 0%,
    color-mix(in srgb, var(--color-surface) 94%, var(--color-accent-blue)) 100%
  );
  ```

  (Keep the existing `border-top` line untouched.)

- [ ] **Step 3: Add `.section--contact` rule**

  There is currently no `.section--contact` block in `styles.css`. Add one. The natural place is immediately after the `/* ====== CONTACT SECTION ====== */` comment and before `.contact-inner`, consistent with how `.section--services` and `.section--about` are placed relative to their section comments.

  ```css
  .section--contact {
    background: linear-gradient(
      180deg,
      var(--color-bg) 0%,
      color-mix(in srgb, var(--color-bg) 94%, var(--color-accent-teal)) 100%
    );
  }
  ```

- [ ] **Step 4: Visual check — section fades**

  Hard-refresh `index.html`. Scroll through all three sections.

  Expected:
  - Services section: background fades very subtly toward a warm teal tint at the bottom
  - About section: background fades toward a warm blue tint at the bottom
  - Contact section: background fades toward a warm teal tint at the bottom
  - The effect is subtle — you're looking for warmth and visual separation, not a strong colour change
  - Section borders (top/bottom lines on Services, top line on About) are unchanged

  The tints are intentionally faint (6% mix). If you can barely see them — that's correct.

- [ ] **Step 5: Run linters**

  ```bash
  npx stylelint styles.css
  npx prettier --check styles.css
  ```

  Expected: no errors. Run `npx prettier --write styles.css` if formatting issues are reported, then review the diff.

- [ ] **Step 6: Commit**

  ```bash
  git add styles.css
  git commit -m "feat: add subtle tinted background fades to Services, About, and Contact sections"
  ```
