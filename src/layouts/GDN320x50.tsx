import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * GDN 320x50 — Mobile Leaderboard. Small mobile banner.
 *
 * Layout (matches Figma node 1:123):
 * ┌────────────────────────────┐
 * │ [L] Headline text  [CTA]  │
 * └────────────────────────────┘
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function GDN320x50({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={320} height={50} theme={theme}>
      {/* Illustration — far right */}
      <div style={{ position: "absolute", right: -27, top: -13 }}>
        <Illustration width={60} height={73} theme={theme} scale={1} />
      </div>

      {/* Logo */}
      <div style={{ position: "absolute", left: 10, top: 10 }}>
        <DomoLogo size={30} theme={theme} />
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 57, top: 12, width: 166 }}>
        <Headline text={headline} fontSize={8} lineHeight={1.3} theme={theme} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 226, top: 19 }}>
        <CTAButton label={cta} fontSize={6} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
