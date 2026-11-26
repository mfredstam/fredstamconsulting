'use strict';

const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

test.describe('Page structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page title contains "Fredstam Consulting"', async ({ page }) => {
    await expect(page).toHaveTitle(/Fredstam Consulting/);
  });

  test('meta description is non-empty', async ({ page }) => {
    const content = await page.locator('meta[name="description"]').getAttribute('content');
    expect(content).toBeTruthy();
  });

  test('all four nav links are present', async ({ page }) => {
    for (const href of ['#intro', '#services', '#about', '#contact']) {
      await expect(page.locator(`a.nav-link[href="${href}"]`)).toHaveCount(1);
    }
  });

  test('nav has exactly four links and nothing on the page links to a courses page', async ({
    page,
  }) => {
    await expect(page.locator('a.nav-link')).toHaveCount(4);
    await expect(page.locator('a[href*="courses"]')).toHaveCount(0);
    await expect(page.locator('#courses')).toHaveCount(0);
  });

  test('three service cards are present', async ({ page }) => {
    await expect(page.locator('#services .service-card')).toHaveCount(3);
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

  test('scroll-spy highlights the section in view', async ({ page }) => {
    await page.locator('#services').scrollIntoViewIfNeeded();
    await expect(page.locator('a.nav-link[href="#services"]')).toHaveClass(/is-active/);
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
    await expect(page.locator('#hamburger-btn')).toHaveAttribute('aria-expanded', 'true');
  });

  test('pressing Escape closes the nav and focuses hamburger', async ({ page }) => {
    await page.locator('#hamburger-btn').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#site-nav')).not.toHaveClass(/is-open/);
    await expect(page.locator('#hamburger-btn')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#hamburger-btn')).toBeFocused();
  });

  test('clicking a nav link closes the nav', async ({ page }) => {
    await page.locator('#hamburger-btn').click();
    await page.locator('#site-nav .nav-link').first().click();
    await expect(page.locator('#site-nav')).not.toHaveClass(/is-open/);
    await expect(page.locator('#hamburger-btn')).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('Accessibility', () => {
  test('desktop: no WCAG 2.1 AA violations', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('mobile: no WCAG 2.1 AA violations', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('Booking link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('intro call button is present in contact section with correct href', async ({
    page,
  }) => {
    const btn = page.locator(
      '#contact a.btn[href="https://calendar.app.google/rnSpPJT3fTj9bpxi9"]',
    );
    await expect(btn).toHaveCount(1);
    await expect(btn).toHaveText('Book a 30-min intro call');
  });

  test('intro call button opens in new tab with noopener noreferrer', async ({ page }) => {
    const btn = page.locator(
      '#contact a.btn[href="https://calendar.app.google/rnSpPJT3fTj9bpxi9"]',
    );
    await expect(btn).toHaveAttribute('target', '_blank');
    await expect(btn).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('intro call button has descriptive aria-label mentioning new tab', async ({ page }) => {
    const btn = page.locator(
      '#contact a.btn[href="https://calendar.app.google/rnSpPJT3fTj9bpxi9"]',
    );
    const label = await btn.getAttribute('aria-label');
    expect(label).toContain('opens in new tab');
  });

  test('contact description mentions booking via Google Calendar', async ({ page }) => {
    const desc = page.locator('#contact .contact-desc').nth(0);
    await expect(desc).toContainText('book a meeting directly via Google Calendar');
  });
});
