/**
 * Serve for Figma — Local HTTP server for the Figma plugin.
 *
 * Supports TWO modes:
 *   1. Generate mode (default): Plugin UI has a form to generate banners on the fly
 *   2. Serve mode (--dir): Serves pre-generated files from output/ (legacy behavior)
 *
 * API Endpoints (generate mode):
 *   GET  /api/themes        — Available themes (6 Domo brand themes)
 *   GET  /api/layouts       — Available layouts with dimensions
 *   GET  /api/illustrations — Available illustration files
 *   POST /api/generate      — Generate SVGs from form data
 *   POST /api/copy          — Generate headline/CTA suggestions from Knowledge Graph
 *   POST /api/generate-image — Generate illustration via Gemini AI
 *
 * Legacy Endpoints (serve mode):
 *   GET /manifest.json      — Banner manifest
 *   GET /{filename}         — Serve individual banner files
 *
 * Usage:
 *   npx tsx scripts/serve-for-figma.ts                        # Generate mode
 *   npx tsx scripts/serve-for-figma.ts --dir di-svgs          # Serve mode (legacy)
 *   npx tsx scripts/serve-for-figma.ts --port 9000            # Custom port
 */
import http from "http";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load API keys: env vars first (Cloud Run), fallback to toolkit .env (local dev)
if (!process.env.GEMINI_API_KEY) {
  dotenv.config({ path: path.resolve(process.env.HOME || "", ".domo-toolkit/.env") });
}

// Allow self-signed certs (corporate proxy environments)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, "output");
const ASSETS_DIR = path.resolve(PROJECT_ROOT, "public/assets");

// ──────────────────────────────────────────────
// Themes
// ──────────────────────────────────────────────
interface ThemeConfig {
  bgColor: string;
  headlineColor: string;
  headlineFontWeight: number;
  ctaBgColor: string;
  ctaTextColor: string;
  ctaBorderRadius: number;
  logoBgColor: string;
}

const themes: Record<string, ThemeConfig> = {
  dark: {
    bgColor: "#3F454D",
    headlineColor: "#99CCEE",
    headlineFontWeight: 800,
    ctaBgColor: "#FF9922",
    ctaTextColor: "#FFFFFF",
    ctaBorderRadius: 3,
    logoBgColor: "#99CCEE",
  },
  light: {
    bgColor: "#F1F6FA",
    headlineColor: "#3F454D",
    headlineFontWeight: 800,
    ctaBgColor: "#FF9922",
    ctaTextColor: "#FFFFFF",
    ctaBorderRadius: 3,
    logoBgColor: "#99CCEE",
  },
  blue: {
    bgColor: "#99CCEE",
    headlineColor: "#FFFFFF",
    headlineFontWeight: 800,
    ctaBgColor: "#FF9922",
    ctaTextColor: "#FFFFFF",
    ctaBorderRadius: 3,
    logoBgColor: "#FFFFFF",
  },
  purple: {
    bgColor: "#F1F6FA",
    headlineColor: "#776CB0",
    headlineFontWeight: 800,
    ctaBgColor: "#FF9922",
    ctaTextColor: "#FFFFFF",
    ctaBorderRadius: 3,
    logoBgColor: "#99CCEE",
  },
  mint: {
    bgColor: "#FFFFFF",
    headlineColor: "#3F454D",
    headlineFontWeight: 800,
    ctaBgColor: "#FF9922",
    ctaTextColor: "#FFFFFF",
    ctaBorderRadius: 3,
    logoBgColor: "#99CCEE",
  },
  bold: {
    bgColor: "#111111",
    headlineColor: "#FF9922",
    headlineFontWeight: 800,
    ctaBgColor: "#99CCEE",
    ctaTextColor: "#111111",
    ctaBorderRadius: 3,
    logoBgColor: "#FFFFFF",
  },
};

