"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { bannerSizes } from "@/lib/banner-sizes";
import { layoutMap } from "@/layouts";
import { themes, defaultTheme } from "@/themes";

/**
 * Render Route — Renders a single banner at exact pixel dimensions.
 *
 * URL pattern: /render/gdn-300x250?headline=...&cta=...&theme=...
 *
 * Now accepts query params so Playwright can render any combination:
 * - headline: Custom headline text
 * - cta: Custom CTA text
 * - theme: Theme name (must match a theme in the registry)
 */
export default function RenderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const searchParams = useSearchParams();

  const size = bannerSizes.find((s) => s.slug === slug);
  const Layout = layoutMap[slug];

  if (!size || !Layout) {
    return <div>Unknown banner size: {slug}</div>;
  }

  const themeName = searchParams.get("theme");
  const theme = themes.find((t) => t.name === themeName) || defaultTheme;
  const headline =
    searchParams.get("headline") ||
    "Maximize your finance data to fuel your business strategy";
  const cta = searchParams.get("cta") || "LEARN MORE";

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Layout theme={theme} headline={headline} cta={cta} />
    </div>
  );
}
