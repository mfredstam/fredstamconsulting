'use strict';

const { test, expect } = require('@playwright/test');

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

  test('nav links point back to the main page sections', async ({ page }) => {
    for (const href of [
      'index.html#intro',
      'index.html#services',
      'index.html#about',
      'index.html#contact',
    ]) {
      await expect(page.locator(`a.nav-link[href="${href}"]`)).toHaveCount(1);
    }
  });
});
