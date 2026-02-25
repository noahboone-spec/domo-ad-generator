/**
 * Generate SVG Banners — Creates structured SVGs for Figma import.
 *
 * Each SVG has separate, named layers:
 *   - Background (rectangle)
 *   - Logo (Domo logo SVG path)
 *   - Headline (text with line wrapping)
 *   - CTA Button (rectangle + text)
 *   - Illustration (embedded PNG image)
 *
 * When imported into Figma, each group becomes an editable layer.
 *
 * Usage:
 *   npx tsx scripts/generate-svg-banners.ts
 *   npx tsx scripts/generate-svg-banners.ts --headline "Custom headline" --cta "GET STARTED"
 *   npx tsx scripts/generate-svg-banners.ts --headline "Connect your data" --prefix di
 */
import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, "output");

// ──────────────────────────────────────────────
// Theme (matching default dark theme)
// ──────────────────────────────────────────────
const theme = {
  bgColor: "#111111",
  headlineColor: "#99CCEE",
  headlineFontWeight: 800,
  ctaBgColor: "#FFB656",
  ctaTextColor: "#111111",
  ctaBorderRadius: 3,
  logoBgColor: "#99CCEE",
};

// ──────────────────────────────────────────────
// Logo SVG path data (from domo-logo.svg)
// ──────────────────────────────────────────────
const LOGO_PATH =
  "M0 36.6144H8.45928C10.2852 36.6144 12.0089 36.9683 13.6285 37.675C15.2491 38.3826 16.6696 39.3472 17.8913 40.5687C19.113 41.7907 20.0767 43.2114 20.7852 44.8307C21.2183 45.824 21.5176 46.8555 21.6852 47.9262C22.0943 45.1244 23.3557 42.6646 25.4715 40.5494C28.043 37.9255 31.1928 36.6144 34.9222 36.6144C38.6259 36.6144 41.7757 37.9255 44.3739 40.5494C46.2889 42.4464 47.508 44.6196 48.0385 47.0681V36.6144L61.4237 49.9999L74.8489 36.6144V47.0538C75.3759 44.6114 76.5828 42.4418 78.4752 40.5494C81.0472 37.9255 84.198 36.6144 87.9274 36.6144C91.6309 36.6144 94.7796 37.9255 97.3778 40.5492C98.4837 41.6435 99.355 42.8331 100 44.1118V0H0V36.6144ZM87.9274 63.3856C84.2237 63.3856 81.073 62.0748 78.475 59.4506C76.5826 57.5769 75.3757 55.4128 74.8487 52.9619V63.3854H70.3341V47.3764L61.4237 56.3258L52.4754 47.3764V63.3856H48.0385V52.963C47.5078 55.4275 46.2889 57.5915 44.3739 59.4506C41.7757 62.0745 38.6259 63.3856 34.9222 63.3856C31.2198 63.3856 28.0689 62.0748 25.4717 59.4506C23.3537 57.3547 22.0924 54.8969 21.6841 52.0803C21.5159 53.1484 21.2172 54.1782 20.7852 55.1691C20.0767 56.7893 19.1193 58.2108 17.9109 59.4317C16.7022 60.6532 15.2813 61.6176 13.648 62.3243C12.0148 63.033 10.2855 63.3856 8.45939 63.3856H0V100H100V55.9249C99.355 57.201 98.4835 58.3776 97.3778 59.4508C94.7798 62.0748 91.6309 63.3856 87.9274 63.3856ZM14.7661 56.2838C15.577 55.4601 16.2135 54.5095 16.6759 53.4288C17.1396 52.3482 17.3707 51.2047 17.3707 49.9951C17.3707 48.7873 17.1396 47.6421 16.6759 46.5625C16.2135 45.4818 15.5704 44.5309 14.7478 43.7072C13.9239 42.8844 12.9724 42.2416 11.8926 41.779C10.8129 41.3155 9.66767 41.0842 8.45898 41.0842H3.98437V58.9067H8.45898C9.69348 58.9067 10.8516 58.6754 11.9313 58.2119C13.0111 57.7495 13.9563 57.1065 14.7661 56.2838ZM94.215 56.3295C95.9637 54.5551 96.8387 52.4473 96.8387 50.0032C96.8387 47.5607 95.9637 45.4649 94.215 43.7153C92.4665 41.9666 90.3713 41.0922 87.9285 41.0922C85.485 41.0922 83.3754 41.9666 81.6011 43.7153C79.878 45.4646 79.0176 47.5607 79.0176 50.0032C79.0176 52.4473 79.878 54.5551 81.6011 56.3295C83.3754 58.0534 85.485 58.915 87.9285 58.915C90.3715 58.9147 92.4665 58.0534 94.215 56.3295ZM41.2111 56.3295C42.9596 54.5551 43.8339 52.4473 43.8339 50.0032C43.8339 47.5607 42.9596 45.4649 41.2111 43.7153C39.4615 41.9666 37.3657 41.0922 34.9222 41.0922C32.4789 41.0922 30.3702 41.9666 28.5959 43.7153C26.8728 45.4646 26.0115 47.5607 26.0115 50.0032C26.0115 52.4473 26.8728 54.5551 28.5959 56.3295C30.3702 58.0534 32.4789 58.915 34.9222 58.915C37.3657 58.9147 39.4615 58.0534 41.2111 56.3295Z";

