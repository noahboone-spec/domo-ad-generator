import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * GDN 320x100 — Large Mobile Banner.
 *
 * Layout (matches Figma node 1:147):
 * ┌────────────────────────────┐
 * │ [LOGO]            [ILLUST] │
 * │ Headline text              │
 * │ [CTA]                      │
 * └────────────────────────────┘
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function GDN320x100({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={320} height={100} theme={theme}>
      {/* Illustration — right side */}
      <div style={{ position: "absolute", right: -9, top: -10 }}>
        <Illustration width={101} height={124} theme={theme} scale={1} />
      </div>

      {/* Logo */}
      <div style={{ position: "absolute", left: 20, top: 10 }}>
        <DomoLogo size={28} theme={theme} />
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 19, top: 40, width: 190 }}>
        <Headline text={headline} fontSize={9} lineHeight={1.3} theme={theme} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 20, top: 76 }}>
        <CTAButton label={cta} fontSize={6} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
