/**
 * Render All Banners — Playwright Screenshot Pipeline
 *
 * This script:
 * 1. Starts Playwright (headless Chromium)
 * 2. Visits each banner's /render/[slug] route
 * 3. Sets the viewport to the exact banner dimensions
 * 4. Takes a screenshot → saves to /output/[slug].png
 *
 * Run with: npx tsx scripts/render-all.ts
 *
 * Why Playwright? It renders real HTML/CSS in a real browser engine,
 * so you get pixel-perfect output — fonts, shadows, rounded corners,
 * everything looks exactly like the preview.
 */
import { chromium } from "playwright";
import path from "path";

// Banner size definitions (duplicated here to avoid Next.js import issues)
const bannerSizes = [
  { slug: "linkedin-1200x627", width: 1200, height: 627 },
  { slug: "gdn-200x200", width: 200, height: 200 },
  { slug: "gdn-250x250", width: 250, height: 250 },
  { slug: "gdn-300x250", width: 300, height: 250 },
  { slug: "gdn-336x280", width: 336, height: 280 },
  { slug: "gdn-468x60", width: 468, height: 60 },
  { slug: "gdn-728x90", width: 728, height: 90 },
  { slug: "gdn-320x50", width: 320, height: 50 },
  { slug: "gdn-320x100", width: 320, height: 100 },
  { slug: "gdn-120x600", width: 120, height: 600 },
  { slug: "gdn-160x600", width: 160, height: 600 },
  { slug: "gdn-300x600", width: 300, height: 600 },
];

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_DIR = path.resolve(__dirname, "../output");

async function main() {
  console.log("Launching browser...");
  const browser = await chromium.launch();

  for (const size of bannerSizes) {
    const url = `${BASE_URL}/render/${size.slug}`;
    const outputPath = path.join(OUTPUT_DIR, `${size.slug}.png`);

    console.log(`Rendering ${size.slug} (${size.width}x${size.height})...`);

    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
    });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: "networkidle" });

    // Wait for fonts to load
    await page.waitForTimeout(500);

    await page.screenshot({
      path: outputPath,
      clip: { x: 0, y: 0, width: size.width, height: size.height },
    });

    await context.close();
    console.log(`  ✓ Saved ${outputPath}`);
  }

  await browser.close();
  console.log(`\nDone! ${bannerSizes.length} banners rendered to ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("Render failed:", err);
  process.exit(1);
});
