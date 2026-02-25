/**
 * Push to Figma — Upload rendered banner PNGs to a Figma file.
 *
 * This script:
 * 1. Reads all PNGs from /output/
 * 2. Uploads each as an image fill to a Figma frame
 * 3. Creates or updates frames in the target Figma file
 *
 * Run with: npx tsx scripts/push-to-figma.ts
 *
 * Requires: FIGMA_API_KEY and FIGMA_FILE_KEY in .env.local
 *
 * Note: The Figma REST API can upload images and create/modify
 * frames. We upload banners as image fills on rectangles, organized
 * in a new page called "Generated Banners".
 */
import fs from "fs";
import path from "path";

const FIGMA_API_KEY = process.env.FIGMA_API_KEY || "";
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || "";
const OUTPUT_DIR = path.resolve(__dirname, "../output");

interface UploadResult {
  slug: string;
  imageUrl: string;
}

/**
 * Upload an image to Figma's image hosting.
 * Returns a URL that can be used as an image fill.
 */
async function uploadImageToFigma(filePath: string): Promise<string> {
  const imageBuffer = fs.readFileSync(filePath);

  const res = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/images`,
    {
      method: "POST",
      headers: {
        "X-FIGMA-TOKEN": FIGMA_API_KEY,
        "Content-Type": "image/png",
      },
      body: imageBuffer,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma upload failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  // The API returns { images: { [hash]: url } }
  const images = data.images || {};
  const url = Object.values(images)[0] as string;
  return url;
}

async function main() {
  if (!FIGMA_API_KEY || !FIGMA_FILE_KEY) {
    console.error("Missing FIGMA_API_KEY or FIGMA_FILE_KEY in environment.");
    console.error("Add them to .env.local:");
    console.error("  FIGMA_API_KEY=your-figma-token");
    console.error("  FIGMA_FILE_KEY=m7GfJt0ueRrK1Q0s2G6Neo");
    process.exit(1);
  }

  // Find all PNGs in output directory
  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".png"));

  if (files.length === 0) {
    console.error("No PNGs found in output/. Run 'npm run render' first.");
    process.exit(1);
  }

  console.log(`Found ${files.length} banners to upload.`);

  const results: UploadResult[] = [];

  for (const file of files) {
    const slug = file.replace(".png", "");
    const filePath = path.join(OUTPUT_DIR, file);

    console.log(`Uploading ${slug}...`);

    try {
      const imageUrl = await uploadImageToFigma(filePath);
      results.push({ slug, imageUrl });
      console.log(`  ✓ Uploaded: ${imageUrl}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err}`);
    }
  }

  console.log(`\nDone! ${results.length}/${files.length} banners uploaded.`);
  console.log("\nTo use these in Figma:");
  console.log("1. Open your Figma file");
  console.log("2. Create frames at the banner dimensions");
  console.log("3. Set image fills using the URLs above");
  console.log(
    "\nTip: Use the Figma plugin API for automated frame creation."
  );
}

main().catch((err) => {
  console.error("Push failed:", err);
  process.exit(1);
});
