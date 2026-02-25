import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * GDN 120x600 — Skyscraper. Narrowest vertical ad.
 *
 * Layout (matches Figma node 1:60):
 * ┌────────┐
 * │ [LOGO] │
 * │        │
 * │ Head   │
 * │ line   │
 * │ text   │
 * │        │
 * │ [CTA]  │
 * │        │
 * │[ILLUS] │
 * │        │
 * └────────┘
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function GDN120x600({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={120} height={600} theme={theme}>
      {/* Illustration — bottom, overflowing left */}
      <div style={{ position: "absolute", left: -46, top: 255 }}>
        <Illustration width={304} height={372} theme={theme} scale={1} />
      </div>

      {/* Logo */}
      <div style={{ position: "absolute", left: 12, top: 12 }}>
        <DomoLogo size={42} theme={theme} />
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 11, top: 77, width: 107 }}>
        <Headline text={headline} fontSize={11} lineHeight={1.3} theme={theme} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 12, top: 189 }}>
        <CTAButton label={cta} fontSize={9} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
