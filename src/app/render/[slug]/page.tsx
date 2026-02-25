"use client";

import { use } from "react";
import { bannerSizes } from "@/lib/banner-sizes";
import { layoutMap } from "@/layouts";
import { defaultTheme } from "@/themes";

/**
 * Render Route — Renders a single banner at exact pixel dimensions.
 *
 * URL pattern: /render/gdn-300x250
 *
 * This page is what Playwright visits to screenshot each banner.
 * It renders the banner with NO padding, NO chrome — just the banner
 * at its exact pixel size. Playwright then screenshots the viewport
 * at that exact size to get a pixel-perfect PNG.
 *
 * The [slug] in the folder name is a Next.js dynamic route parameter.
 * Visiting /render/gdn-300x250 sets params.slug = "gdn-300x250".
 */
export default function RenderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const size = bannerSizes.find((s) => s.slug === slug);
  const Layout = layoutMap[slug];

  if (!size || !Layout) {
    return <div>Unknown banner size: {slug}</div>;
  }

  // TODO: These will come from URL search params once KG is integrated
  const theme = defaultTheme;
  const headline = "Maximize your finance data to fuel your business strategy";
  const cta = "LEARN MORE";

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Layout theme={theme} headline={headline} cta={cta} />
    </div>
  );
}
