import { Theme } from "@/themes";

/**
 * CTAButton — The "LEARN MORE" call-to-action button.
 *
 * Props:
 * - label: button text (default "LEARN MORE")
 * - fontSize: text size in pixels
 * - paddingX/paddingY: inner spacing
 * - theme: provides colors and border radius
 *
 * In the Figma file this is named "watch video" but displays "LEARN MORE".
 * We use the label prop so it can say anything.
 */
interface CTAButtonProps {
  label?: string;
  fontSize: number;
  paddingX?: number;
  paddingY?: number;
  theme: Theme;
}

export default function CTAButton({
  label = "LEARN MORE",
  fontSize,
  paddingX,
  paddingY,
  theme,
}: CTAButtonProps) {
  const px = paddingX ?? fontSize * 1.3;
  const py = paddingY ?? fontSize * 0.6;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.ctaBgColor,
        color: theme.ctaTextColor,
        fontSize: fontSize,
        fontWeight: 600,
        fontFamily: "'Open Sans', sans-serif",
        textTransform: "uppercase",
        paddingLeft: px,
        paddingRight: px,
        paddingTop: py,
        paddingBottom: py,
        borderRadius: theme.ctaBorderRadius,
        letterSpacing: fontSize * 0.05,
      }}
    >
      {label}
    </div>
  );
}
