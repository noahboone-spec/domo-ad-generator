/**
 * Serve for Figma — Local HTTP server for the Figma plugin.
 *
 * Serves rendered banner PNGs + a manifest.json so the Figma plugin
 * can fetch images and create frames with image fills.
 *
 * Usage:
 *   npx tsx scripts/serve-for-figma.ts --dir data-integration
 *   npx tsx scripts/serve-for-figma.ts --dir data-integration --page "DI Campaign"
 *
 * Options:
 *   --dir   Subdirectory inside output/ to serve (required)
 *   --page  Name for the Figma page (default: directory name)
 *   --port  Server port (default: 8765)
 *
 * Then in Figma: Plugins → Development → Import plugin from manifest
 *               (point to figma-plugin/manifest.json)
 *               Run the plugin — it fetches from this server.
 */
import http from "http";
import fs from "fs";
import path from "path";

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

function main() {
  const opts = parseArgs();
  const subDir = opts.dir;
  const port = parseInt(opts.port || "8765", 10);

  if (!subDir) {
    console.error("Usage: npx tsx scripts/serve-for-figma.ts --dir <subdirectory>");
    console.error("Example: npx tsx scripts/serve-for-figma.ts --dir data-integration");
    process.exit(1);
  }

  const sourceDir = path.join(OUTPUT_DIR, subDir);
  if (!fs.existsSync(sourceDir)) {
    console.error(`Directory not found: ${sourceDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".png"));
  if (files.length === 0) {
    console.error(`No PNGs in ${sourceDir}`);
    process.exit(1);
  }

  // Build the page name from --page flag or directory name
  const pageName =
    opts.page ||
    subDir
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") + " Banners";

  // Build manifest
  const manifest = {
    pageName,
    banners: files.map((f) => {
      const slug = f.replace(".png", "");
      const dims = bannerDimensions[slug] || { width: 300, height: 250 };
      return {
        slug,
        file: f,
        width: dims.width,
        height: dims.height,
      };
    }),
  };

  const server = http.createServer((req, res) => {
    // CORS headers for Figma plugin
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = req.url || "/";

    if (url === "/manifest.json") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(manifest, null, 2));
      console.log(`  → Served manifest (${manifest.banners.length} banners)`);
      return;
    }

    // Serve PNG files
    const filename = url.slice(1); // remove leading /
    if (filename && files.includes(filename)) {
      const filePath = path.join(sourceDir, filename);
      const data = fs.readFileSync(filePath);
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": data.length,
      });
      res.end(data);
      console.log(`  → Served ${filename} (${data.length} bytes)`);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  });

  server.listen(port, () => {
    console.log(`\nDomo Banner Server running on http://localhost:${port}`);
    console.log(`Serving ${files.length} banners from output/${subDir}/`);
    console.log(`Page name: "${pageName}"`);
    console.log(`\nEndpoints:`);
    console.log(`  GET /manifest.json  — Banner metadata`);
    for (const f of files) {
      console.log(`  GET /${f}`);
    }
    console.log(`\nNow open Figma and run the "Domo Banner Importer" plugin.`);
    console.log(`Press Ctrl+C to stop.\n`);
  });
}

main();
