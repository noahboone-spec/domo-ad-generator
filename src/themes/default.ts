import { Theme } from "./types";

/**
 * Default Dark Theme — matches the current Figma design exactly.
 *
 * Colors pulled directly from the Figma file:
 * - Background: near-black (#111111)
 * - Headline: Domo Blue (#99CCEE)
 * - CTA: Domo Orange (#FFB656)
 * - Logo: Domo Blue bg with white text
 */
export const defaultTheme: Theme = {
  name: "Default Dark",

  bgColor: "#111111",

  headlineColor: "#99CCEE",
  headlineFontWeight: 800,

  ctaBgColor: "#FFB656",
  ctaTextColor: "#111111",
  ctaBorderRadius: 3,

  logoBgColor: "#99CCEE",
  logoTextColor: "#FFFFFF",

  illustrationSrc: "/assets/illustration.png",
};
