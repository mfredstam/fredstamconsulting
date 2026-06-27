# Courses Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `#courses` section between Services and About, showcasing 3 popular courses with booking-by-email, plus an on-demand callout.

**Architecture:** Pure HTML/CSS/JS additions to the existing static site. The new section mirrors the services section pattern (3-column card grid, scroll-reveal, section header). A new `IntersectionObserver` mirrors the service card observer. No new files are created — changes are made to `index.html`, `styles.css`, `script.js`, and `tests/site.spec.js`.

**Tech Stack:** Vanilla HTML5, CSS custom properties, vanilla JS (`IntersectionObserver`), Playwright E2E tests.

## Global Constraints

- Zero external dependencies — no CDN, no npm packages
- All SVG icons: `aria-hidden="true"`, `stroke-width: 1.75`, 24×24 `viewBox`, `stroke="currentColor"`
- Button class for book buttons: `btn btn--secondary` (not `btn--outline` — that class does not exist)
- Button class for callout CTA: `btn btn--primary`
- Book button `href`s use `mailto:hello@fredstamconsulting.se?subject=...` with percent-encoded subjects
- All `mailto:` links do NOT use `target="_blank"` and do NOT need `rel="noopener noreferrer"`
- Prettier enforces formatting — run `npx prettier --write` before committing
- Tests must pass: `npm test` (html-validate + Playwright + axe WCAG 2.1 AA)

---

## Files Modified

| File | Change |
|---|---|
| `tests/site.spec.js` | Add `Courses section` describe block (5 new tests) |
| `index.html` | Add nav link, `#courses` section HTML, update `<noscript>` fallback |
| `styles.css` | Add `.section--courses`, `.courses-grid`, `.course-card`, `.course-badge`, `.courses-callout`, update reduced-motion block |
| `script.js` | Add course card `IntersectionObserver` (new section 5, renumber scroll-hint to 6) |

---

### Task 1: Write failing tests for the courses section

**Files:**
- Modify: `tests/site.spec.js`

- [ ] **Step 1: Add the Courses section describe block to `tests/site.spec.js`**

Append after the closing `});` of the `Booking link` describe block (after line 128):

```js
test.describe('Courses section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('#courses nav link is present', async ({ page }) => {
    await expect(page.locator('a.nav-link[href="#courses"]')).toHaveCount(1);
  });

  test('courses section has heading "Popular Courses"', async ({ page }) => {
    await expect(page.locator('#courses h2')).toHaveText('Popular Courses');
  });

  test('three course cards are present, each with a Popular badge', async ({ page }) => {
    await expect(page.locator('#courses .course-card')).toHaveCount(3);
    await expect(page.locator('#courses .course-badge')).toHaveCount(3);
  });

  test('Book this course buttons have correct mailto hrefs', async ({ page }) => {
    const hrefs = [
      'mailto:hello@fredstamconsulting.se?subject=Course%20Enquiry%3A%20Threat%20Modeling%20for%20Embedded%20Systems',
      'mailto:hello@fredstamconsulting.se?subject=Course%20Enquiry%3A%20Safety-Critical%20Software%20Fundamentals',
      'mailto:hello@fredstamconsulting.se?subject=Course%20Enquiry%3A%20Secure%20Coding%20for%20Embedded%20C%2FC%2B%2B',
    ];
    const buttons = await page.locator('#courses .course-btn').all();
    expect(buttons).toHaveLength(3);
    for (let i = 0; i < buttons.length; i++) {
      await expect(buttons[i]).toHaveAttribute('href', hrefs[i]);
    }
  });

  test('Get in touch button links to custom course enquiry email', async ({ page }) => {
    const btn = page.locator(
      '#courses a.btn[href="mailto:hello@fredstamconsulting.se?subject=Custom%20Course%20Enquiry"]',
    );
    await expect(btn).toHaveCount(1);
    await expect(btn).toHaveText('Get in touch');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```

Expected: the 5 new Courses section tests FAIL. All 11 existing tests still PASS.

---

### Task 2: Add `#courses` HTML to `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the Courses nav link**

In `index.html`, find the nav list (around line 237–242):
```html
          <ul role="list" class="nav-list">
            <li><a class="nav-link" href="#intro">Home</a></li>
            <li><a class="nav-link" href="#services">Services</a></li>
            <li><a class="nav-link" href="#about">About</a></li>
            <li><a class="nav-link" href="#contact">Contact</a></li>
          </ul>
```

