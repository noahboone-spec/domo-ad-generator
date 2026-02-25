import { Theme } from "@/themes";

/**
 * DomoLogo — The Domo logo mark.
 *
 * Props:
 * - size: pixel dimension (it's square)
 * - theme: provides colors
 *
 * This is a simple SVG recreation of the Domo logo box.
 * The "DOMO" text scales with the container.
 */
interface DomoLogoProps {
  size: number;
  theme: Theme;
}

export default function DomoLogo({ size, theme }: DomoLogoProps) {
  const fontSize = size * 0.28;
  const padding = size * 0.12;

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: theme.logoBgColor,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        padding: padding,
        borderRadius: 2,
      }}
    >
      <span
        style={{
          color: theme.logoTextColor,
          fontSize: fontSize,
          fontWeight: 800,
          letterSpacing: fontSize * 0.08,
          lineHeight: 1,
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        DOMO
      </span>
    </div>
  );
}
