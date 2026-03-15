const { chromium } = require("@playwright/test");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1200, height: 630 });

  const htmlPath = path.resolve(__dirname, "../og-image.html");
  await page.goto(`file://${htmlPath}`);

  // Wait for fonts to load
  await page.waitForLoadState("networkidle");

  const outputPath = path.resolve(__dirname, "../og-image.png");
  await page.screenshot({ path: outputPath, clip: { x: 0, y: 0, width: 1200, height: 630 } });

  await browser.close();

  console.log(`og-image.png written to ${outputPath}`);
})();
