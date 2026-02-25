import { Theme } from "@/themes";

/**
 * Illustration — The background artwork (hand holding phone with data).
 *
 * Props:
 * - width/height: dimensions of the illustration container
 * - offsetX/offsetY: position offset (illustrations are often cropped)
 * - scale: size multiplier (>1 = bigger than container, creating a crop effect)
 * - theme: provides the image source
 *
 * The illustration is the same image across all banner sizes —
 * only the crop/scale/position changes per layout.
 */
interface IllustrationProps {
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
  theme: Theme;
}

export default function Illustration({
  width,
  height,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  theme,
}: IllustrationProps) {
  return (
    <div
      style={{
        width,
        height,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={theme.illustrationSrc}
        alt="Domo data illustration"
        style={{
          position: "absolute",
          left: offsetX,
          top: offsetY,
          width: width * scale,
          height: height * scale,
          objectFit: "contain",
        }}
      />
    </div>
  );
}
