import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * GDN 468x60 — Banner. Classic horizontal strip.
 *
 * Layout (matches Figma node 1:114):
 * ┌──────────────────────────────────┐
 * │ [LOGO] Headline text   [CTA] [I]│
 * └──────────────────────────────────┘
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function GDN468x60({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={468} height={60} theme={theme}>
      {/* Illustration — far right, tightly cropped */}
      <div style={{ position: "absolute", right: -6, top: -9 }}>
        <Illustration width={74} height={91} theme={theme} scale={1} />
      </div>

      {/* Logo */}
      <div style={{ position: "absolute", left: 12, top: 12 }}>
        <DomoLogo size={36} theme={theme} />
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 77, top: 12, width: 222 }}>
        <Headline text={headline} fontSize={11} lineHeight={1.3} theme={theme} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 311, top: 26 }}>
        <CTAButton label={cta} fontSize={7} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