// ──────────────────────────────────────────────
// Logo SVG path data
// ──────────────────────────────────────────────
const LOGO_PATH =
  "M0 36.6144H8.45928C10.2852 36.6144 12.0089 36.9683 13.6285 37.675C15.2491 38.3826 16.6696 39.3472 17.8913 40.5687C19.113 41.7907 20.0767 43.2114 20.7852 44.8307C21.2183 45.824 21.5176 46.8555 21.6852 47.9262C22.0943 45.1244 23.3557 42.6646 25.4715 40.5494C28.043 37.9255 31.1928 36.6144 34.9222 36.6144C38.6259 36.6144 41.7757 37.9255 44.3739 40.5494C46.2889 42.4464 47.508 44.6196 48.0385 47.0681V36.6144L61.4237 49.9999L74.8489 36.6144V47.0538C75.3759 44.6114 76.5828 42.4418 78.4752 40.5494C81.0472 37.9255 84.198 36.6144 87.9274 36.6144C91.6309 36.6144 94.7796 37.9255 97.3778 40.5492C98.4837 41.6435 99.355 42.8331 100 44.1118V0H0V36.6144ZM87.9274 63.3856C84.2237 63.3856 81.073 62.0748 78.475 59.4506C76.5826 57.5769 75.3757 55.4128 74.8487 52.9619V63.3854H70.3341V47.3764L61.4237 56.3258L52.4754 47.3764V63.3856H48.0385V52.963C47.5078 55.4275 46.2889 57.5915 44.3739 59.4506C41.7757 62.0745 38.6259 63.3856 34.9222 63.3856C31.2198 63.3856 28.0689 62.0748 25.4717 59.4506C23.3537 57.3547 22.0924 54.8969 21.6841 52.0803C21.5159 53.1484 21.2172 54.1782 20.7852 55.1691C20.0767 56.7893 19.1193 58.2108 17.9109 59.4317C16.7022 60.6532 15.2813 61.6176 13.648 62.3243C12.0148 63.033 10.2855 63.3856 8.45939 63.3856H0V100H100V55.9249C99.355 57.201 98.4835 58.3776 97.3778 59.4508C94.7798 62.0748 91.6309 63.3856 87.9274 63.3856ZM14.7661 56.2838C15.577 55.4601 16.2135 54.5095 16.6759 53.4288C17.1396 52.3482 17.3707 51.2047 17.3707 49.9951C17.3707 48.7873 17.1396 47.6421 16.6759 46.5625C16.2135 45.4818 15.5704 44.5309 14.7478 43.7072C13.9239 42.8844 12.9724 42.2416 11.8926 41.779C10.8129 41.3155 9.66767 41.0842 8.45898 41.0842H3.98437V58.9067H8.45898C9.69348 58.9067 10.8516 58.6754 11.9313 58.2119C13.0111 57.7495 13.9563 57.1065 14.7661 56.2838ZM94.215 56.3295C95.9637 54.5551 96.8387 52.4473 96.8387 50.0032C96.8387 47.5607 95.9637 45.4649 94.215 43.7153C92.4665 41.9666 90.3713 41.0922 87.9285 41.0922C85.485 41.0922 83.3754 41.9666 81.6011 43.7153C79.878 45.4646 79.0176 47.5607 79.0176 50.0032C79.0176 52.4473 79.878 54.5551 81.6011 56.3295C83.3754 58.0534 85.485 58.915 87.9285 58.915C90.3715 58.9147 92.4665 58.0534 94.215 56.3295ZM41.2111 56.3295C42.9596 54.5551 43.8339 52.4473 43.8339 50.0032C43.8339 47.5607 42.9596 45.4649 41.2111 43.7153C39.4615 41.9666 37.3657 41.0922 34.9222 41.0922C32.4789 41.0922 30.3702 41.9666 28.5959 43.7153C26.8728 45.4646 26.0115 47.5607 26.0115 50.0032C26.0115 52.4473 26.8728 54.5551 28.5959 56.3295C30.3702 58.0534 32.4789 58.915 34.9222 58.915C37.3657 58.9147 39.4615 58.0534 41.2111 56.3295Z";

// ──────────────────────────────────────────────
// Layout definitions
// ──────────────────────────────────────────────
interface LayoutDef {
  slug: string;
  width: number;
  height: number;
  channel: "linkedin" | "gdn";
  logo: { x: number; y: number; size: number };
  headline: { x: number; y: number; width: number; fontSize: number };
  cta?: { x: number; y: number; fontSize: number };
  illustration: { x: number; y: number; width: number; height: number };
  illustrationAnchor?: "right" | "left";
}

