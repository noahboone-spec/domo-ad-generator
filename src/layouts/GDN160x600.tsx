import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * GDN 160x600 — Wide Skyscraper. Tall and narrow sidebar ad.
 *
 * Layout (matches Figma node 1:69):
 * ┌──────────┐
 * │ [LOGO]   │
 * │          │
 * │ Maximize │
 * │ your     │
 * │ finance  │
 * │ data to  │
 * │ fuel     │
 * │ your     │
 * │ business │
 * │ strategy │
 * │          │
 * │ [CTA]    │
 * │          │
 * │          │
 * │ [ILLUST] │
 * │          │
 * └──────────┘
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function GDN160x600({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={160} height={600} theme={theme}>
      {/* Illustration — bottom area */}
      <div style={{ position: "absolute", left: -21, top: 300 }}>
        <Illustration
          width={250}
          height={306}
          theme={theme}
          scale={1}
        />
      </div>

      {/* Logo — top left */}
      <div style={{ position: "absolute", left: 15, top: 15 }}>
        <DomoLogo size={42} theme={theme} />
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 17, top: 94, width: 130 }}>
        <Headline text={headline} fontSize={14} lineHeight={1.3} theme={theme} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 18, top: 231 }}>
        <CTAButton label={cta} fontSize={9} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
