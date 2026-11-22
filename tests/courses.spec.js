'use strict';

const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

// courses.html is deliberately unlisted (noindex, no links from the homepage).
// These tests only run in the local suite — the production smoke config ignores this file.
test.describe('Courses subpage (unlisted)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/courses.html');
  });

  test('page is marked noindex', async ({ page }) => {
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toContain('noindex');
  });

  test('courses section has heading "Level Up Your Team"', async ({ page }) => {
    await expect(page.locator('#courses h2')).toHaveText('Level Up Your Team');
  });

  test('two course cards are present, each with a Popular badge', async ({ page }) => {
    await expect(page.locator('#courses .course-card')).toHaveCount(2);
    await expect(page.locator('#courses .course-badge')).toHaveCount(2);
  });

  test('threat modeling course is removed', async ({ page }) => {
    await expect(page.locator('text=Threat Modeling')).toHaveCount(0);
  });

  test('Book this course buttons have correct mailto hrefs', async ({ page }) => {
    const hrefs = [
      'mailto:hello@fredstamconsulting.se?subject=Course%20Enquiry%3A%20Safety-Critical%20Software%20Fundamentals',
      'mailto:hello@fredstamconsulting.se?subject=Course%20Enquiry%3A%20Secure%20Coding%20for%20Embedded%20C%2FC%2B%2B',
    ];
    const buttons = await page.locator('#courses .course-btn').all();
    expect(buttons).toHaveLength(2);
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

  test('nav has five links: four back to index.html sections plus #courses on this page', async ({
    page,
  }) => {
    await expect(page.locator('a.nav-link')).toHaveCount(5);
    for (const href of [
      'index.html#intro',
      'index.html#services',
      '#courses',
      'index.html#about',
      'index.html#contact',
    ]) {
      await expect(page.locator(`a.nav-link[href="${href}"]`)).toHaveCount(1);
    }
  });

  test('clicking the Courses nav link stays on this page and resolves #courses', async ({
    page,
  }) => {
    await page.locator('a.nav-link[href="#courses"]').click();
    await page.waitForLoadState('load');
    // `serve` normalizes clean URLs, so the path may be /courses or /courses.html
    const url = new URL(page.url());
    expect(url.pathname).toMatch(/\/courses(\.html)?$/);
    expect(url.hash).toBe('#courses');
    await expect(page.locator('#courses')).toHaveCount(1);
  });

  test('scroll-spy marks the Courses nav link active', async ({ page }) => {
    await expect(page.locator('a.nav-link[href="#courses"]')).toHaveClass(/is-active/);
  });
});

test.describe('Accessibility', () => {
  // Cards fade in via scroll-reveal; force the final state so axe measures
  // settled colors (mid-animation opacity blends and skews the contrast ratio).
  async function analyzeAfterReveal(page) {
    await page.addStyleTag({
      content:
        '.course-card { opacity: 1 !important; transform: none !important; transition: none !important; }',
    });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  }

  test('desktop: no WCAG 2.1 AA violations', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/courses.html');
    await analyzeAfterReveal(page);
  });

  test('mobile: no WCAG 2.1 AA violations', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/courses.html');
    await analyzeAfterReveal(page);
  });
});