Replace with:
```html
          <ul role="list" class="nav-list">
            <li><a class="nav-link" href="#intro">Home</a></li>
            <li><a class="nav-link" href="#services">Services</a></li>
            <li><a class="nav-link" href="#courses">Courses</a></li>
            <li><a class="nav-link" href="#about">About</a></li>
            <li><a class="nav-link" href="#contact">Contact</a></li>
          </ul>
```

- [ ] **Step 2: Add the `#courses` section**

In `index.html`, find the comment `<!-- ABOUT -->` (around line 446) and insert the entire courses section immediately before it:

```html
      <!-- COURSES -->
      <section id="courses" class="section section--courses" aria-labelledby="courses-title">
        <div class="container">
          <p class="section-eyebrow">Training &amp; Education</p>
          <h2 id="courses-title" class="section-title">Popular Courses</h2>
          <p class="section-subtitle">
            Practical, hands-on training in safety-critical software and cybersecurity — delivered
            at your organisation.
          </p>

          <ul role="list" class="courses-grid">
            <!-- Card 1: Threat Modeling -->
            <li>
              <article class="course-card" aria-labelledby="card-tm-title">
                <span class="course-badge">Popular</span>
                <div class="card-icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                    <line x1="12.5" y1="12.5" x2="15" y2="15"></line>
                  </svg>
                </div>
                <h3 id="card-tm-title" class="card-title">
                  Threat Modeling for Embedded Systems
                </h3>
                <p class="card-desc">
                  Hands-on application of STRIDE and TARA to identify, assess, and prioritise
                  cybersecurity threats in embedded and connected products — structured around
                  IEC&nbsp;62443 and ISO&nbsp;21434. Leave with a repeatable threat modelling
                  process you can apply to your own architecture from day one.
                </p>
                <a
                  class="btn btn--secondary course-btn"
                  href="mailto:hello@fredstamconsulting.se?subject=Course%20Enquiry%3A%20Threat%20Modeling%20for%20Embedded%20Systems"
                  aria-label="Book course: Threat Modeling for Embedded Systems (opens email)"
                >
                  Book this course
                </a>
              </article>
            </li>

            <!-- Card 2: Safety-Critical Fundamentals -->
            <li>
              <article class="course-card" aria-labelledby="card-sf-title">
                <span class="course-badge">Popular</span>
                <div class="card-icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                </div>
                <h3 id="card-sf-title" class="card-title">
                  Safety-Critical Software Fundamentals
                </h3>
                <p class="card-desc">
                  A practical introduction to the engineering discipline behind safety-critical
                  software — covering the core requirements of DO-178C and ISO&nbsp;26262, from
                  development assurance levels to traceability and verification. Build the mental
                  model that turns compliance from an obstacle into an engineering practice.
                </p>
                <a
                  class="btn btn--secondary course-btn"
                  href="mailto:hello@fredstamconsulting.se?subject=Course%20Enquiry%3A%20Safety-Critical%20Software%20Fundamentals"
                  aria-label="Book course: Safety-Critical Software Fundamentals (opens email)"
                >
                  Book this course
                </a>
              </article>
            </li>

            <!-- Card 3: Secure Coding -->
            <li>
              <article class="course-card" aria-labelledby="card-sc2-title">
                <span class="course-badge">Popular</span>
                <div class="card-icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 id="card-sc2-title" class="card-title">Secure Coding for Embedded C/C++</h3>
                <p class="card-desc">
                  Defensive coding techniques for embedded C and C++ — covering memory safety,
                  common vulnerability classes, MISRA alignment, and secure-by-design patterns.
                  Write code that holds up under adversarial conditions and satisfies the security
                  evidence requirements of your next certification.
                </p>
                <a
                  class="btn btn--secondary course-btn"
                  href="mailto:hello@fredstamconsulting.se?subject=Course%20Enquiry%3A%20Secure%20Coding%20for%20Embedded%20C%2FC%2B%2B"
                  aria-label="Book course: Secure Coding for Embedded C/C++ (opens email)"
                >
                  Book this course
                </a>
              </article>
            </li>
          </ul>

          <div class="courses-callout">
            <p class="courses-callout-text">
              Need something tailored to your team? I also deliver custom training on any topic —
              adapted to your domain, standards, and experience level.
            </p>
            <a
              class="btn btn--primary"
              href="mailto:hello@fredstamconsulting.se?subject=Custom%20Course%20Enquiry"
              aria-label="Get in touch about a custom course (opens email)"
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>

```

