/**
 * Push to Figma — Upload rendered banner PNGs to a Figma file.
 *
 * Usage:
 *   npx tsx scripts/push-to-figma.ts
 *   npx tsx scripts/push-to-figma.ts --dir data-integration
 *
 * Options:
 *   --dir   Subdirectory inside output/ to read from (e.g., "data-integration")
 *
 * Requires: FIGMA_API_KEY and FIGMA_FILE_KEY in .env.local
 *
 * How it works:
 * 1. Reads all PNGs from /output/ (or /output/<dir>/)
 * 2. Uploads each image to Figma's image hosting
 * 3. Returns hosted URLs that can be used as image fills in Figma
 *
 * Note: The Figma REST API can host images but cannot create
 * frames/nodes programmatically. For automated frame creation,
 * a Figma plugin is needed. The uploaded image URLs can be
 * referenced in plugin code or used via "Fill > Image" in Figma.
 */
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const FIGMA_API_KEY = process.env.FIGMA_API_KEY || "";
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || "";
const OUTPUT_DIR = path.resolve(__dirname, "../output");

const bannerDimensions: Record<string, { width: number; height: number }> = {
  "linkedin-1200x627": { width: 1200, height: 627 },
  "gdn-200x200": { width: 200, height: 200 },
  "gdn-250x250": { width: 250, height: 250 },
  "gdn-300x250": { width: 300, height: 250 },
  "gdn-336x280": { width: 336, height: 280 },
  "gdn-468x60": { width: 468, height: 60 },
  "gdn-728x90": { width: 728, height: 90 },
  "gdn-320x50": { width: 320, height: 50 },
  "gdn-320x100": { width: 320, height: 100 },
  "gdn-120x600": { width: 120, height: 600 },
  "gdn-160x600": { width: 160, height: 600 },
  "gdn-300x600": { width: 300, height: 600 },
};

interface UploadResult {
  slug: string;
  imageRef: string;
  width: number;
  height: number;
}

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

/**
 * Upload an image to Figma's file-level image hosting.
 * Returns an image reference that can be used in image fills.
 */
async function uploadImageToFigma(
  filePath: string
): Promise<{ imageRef: string }> {
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

  const data = (await res.json()) as {
    meta?: { images?: Record<string, string> };
    images?: Record<string, string>;
  };

  // API returns either { meta: { images: { hash: ref } } } or { images: { hash: ref } }
  const images = data.meta?.images || data.images || {};
  const imageRef = Object.values(images)[0] as string;

  if (!imageRef) {
    throw new Error("No image reference returned from Figma API");
  }

  return { imageRef };
}

async function main() {
  const opts = parseArgs();
  const subDir = opts.dir || "";

  if (!FIGMA_API_KEY || !FIGMA_FILE_KEY) {
    console.error("Missing FIGMA_API_KEY or FIGMA_FILE_KEY in .env.local");
    console.error("Add them to .env.local:");
    console.error("  FIGMA_API_KEY=your-figma-token");
    console.error("  FIGMA_FILE_KEY=m7GfJt0ueRrK1Q0s2G6Neo");
    process.exit(1);
  }

  const sourceDir = subDir ? path.join(OUTPUT_DIR, subDir) : OUTPUT_DIR;

  if (!fs.existsSync(sourceDir)) {
    console.error(`Directory not found: ${sourceDir}`);
    console.error(
      "Run 'npm run render' first, or check the --dir flag matches your output folder."
    );
    process.exit(1);
  }

  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".png"));

  if (files.length === 0) {
    console.error(`No PNGs found in ${sourceDir}. Run 'npm run render' first.`);
    process.exit(1);
  }

  console.log(`Pushing ${files.length} banners to Figma file ${FIGMA_FILE_KEY}`);
  if (subDir) console.log(`Source: output/${subDir}/`);
  console.log("");

  const results: UploadResult[] = [];

  for (const file of files) {
    const slug = file.replace(".png", "");
    const dims = bannerDimensions[slug] || { width: 0, height: 0 };
    const filePath = path.join(sourceDir, file);

    console.log(`Uploading ${slug} (${dims.width}x${dims.height})...`);

    try {
      const { imageRef } = await uploadImageToFigma(filePath);
      results.push({ slug, imageRef, ...dims });
      console.log(`  ✓ Image ref: ${imageRef}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err}`);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Uploaded ${results.length}/${files.length} banners to Figma.`);
  console.log(`${"=".repeat(60)}\n`);

  if (results.length > 0) {
    console.log("Image references (use in Figma plugin or image fills):\n");
    for (const r of results) {
      console.log(`  ${r.slug} (${r.width}x${r.height}): ${r.imageRef}`);
    }
    console.log(
      "\nThese images are now hosted in your Figma file and can be used as image fills."
    );
  }
}

main().catch((err) => {
  console.error("Push failed:", err);
  process.exit(1);
});
