import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * GDN 336x280 — Large Rectangle.
 *
 * Layout (matches Figma node 1:51):
 * ┌───────────────────────┐
 * │ [LOGO]       [ILLUST] │
 * │                       │
 * │ Maximize your         │
 * │ finance data to       │
 * │ fuel your business    │
 * │ strategy              │
 * │                       │
 * │ [LEARN MORE]          │
 * └───────────────────────┘
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function GDN336x280({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={336} height={280} theme={theme}>
      {/* Illustration */}
      <div style={{ position: "absolute", right: -30, top: 121 }}>
        <Illustration width={147} height={180} theme={theme} scale={1} />
      </div>

      {/* Logo */}
      <div style={{ position: "absolute", left: 24, top: 12 }}>
        <DomoLogo size={48} theme={theme} />
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 23, top: 76, width: 259 }}>
        <Headline text={headline} fontSize={19} lineHeight={1.3} theme={theme} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 24, top: 206 }}>
        <CTAButton label={cta} fontSize={10} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
