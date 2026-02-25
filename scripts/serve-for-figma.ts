/**
 * Serve for Figma — Local HTTP server for the Figma plugin.
 *
 * Auto-detects SVG or PNG files in the output directory and serves
 * them with proper CORS headers for the Figma plugin to fetch.
 *
 * Usage:
 *   npx tsx scripts/serve-for-figma.ts --dir di-svgs
 *   npx tsx scripts/serve-for-figma.ts --dir data-integration
 *   npx tsx scripts/serve-for-figma.ts --dir di-svgs --page "DI Campaign"
 *
 * Options:
 *   --dir   Subdirectory inside output/ to serve (required)
 *   --page  Name for the Figma page (default: from directory name)
 *   --port  Server port (default: 8765)
 *
 * Then in Figma: Plugins → Development → Domo Banner Importer
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

const CONTENT_TYPES: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
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
    console.error("Example: npx tsx scripts/serve-for-figma.ts --dir di-svgs");
    process.exit(1);
  }

  const sourceDir = path.join(OUTPUT_DIR, subDir);
  if (!fs.existsSync(sourceDir)) {
    console.error(`Directory not found: ${sourceDir}`);
    process.exit(1);
  }

  // Auto-detect file type: prefer SVGs, fall back to PNGs
  let files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".svg"));
  let fileType: "svg" | "png" = "svg";

  if (files.length === 0) {
    files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".png"));
    fileType = "png";
  }

  if (files.length === 0) {
    console.error(`No SVG or PNG files in ${sourceDir}`);
    process.exit(1);
  }

  const ext = fileType === "svg" ? ".svg" : ".png";

  // Build the page name
  const pageName =
    opts.page ||
    subDir
      .replace(/-svgs$/, "")
      .replace(/-png$/, "")
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") + " Banners";

  // Build manifest
  const manifest = {
    pageName,
    fileType,
    banners: files.map((f) => {
      const slug = f.replace(ext, "");
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
      console.log(`  → Served manifest (${manifest.banners.length} ${fileType.toUpperCase()} banners)`);
      return;
    }

    // Serve banner files
    const filename = url.slice(1);
    if (filename && files.includes(filename)) {
      const filePath = path.join(sourceDir, filename);
      const data = fs.readFileSync(filePath);
      const fileExt = path.extname(filename);
      const contentType = CONTENT_TYPES[fileExt] || "application/octet-stream";

      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": data.length,
      });
      res.end(data);
      console.log(`  → Served ${filename} (${(data.length / 1024).toFixed(0)}KB)`);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  });

  server.listen(port, () => {
    const typeLabel = fileType === "svg" ? "SVG (editable vectors)" : "PNG (flat images)";
    console.log(`\nDomo Banner Server — http://localhost:${port}`);
    console.log(`${"─".repeat(50)}`);
    console.log(`Directory:  output/${subDir}/`);
    console.log(`File type:  ${typeLabel}`);
    console.log(`Page name:  "${pageName}"`);
    console.log(`Banners:    ${files.length}`);
    console.log(`${"─".repeat(50)}`);
    console.log(`\nEndpoints:`);
    console.log(`  GET /manifest.json`);
    for (const f of files) {
      console.log(`  GET /${f}`);
    }
    console.log(`\nOpen Figma → Plugins → Development → Domo Banner Importer`);
    console.log(`Press Ctrl+C when done.\n`);
  });
}

main();