const layouts: LayoutDef[] = [
  {
    slug: "linkedin-1200x627", width: 1200, height: 627, channel: "linkedin",
    logo: { x: 80, y: 40, size: 80 },
    headline: { x: 80, y: 160, width: 600, fontSize: 64 },
    cta: { x: 80, y: 540, fontSize: 18 },
    illustration: { x: 50, y: 80, width: 480, height: 468 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-300x250", width: 300, height: 250, channel: "gdn",
    logo: { x: 21, y: 12, size: 42 },
    headline: { x: 20, y: 68, width: 232, fontSize: 18 },
    cta: { x: 21, y: 185, fontSize: 10 },
    illustration: { x: -26, y: 108, width: 131, height: 161 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-728x90", width: 728, height: 90, channel: "gdn",
    logo: { x: 18, y: 18, size: 54 },
    headline: { x: 116, y: 18, width: 340, fontSize: 16 },
    cta: { x: 464, y: 39, fontSize: 10 },
    illustration: { x: -22, y: -14, width: 111, height: 136 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-160x600", width: 160, height: 600, channel: "gdn",
    logo: { x: 15, y: 15, size: 42 },
    headline: { x: 17, y: 94, width: 130, fontSize: 14 },
    cta: { x: 18, y: 231, fontSize: 9 },
    illustration: { x: -21, y: 300, width: 250, height: 306 },
    illustrationAnchor: "left",
  },
  {
    slug: "gdn-320x50", width: 320, height: 50, channel: "gdn",
    logo: { x: 10, y: 10, size: 30 },
    headline: { x: 57, y: 12, width: 166, fontSize: 8 },
    cta: { x: 226, y: 19, fontSize: 6 },
    illustration: { x: -27, y: -13, width: 60, height: 73 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-120x600", width: 120, height: 600, channel: "gdn",
    logo: { x: 12, y: 12, size: 42 },
    headline: { x: 11, y: 77, width: 107, fontSize: 11 },
    cta: { x: 12, y: 189, fontSize: 9 },
    illustration: { x: -46, y: 255, width: 304, height: 372 },
    illustrationAnchor: "left",
  },
  {
    slug: "gdn-468x60", width: 468, height: 60, channel: "gdn",
    logo: { x: 12, y: 12, size: 36 },
    headline: { x: 77, y: 12, width: 222, fontSize: 11 },
    cta: { x: 311, y: 26, fontSize: 7 },
    illustration: { x: -6, y: -9, width: 74, height: 91 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-300x600", width: 300, height: 600, channel: "gdn",
    logo: { x: 24, y: 16, size: 65 },
    headline: { x: 22, y: 108, width: 224, fontSize: 24 },
    cta: { x: 22, y: 309, fontSize: 12 },
    illustration: { x: 78, y: 325, width: 250, height: 306 },
    illustrationAnchor: "left",
  },
  {
    slug: "gdn-336x280", width: 336, height: 280, channel: "gdn",
    logo: { x: 24, y: 12, size: 48 },
    headline: { x: 23, y: 76, width: 259, fontSize: 19 },
    cta: { x: 24, y: 206, fontSize: 10 },
    illustration: { x: -30, y: 121, width: 147, height: 180 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-250x250", width: 250, height: 250, channel: "gdn",
    logo: { x: 20, y: 12, size: 38 },
    headline: { x: 19, y: 63, width: 216, fontSize: 15 },
    cta: { x: 20, y: 174, fontSize: 9 },
    illustration: { x: -9, y: 122, width: 118, height: 145 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-200x200", width: 200, height: 200, channel: "gdn",
    logo: { x: 16, y: 10, size: 32 },
    headline: { x: 15, y: 50, width: 173, fontSize: 12 },
    cta: { x: 16, y: 139, fontSize: 8 },
    illustration: { x: -7, y: 98, width: 95, height: 116 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-320x100", width: 320, height: 100, channel: "gdn",
    logo: { x: 20, y: 10, size: 28 },
    headline: { x: 19, y: 40, width: 190, fontSize: 9 },
    cta: { x: 20, y: 76, fontSize: 6 },
    illustration: { x: -9, y: -10, width: 101, height: 124 },
    illustrationAnchor: "right",
  },
];

// ──────────────────────────────────────────────
// Text wrapping helper
// ──────────────────────────────────────────────
function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const avgCharWidth = fontSize * 0.52;
  const charsPerLine = Math.floor(maxWidth / avgCharWidth);
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= charsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ──────────────────────────────────────────────
// SVG generation
// ──────────────────────────────────────────────
function generateSVG(
  layout: LayoutDef,
  headline: string,
  cta: string,
  illustrationBase64: string,
  theme: ThemeConfig
): string {
  const { width, height, logo, illustration } = layout;
  const hl = layout.headline;
  const lineHeight = hl.fontSize * 1.3;

  const lines = wrapText(headline, hl.width, hl.fontSize);

  let illustrationX: number;
  if (layout.illustrationAnchor === "right") {
    illustrationX = width + illustration.x - illustration.width;
  } else {
    illustrationX = illustration.x;
  }
  const illustrationY = illustration.y;

  const ctaPadH = layout.cta ? layout.cta.fontSize * 1.8 : 0;
  const ctaPadV = layout.cta ? layout.cta.fontSize * 0.7 : 0;
  const ctaTextWidth = layout.cta ? cta.length * layout.cta.fontSize * 0.62 : 0;
  const ctaW = ctaTextWidth + ctaPadH * 2;
  const ctaH = layout.cta ? layout.cta.fontSize + ctaPadV * 2 : 0;
  const illusRx = 12;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <clipPath id="banner-clip">
      <rect width="${width}" height="${height}" />
    </clipPath>
    <clipPath id="illus-clip">
      <rect x="${illustrationX}" y="${illustrationY}" width="${illustration.width}" height="${illustration.height}" rx="${illusRx}" />
    </clipPath>
    <filter id="illus-shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="16" flood-color="#000000" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Background -->
  <g id="Background">
    <rect width="${width}" height="${height}" fill="${theme.bgColor}" />
  </g>

  <g clip-path="url(#banner-clip)">

  <!-- Illustration -->
  <g id="Illustration" filter="url(#illus-shadow)">
    <rect x="${illustrationX}" y="${illustrationY}" width="${illustration.width}" height="${illustration.height}" rx="${illusRx}" fill="#FFFFFF" />
    <image
      x="${illustrationX}"
      y="${illustrationY}"
      width="${illustration.width}"
      height="${illustration.height}"
      href="data:image/png;base64,${illustrationBase64}"
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#illus-clip)"
    />
  </g>

  <!-- Logo -->
  <g id="Logo" transform="translate(${logo.x}, ${logo.y})">
    <svg width="${logo.size}" height="${logo.size}" viewBox="0 0 100 100">
      <path fill-rule="evenodd" clip-rule="evenodd" d="${LOGO_PATH}" fill="${theme.logoBgColor}" />
    </svg>
  </g>

  <!-- Headline -->
  <g id="Headline">
    <text
      x="${hl.x}"
      y="${hl.y + hl.fontSize}"
      font-family="Open Sans, sans-serif"
      font-size="${hl.fontSize}"
      font-weight="${theme.headlineFontWeight}"
      fill="${theme.headlineColor}"
    >`;

  for (let i = 0; i < lines.length; i++) {
    if (i === 0) {
      svg += `\n      <tspan x="${hl.x}" dy="0">${escapeXml(lines[i])}</tspan>`;
    } else {
      svg += `\n      <tspan x="${hl.x}" dy="${lineHeight}">${escapeXml(lines[i])}</tspan>`;
    }
  }

  svg += `
    </text>
  </g>`;

  if (layout.cta) {
    svg += `

  <!-- CTA Button -->
  <g id="CTA-Button">
    <rect
      x="${layout.cta.x}"
      y="${layout.cta.y}"
      width="${ctaW}"
      height="${ctaH}"
      rx="${theme.ctaBorderRadius}"
      fill="${theme.ctaBgColor}"
    />
    <text
      x="${layout.cta.x + ctaW / 2}"
      y="${layout.cta.y + ctaH / 2 + layout.cta.fontSize * 0.35}"
      font-family="Open Sans, sans-serif"
      font-size="${layout.cta.fontSize}"
      font-weight="700"
      fill="${theme.ctaTextColor}"
      text-anchor="middle"
    >${escapeXml(cta)}</text>
  </g>`;
  }

  svg += `

  </g>
</svg>`;

  return svg;
}

// ──────────────────────────────────────────────
// CLI args
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// CORS helper
// ──────────────────────────────────────────────
function setCors(res: http.ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res: http.ServerResponse, data: unknown, status = 200) {
  setCors(res);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// ──────────────────────────────────────────────
// Read POST body
// ──────────────────────────────────────────────
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

// ──────────────────────────────────────────────
// Server
// ──────────────────────────────────────────────
const opts = parseArgs();
const PORT = parseInt(process.env.PORT || opts.port || "8765", 10);
const DIR = opts.dir; // optional — enables legacy serve mode

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);

  // CORS preflight
  if (req.method === "OPTIONS") {
    setCors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // ── API: GET /api/themes ──
  if (url.pathname === "/api/themes" && req.method === "GET") {
    sendJson(res, Object.keys(themes).map((name) => ({
      name,
      bgColor: themes[name].bgColor,
      headlineColor: themes[name].headlineColor,
      ctaBgColor: themes[name].ctaBgColor,
      logoBgColor: themes[name].logoBgColor,
    })));
    return;
  }

  // ── API: GET /api/layouts ──
  if (url.pathname === "/api/layouts" && req.method === "GET") {
    sendJson(res, layouts.map((l) => ({
      slug: l.slug,
      width: l.width,
      height: l.height,
      channel: l.channel,
    })));
    return;
  }

  // ── API: GET /api/illustrations ──
  if (url.pathname === "/api/illustrations" && req.method === "GET") {
    const files = fs.readdirSync(ASSETS_DIR)
      .filter((f) => f.endsWith(".png") || f.endsWith(".jpg"));
    sendJson(res, files);
    return;
  }

  // ── API: POST /api/copy (Knowledge Graph) ──
  if (url.pathname === "/api/copy" && req.method === "POST") {
    try {
      const body = JSON.parse(await readBody(req));
      const product: string = body.product || "data integration";
      const KG_API_URL = "https://knowledge-graph-api-1053548598846.us-central1.run.app";
      // Default key from kg_api_helper.py — env var override if set correctly
      const KG_API_KEY = "1nbtfQeoY9/nmY8xvdbhrF9H23q6tqh6q7jmIiu8Xxs=";

      if (!KG_API_KEY) {
        sendJson(res, { error: "KG_API_KEY not configured in ~/.domo-toolkit/.env" }, 500);
        return;
      }

      const kgRes = await fetch(`${KG_API_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": KG_API_KEY },
        body: JSON.stringify({
          query: `Generate exactly 5 short punchy ad headlines (max 8 words each) for Domo ${product}. List them as a numbered list 1-5, one per line, no explanations. Then list 2 CTA button texts prefixed with "CTA:".`,
        }),
      });

      const kgData = await kgRes.json() as { answer?: string; result?: string; error?: string };
      if (kgData.error) {
        sendJson(res, { error: kgData.error }, 502);
        return;
      }

      const answer = kgData.answer || kgData.result || "";

      // Extract headlines: lines starting with number or bold markdown
      const headlines: string[] = [];
      const ctas: string[] = [];
      for (const rawLine of answer.split("\n")) {
        const line = rawLine
          .replace(/^\*\*\d+[\.\)]\s*/, "")  // **1.
          .replace(/^\d+[\.\)]\s*/, "")        // 1.
          .replace(/^[-*]+\s*/, "")            // - or *
          .replace(/\*\*/g, "")                // bold markers
          .trim();

        if (!line || line.length < 4) continue;

        if (rawLine.trim().toLowerCase().startsWith("cta:") || rawLine.trim().toLowerCase().startsWith("cta ")) {
          ctas.push(line.replace(/^cta[:\s]*/i, "").trim().toUpperCase());
        } else if (/^\d/.test(rawLine.trim()) || /^\*\*\d/.test(rawLine.trim())) {
          // Only take the headline part (before any explanation)
          const headlinePart = line.split(/[*\u2014\u2013–—]/).shift()?.trim() || line;
          if (headlinePart.length >= 4 && headlinePart.length <= 80) {
            headlines.push(headlinePart);
          }
        }
      }

      sendJson(res, {
        headlines: headlines.slice(0, 5),
        ctas: ctas.length > 0 ? ctas.slice(0, 3) : ["LEARN MORE", "GET STARTED"],
      });
    } catch (err) {
      sendJson(res, { error: String(err) }, 500);
    }
    return;
  }

  // ── API: POST /api/generate-image (Gemini) ──
  if (url.pathname === "/api/generate-image" && req.method === "POST") {
    try {
      const body = JSON.parse(await readBody(req));
      const prompt: string = body.prompt || "modern data dashboard screenshot";
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

      if (!GEMINI_API_KEY) {
        sendJson(res, { error: "GEMINI_API_KEY not configured in ~/.domo-toolkit/.env" }, 500);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: prompt,
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      // Extract base64 image from response
      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: any) => p.inlineData);

      if (!imagePart?.inlineData?.data) {
        sendJson(res, { error: "No image generated — try a different prompt" }, 400);
        return;
      }

      const imageBase64 = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType || "image/png";

      // Save to assets for reuse
      const filename = `generated-${Date.now()}.png`;
      const savePath = path.join(ASSETS_DIR, filename);
      fs.writeFileSync(savePath, Buffer.from(imageBase64, "base64"));
      console.log(`  Saved generated image: ${filename}`);

      sendJson(res, { imageBase64, mimeType, filename });
    } catch (err) {
      sendJson(res, { error: String(err) }, 500);
    }
    return;
  }

  // ── API: POST /api/generate ──
  if (url.pathname === "/api/generate" && req.method === "POST") {
    try {
      const body = JSON.parse(await readBody(req));
      const headline: string = body.headline || "Connect all your data sources in minutes";
      const cta: string = body.cta || "LEARN MORE";
      const themeName: string = body.theme || "dark";
      const channels: string[] = body.channels || ["linkedin", "gdn"];
      const illustrationFile: string = body.illustration || "illustration.png";

      const theme = themes[themeName];
      if (!theme) {
        sendJson(res, { error: `Unknown theme: ${themeName}` }, 400);
        return;
      }

      // Use provided base64 (from Gemini) or load from file
      let illustrationBase64: string;
      if (body.imageBase64) {
        illustrationBase64 = body.imageBase64;
      } else {
        const illustrationPath = path.join(ASSETS_DIR, illustrationFile);
        if (!fs.existsSync(illustrationPath)) {
          sendJson(res, { error: `Illustration not found: ${illustrationFile}` }, 400);
          return;
        }
        illustrationBase64 = fs.readFileSync(illustrationPath).toString("base64");
      }

      const selectedLayouts = layouts.filter((l) => channels.includes(l.channel));
      const banners = selectedLayouts.map((layout) => ({
        slug: layout.slug,
        width: layout.width,
        height: layout.height,
        svgContent: generateSVG(layout, headline, cta, illustrationBase64, theme),
      }));

      const pageName = `${headline.slice(0, 40)}${headline.length > 40 ? "..." : ""} — ${themeName}`;
      sendJson(res, { pageName, banners });
    } catch (err) {
      sendJson(res, { error: String(err) }, 500);
    }
    return;
  }

  // ── Legacy: Serve pre-generated files from output/{DIR}/ ──
  if (DIR) {
    const servePath = path.join(OUTPUT_DIR, DIR);
    const filePath = path.join(servePath, url.pathname === "/" ? "index.html" : url.pathname.slice(1));

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      setCors(res);
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".html": "text/html",
      };
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // 404
  setCors(res);
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`\n🚀 Figma banner server running at http://localhost:${PORT}`);
  if (DIR) {
    console.log(`📁 Serving files from: output/${DIR}/`);
  }
  console.log(`🎨 Generation API ready (POST /api/generate)`);
  console.log(`📝 KG copy suggestions (POST /api/copy)`);
  console.log(`🖼️  Gemini image gen (POST /api/generate-image)`);
  console.log(`🎨 ${Object.keys(themes).length} themes: ${Object.keys(themes).join(", ")}`);
  console.log(`\nOpen Figma → Plugins → Development → Domo Banner Importer\n`);
});
