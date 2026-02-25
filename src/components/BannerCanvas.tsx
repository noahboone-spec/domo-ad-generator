import { Theme } from "@/themes";

/**
 * BannerCanvas — The container that wraps every banner.
 *
 * Props:
 * - width/height: exact pixel dimensions (matches Figma artboard sizes)
 * - theme: provides background color
 * - children: the logo, headline, CTA, illustration composed inside
 *
 * This is like the "Frame" in Figma — it sets the size, background,
 * and clips everything to the banner boundaries.
 *
 * Why inline styles instead of Tailwind? Banner sizes are pixel-exact
 * (e.g. 468x60) and need to render at those exact dimensions for
 * the Playwright screenshot pipeline. Tailwind is great for responsive
 * layouts, but here we need absolute pixel control.
 */
interface BannerCanvasProps {
  width: number;
  height: number;
  theme: Theme;
  children: React.ReactNode;
}

export default function BannerCanvas({
  width,
  height,
  theme,
  children,
}: BannerCanvasProps) {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: theme.bgColor,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {children}
    </div>
  );
}