- [ ] **Step 3: Update the `<noscript>` fallback**

Find the existing `<noscript>` block in `<head>` (around line 105–112):
```html
    <noscript>
      <style>
        .service-card {
          opacity: 1 !important;
          transform: none !important;
        }
      </style>
    </noscript>
```

Replace with:
```html
    <noscript>
      <style>
        .service-card,
        .course-card {
          opacity: 1 !important;
          transform: none !important;
        }
      </style>
    </noscript>
```

---

### Task 3: Add courses CSS to `styles.css`

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Add the courses section styles**

Find the line `   ABOUT SECTION` inside the divider comment block (around line 750) and insert the entire courses block immediately before that whole `/* === ... ABOUT SECTION ... === */` comment:

```css
/* ============================================================
   COURSES SECTION
   ============================================================ */

.section--courses {
  background-color: var(--color-bg);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

@media (max-width: 767px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }
}

.courses-grid > li {
  display: flex;
}

.course-card {
  position: relative;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  width: 100%;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.course-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.course-card:hover {
  border-color: var(--color-accent-teal);
  box-shadow: 0 4px 24px color-mix(in srgb, var(--color-accent-teal) 12%, transparent);
}

.course-badge {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background-color: var(--color-accent-teal);
  color: #fff;
  border-radius: var(--radius);
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.04em;
}

.course-card .card-desc {
  flex: 1;
}

.course-btn {
  margin-top: var(--space-6);
  align-self: flex-start;
}

.courses-callout {
  margin-top: var(--space-12);
  max-width: 600px;
  margin-inline: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.courses-callout-text {
  font-size: 1.0625rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

```

- [ ] **Step 2: Update the `prefers-reduced-motion` block**

Find in the reduced-motion media query (around line 865–868):
```css
  .service-card {
    opacity: 1;
    transform: none;
  }
```

Replace with:
```css
  .service-card,
  .course-card {
    opacity: 1;
    transform: none;
  }
```

---

### Task 4: Add course card scroll-reveal to `script.js`

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add course card observer and renumber scroll-hint section**

Find the scroll-hint section comment (around line 112):
```js
/* ──────────────────────────────────────────────
   5. Scroll hint — hide after first scroll
────────────────────────────────────────────── */
```

Insert the course card observer block immediately before it, and update the scroll-hint number to 6:

```js
/* ──────────────────────────────────────────────
   5. Course card scroll-reveal (staggered)
────────────────────────────────────────────── */
const courseCards = document.querySelectorAll('.course-card');

const courseCardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const index = Array.from(courseCards).indexOf(card);
      setTimeout(() => {
        card.classList.add('is-visible');
      }, index * 100);
      courseCardObserver.unobserve(card);
    });
  },
  { threshold: 0.05 },
);

courseCards.forEach((card) => courseCardObserver.observe(card));

/* ──────────────────────────────────────────────
   6. Scroll hint — hide after first scroll
────────────────────────────────────────────── */
```

(Replace the old `5. Scroll hint` heading with `6. Scroll hint`.)

---

### Task 5: Run full test suite and linters

**Files:** None modified — verification only.

- [ ] **Step 1: Run Prettier check and auto-fix**

```bash
npx prettier --write index.html styles.css script.js
```

Expected: files reformatted (or no changes if already clean).

- [ ] **Step 2: Run ESLint on script.js**

```bash
npx eslint script.js
```

Expected: no errors or warnings.

- [ ] **Step 3: Run Stylelint on styles.css**

```bash
npx stylelint styles.css
```

Expected: no errors or warnings.

- [ ] **Step 4: Run the full test suite**

```bash
npm test
```

Expected output: all **16 tests pass** (11 original + 5 new Courses section tests). Zero failures.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css script.js tests/site.spec.js docs/superpowers/specs/2026-06-27-courses-section-design.md docs/superpowers/plans/2026-06-27-courses-section.md
git commit -m "feat: add courses section with 3 popular courses and booking links"
```
