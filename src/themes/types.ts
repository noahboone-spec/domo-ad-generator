/**
 * Theme Interface
 *
 * This defines the "shape" of a theme. Every theme must provide these values.
 * Think of it like a contract: if you create a new theme, TypeScript will
 * tell you if you forgot to define any required color or style.
 */
export interface Theme {
  name: string;

  // Background
  bgColor: string;

  // Text
  headlineColor: string;
  headlineFontWeight: number;

  // CTA Button
  ctaBgColor: string;
  ctaTextColor: string;
  ctaBorderRadius: number;

  // Logo
  logoBgColor: string;
  logoTextColor: string;

  // Illustration
  illustrationSrc: string;
}
