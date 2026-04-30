# Booking Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Book a Meeting" Google Calendar button and one supporting sentence to the `#contact` section of `index.html`.

**Architecture:** Two edits to `index.html` only — one sentence appended to an existing paragraph, one `<a>` button added inside `.contact-actions`. No CSS changes needed (`.contact-actions` already has `display: flex; flex-wrap: wrap; gap: var(--space-4)`). Tests are written first (TDD), then the HTML changes make them pass.

**Tech Stack:** Static HTML, Playwright for E2E tests, html-validate, Prettier

---

## Files

| File | Change |
|---|---|
| `tests/site.spec.js` | Add `Booking link` describe block with 4 new tests |
| `index.html` | Append sentence to second `.contact-desc`; add button to `.contact-actions` |

---

### Task 1: Write failing tests for the booking link

**Files:**
- Modify: `tests/site.spec.js`

- [ ] **Step 1: Add the test block to `tests/site.spec.js`**

Append this block after the closing `});` of the `Accessibility` describe block (end of file):

```js
test.describe('Booking link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Book a Meeting button is present in contact section with correct href', async ({ page }) => {
    const btn = page.locator(
      '#contact a.btn[href="https://calendar.app.google/rnSpPJT3fTj9bpxi9"]',
    );
    await expect(btn).toHaveCount(1);
    await expect(btn).toHaveText('Book a Meeting');
  });

  test('Book a Meeting button opens in new tab with noopener noreferrer', async ({ page }) => {
    const btn = page.locator(
      '#contact a.btn[href="https://calendar.app.google/rnSpPJT3fTj9bpxi9"]',
    );
    await expect(btn).toHaveAttribute('target', '_blank');
    await expect(btn).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('Book a Meeting button has descriptive aria-label mentioning new tab', async ({ page }) => {
    const btn = page.locator(
      '#contact a.btn[href="https://calendar.app.google/rnSpPJT3fTj9bpxi9"]',
    );
    const label = await btn.getAttribute('aria-label');
    expect(label).toContain('opens in new tab');
  });

  test('contact description mentions booking via Google Calendar', async ({ page }) => {
    const desc = page.locator('#contact .contact-desc').nth(1);
    await expect(desc).toContainText('book a meeting directly via Google Calendar');
  });
});
```

- [ ] **Step 2: Run the new tests to confirm they fail**

```bash
npm run test:e2e -- --grep "Booking link"
```

Expected: 4 tests FAIL — element not found / text not found.

---

### Task 2: Implement the HTML changes

**Files:**
- Modify: `index.html:436-439` (sentence), `index.html:444-454` (button)

- [ ] **Step 1: Append the booking sentence to the second `.contact-desc` paragraph**

Find this paragraph (around line 436):
```html
          <p class="contact-desc">
            Reach out via LinkedIn to start a conversation. Initial enquiries are typically answered
            within one business day.
          </p>
```

Replace with:
```html
          <p class="contact-desc">
            Reach out via LinkedIn to start a conversation. Initial enquiries are typically answered
            within one business day. You can also book a meeting directly via Google Calendar.
          </p>
```

- [ ] **Step 2: Add the "Book a Meeting" button inside `.contact-actions`**

Find `.contact-actions` (around line 444). It currently contains one `<a>`:
```html
          <div class="contact-actions">
            <a
              class="btn btn--primary"
              href="https://www.linkedin.com/in/marcus-fredstam/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Marcus Fredstam's LinkedIn profile (opens in new tab)"
            >
              Connect on LinkedIn
            </a>
          </div>
```

Replace with:
```html
          <div class="contact-actions">
            <a
              class="btn btn--primary"
              href="https://www.linkedin.com/in/marcus-fredstam/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Marcus Fredstam's LinkedIn profile (opens in new tab)"
            >
              Connect on LinkedIn
            </a>
            <a
              class="btn btn--primary"
              href="https://calendar.app.google/rnSpPJT3fTj9bpxi9"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a meeting with Marcus Fredstam via Google Calendar (opens in new tab)"
            >
              Book a Meeting
            </a>
          </div>
```

- [ ] **Step 3: Run the booking-link tests — they should now pass**

```bash
npm run test:e2e -- --grep "Booking link"
```

Expected: 4 tests PASS.

---

### Task 3: Full verification and commit

**Files:** no changes — verification only

- [ ] **Step 1: Run the full test suite**

```bash
npm test
```

Expected: all tests pass (html-validate + all Playwright tests including the 4 new ones).

- [ ] **Step 2: Check formatting**

```bash
npx prettier --check index.html
```

Expected: no issues. If Prettier reports formatting problems, run `npx prettier --write index.html` and re-run the check.

- [ ] **Step 3: Commit**

```bash
git add tests/site.spec.js index.html
git commit -m "feat: add Book a Meeting button linking to Google Calendar"
```
