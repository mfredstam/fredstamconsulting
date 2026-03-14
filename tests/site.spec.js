'use strict';

const { test, expect } = require('@playwright/test');
const { checkA11y, injectAxe } = require('@axe-core/playwright');

test.describe('Page structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page title contains "Fredstam Consulting"', async ({ page }) => {
    await expect(page).toHaveTitle(/Fredstam Consulting/);
  });

  test('meta description is non-empty', async ({ page }) => {
    const content = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(content).toBeTruthy();
  });

  test('all four nav links are present', async ({ page }) => {
    for (const href of ['#intro', '#services', '#about', '#contact']) {
      await expect(page.locator(`a.nav-link[href="${href}"]`)).toHaveCount(1);
    }
  });

  test('skip link is present', async ({ page }) => {
    await expect(page.locator('.skip-link')).toHaveCount(1);
  });

  test('footer year matches current year', async ({ page }) => {
    const result = await page.evaluate(() => ({
      footerYear: document.getElementById('footer-year')?.textContent?.trim(),
      currentYear: String(new Date().getFullYear()),
    }));
    expect(result.footerYear).toBe(result.currentYear);
  });

  test('all external links have rel="noopener noreferrer"', async ({ page }) => {
    const links = await page.locator('a[target="_blank"]').all();
    for (const link of links) {
      const rel = await link.getAttribute('rel');
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  });
});

test.describe('Hamburger menu', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking hamburger opens the nav', async ({ page }) => {
    await page.locator('#hamburger-btn').click();
    await expect(page.locator('#site-nav')).toHaveClass(/is-open/);
    await expect(page.locator('#hamburger-btn')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  test('pressing Escape closes the nav and focuses hamburger', async ({
    page,
  }) => {
    await page.locator('#hamburger-btn').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#site-nav')).not.toHaveClass(/is-open/);
    await expect(page.locator('#hamburger-btn')).toBeFocused();
  });

  test('clicking a nav link closes the nav', async ({ page }) => {
    await page.locator('#hamburger-btn').click();
    await page.locator('#site-nav .nav-link').first().click();
    await expect(page.locator('#site-nav')).not.toHaveClass(/is-open/);
  });
});
