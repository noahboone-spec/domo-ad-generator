/**
 * Render All Banners — Playwright Screenshot Pipeline
 *
 * Usage:
 *   npx tsx scripts/render-all.ts
 *   npx tsx scripts/render-all.ts --headline "Your custom headline" --cta "GET STARTED"
 *   npx tsx scripts/render-all.ts --headline "Connect all your data" --theme "Light" --prefix "di"
 *
 * Options:
 *   --headline  Custom headline text
 *   --cta       Custom CTA button text (default: LEARN MORE)
 *   --theme     Theme name (default: Default Dark)
 *   --prefix    Output filename prefix (default: banner slug)
 */
import { chromium } from "playwright";
import path from "path";
import fs from "fs";

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

function parseArgs() {
  const args = process.argv.slice(2);
  const opts: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--") && i + 1 < args.length) {
      opts[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }
  return opts;
}

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_DIR = path.resolve(__dirname, "../output");

async function main() {
  const opts = parseArgs();
  const headline = opts.headline || "";
  const cta = opts.cta || "";
  const theme = opts.theme || "";
  const prefix = opts.prefix || "";

  // Build query string for custom params
  const queryParts: string[] = [];
  if (headline) queryParts.push(`headline=${encodeURIComponent(headline)}`);
  if (cta) queryParts.push(`cta=${encodeURIComponent(cta)}`);
  if (theme) queryParts.push(`theme=${encodeURIComponent(theme)}`);
  const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

  // Create output subdirectory if prefix specified
  const outputDir = prefix ? path.join(OUTPUT_DIR, prefix) : OUTPUT_DIR;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching browser...");
  if (headline) console.log(`Headline: "${headline}"`);
  if (cta) console.log(`CTA: "${cta}"`);
  if (theme) console.log(`Theme: "${theme}"`);
  console.log("");

  const browser = await chromium.launch();

  for (const size of bannerSizes) {
    const url = `${BASE_URL}/render/${size.slug}${queryString}`;
    const filename = `${size.slug}.png`;
    const outputPath = path.join(outputDir, filename);

    console.log(`Rendering ${size.slug} (${size.width}x${size.height})...`);

    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
    });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: outputPath,
      clip: { x: 0, y: 0, width: size.width, height: size.height },
    });

    await context.close();
    console.log(`  ✓ ${outputPath}`);
  }

  await browser.close();
  console.log(`\nDone! ${bannerSizes.length} banners rendered to ${outputDir}`);
}

main().catch((err) => {
  console.error("Render failed:", err);
  process.exit(1);
});