// ──────────────────────────────────────────────
// Layout definitions (from React layout components)
// ──────────────────────────────────────────────
interface LayoutDef {
  slug: string;
  width: number;
  height: number;
  logo: { x: number; y: number; size: number };
  headline: { x: number; y: number; width: number; fontSize: number };
  cta?: { x: number; y: number; fontSize: number };
  illustration: { x: number; y: number; width: number; height: number };
  illustrationAnchor?: "right" | "left"; // right = x is right offset
}

const layouts: LayoutDef[] = [
  {
    slug: "linkedin-1200x627",
    width: 1200,
    height: 627,
    logo: { x: 80, y: 40, size: 80 },
    headline: { x: 80, y: 180, width: 600, fontSize: 64 },
    illustration: { x: -30, y: -47, width: 618, height: 757 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-300x250",
    width: 300,
    height: 250,
    logo: { x: 21, y: 12, size: 42 },
    headline: { x: 20, y: 68, width: 232, fontSize: 18 },
    cta: { x: 21, y: 185, fontSize: 10 },
    illustration: { x: -26, y: 108, width: 131, height: 161 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-728x90",
    width: 728,
    height: 90,
    logo: { x: 18, y: 18, size: 54 },
    headline: { x: 116, y: 18, width: 340, fontSize: 16 },
    cta: { x: 464, y: 39, fontSize: 10 },
    illustration: { x: -22, y: -14, width: 111, height: 136 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-160x600",
    width: 160,
    height: 600,
    logo: { x: 15, y: 15, size: 42 },
    headline: { x: 17, y: 94, width: 130, fontSize: 14 },
    cta: { x: 18, y: 231, fontSize: 9 },
    illustration: { x: -21, y: 300, width: 250, height: 306 },
    illustrationAnchor: "left",
  },
  {
    slug: "gdn-320x50",
    width: 320,
    height: 50,
    logo: { x: 10, y: 10, size: 30 },
    headline: { x: 57, y: 12, width: 166, fontSize: 8 },
    cta: { x: 226, y: 19, fontSize: 6 },
    illustration: { x: -27, y: -13, width: 60, height: 73 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-120x600",
    width: 120,
    height: 600,
    logo: { x: 12, y: 12, size: 42 },
    headline: { x: 11, y: 77, width: 107, fontSize: 11 },
    cta: { x: 12, y: 189, fontSize: 9 },
    illustration: { x: -46, y: 255, width: 304, height: 372 },
    illustrationAnchor: "left",
  },
  {
    slug: "gdn-468x60",
    width: 468,
    height: 60,
    logo: { x: 12, y: 12, size: 36 },
    headline: { x: 77, y: 12, width: 222, fontSize: 11 },
    cta: { x: 311, y: 26, fontSize: 7 },
    illustration: { x: -6, y: -9, width: 74, height: 91 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-300x600",
    width: 300,
    height: 600,
    logo: { x: 24, y: 16, size: 65 },
    headline: { x: 22, y: 108, width: 224, fontSize: 24 },
    cta: { x: 22, y: 309, fontSize: 12 },
    illustration: { x: 78, y: 325, width: 250, height: 306 },
    illustrationAnchor: "left",
  },
  {
    slug: "gdn-336x280",
    width: 336,
    height: 280,
    logo: { x: 24, y: 12, size: 48 },
    headline: { x: 23, y: 76, width: 259, fontSize: 19 },
    cta: { x: 24, y: 206, fontSize: 10 },
    illustration: { x: -30, y: 121, width: 147, height: 180 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-250x250",
    width: 250,
    height: 250,
    logo: { x: 20, y: 12, size: 38 },
    headline: { x: 19, y: 63, width: 216, fontSize: 15 },
    cta: { x: 20, y: 174, fontSize: 9 },
    illustration: { x: -9, y: 122, width: 118, height: 145 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-200x200",
    width: 200,
    height: 200,
    logo: { x: 16, y: 10, size: 32 },
    headline: { x: 15, y: 50, width: 173, fontSize: 12 },
    cta: { x: 16, y: 139, fontSize: 8 },
    illustration: { x: -7, y: 98, width: 95, height: 116 },
    illustrationAnchor: "right",
  },
  {
    slug: "gdn-320x100",
    width: 320,
    height: 100,
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
function wrapText(
  text: string,
  maxWidth: number,
  fontSize: number
): string[] {
  // Approximate char width for Open Sans ExtraBold
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

// ──────────────────────────────────────────────
// SVG generation
// ──────────────────────────────────────────────
function generateSVG(
  layout: LayoutDef,
  headline: string,
  cta: string,
  illustrationBase64: string
): string {
  const { width, height, logo, illustration } = layout;
  const hl = layout.headline;
  const lineHeight = hl.fontSize * 1.3;

  // Wrap headline text
  const lines = wrapText(headline, hl.width, hl.fontSize);

  // Calculate illustration position
  let illustrationX: number;
  if (layout.illustrationAnchor === "right") {
    illustrationX = width + illustration.x - illustration.width;
  } else {
    illustrationX = illustration.x;
  }
  const illustrationY = illustration.y;

  // CTA button dimensions
  const ctaPadH = layout.cta ? layout.cta.fontSize * 1.8 : 0;
  const ctaPadV = layout.cta ? layout.cta.fontSize * 0.7 : 0;
  const ctaTextWidth = layout.cta ? cta.length * layout.cta.fontSize * 0.62 : 0;
  const ctaW = ctaTextWidth + ctaPadH * 2;
  const ctaH = layout.cta ? layout.cta.fontSize + ctaPadV * 2 : 0;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <clipPath id="banner-clip">
      <rect width="${width}" height="${height}" />
    </clipPath>
  </defs>

  <!-- Background -->
  <g id="Background">
    <rect width="${width}" height="${height}" fill="${theme.bgColor}" />
  </g>

  <g clip-path="url(#banner-clip)">

  <!-- Illustration -->
  <g id="Illustration">
    <image
      x="${illustrationX}"
      y="${illustrationY}"
      width="${illustration.width}"
      height="${illustration.height}"
      href="data:image/png;base64,${illustrationBase64}"
      preserveAspectRatio="xMidYMid slice"
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

  // Add text lines
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

  // CTA button (optional — LinkedIn doesn't have one)
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

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ──────────────────────────────────────────────
// CLI
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

function main() {
  const opts = parseArgs();
  const headline =
    opts.headline ||
    "Connect all your data sources in minutes, not months";
  const cta = opts.cta || "START FREE";
  const prefix = opts.prefix || "svg-banners";

  // Read and base64 encode illustration
  const illustrationPath = path.join(
    PROJECT_ROOT,
    "public/assets/illustration.png"
  );
  if (!fs.existsSync(illustrationPath)) {
    console.error(`Illustration not found: ${illustrationPath}`);
    process.exit(1);
  }
  const illustrationBase64 = fs.readFileSync(illustrationPath).toString("base64");

  // Create output directory
  const outputDir = path.join(OUTPUT_DIR, prefix);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Generating ${layouts.length} SVG banners`);
  console.log(`Headline: "${headline}"`);
  console.log(`CTA: "${cta}"`);
  console.log(`Output: output/${prefix}/\n`);

  for (const layout of layouts) {
    const svg = generateSVG(layout, headline, cta, illustrationBase64);
    const outputPath = path.join(outputDir, `${layout.slug}.svg`);
    fs.writeFileSync(outputPath, svg);
    console.log(`  ✓ ${layout.slug}.svg (${layout.width}x${layout.height})`);
  }

  console.log(`\nDone! ${layouts.length} SVGs written to output/${prefix}/`);
  console.log("Drag these into Figma — each element is a separate editable layer.");
}

main();
