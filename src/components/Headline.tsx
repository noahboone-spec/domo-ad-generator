import { Theme } from "@/themes";

/**
 * Headline — The main text block in every banner.
 *
 * Props:
 * - text: the headline copy (will come from KG later)
 * - fontSize: pixel size for the text
 * - lineHeight: multiplier (e.g. 1.3 = 130% of fontSize)
 * - theme: provides colors and font weight
 *
 * Why a separate component? Because this text appears in EVERY banner
 * and we want to change the copy from one place (KG integration later).
 */
interface HeadlineProps {
  text: string;
  fontSize: number;
  lineHeight?: number;
  theme: Theme;
}

export default function Headline({
  text,
  fontSize,
  lineHeight = 1.3,
  theme,
}: HeadlineProps) {
  return (
    <p
      style={{
        color: theme.headlineColor,
        fontSize: fontSize,
        fontWeight: theme.headlineFontWeight,
        lineHeight: lineHeight,
        fontFamily: "'Open Sans', sans-serif",
        margin: 0,
      }}
    >
      {text}
    </p>
  );
}
