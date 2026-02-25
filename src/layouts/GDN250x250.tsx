import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * GDN 250x250 — Square. Common sidebar ad.
 *
 * Layout (matches Figma node 1:24):
 * ┌───────────────────┐
 * │ [LOGO]   [ILLUST] │
 * │                   │
 * │ Maximize your     │
 * │ finance data      │
 * │ to fuel your      │
 * │ business strategy │
 * │                   │
 * │ [LEARN MORE]      │
 * └───────────────────┘
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function GDN250x250({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={250} height={250} theme={theme}>
      {/* Illustration — right side */}
      <div style={{ position: "absolute", right: -9, top: 122 }}>
        <Illustration width={118} height={145} theme={theme} scale={1} />
      </div>

      {/* Logo */}
      <div style={{ position: "absolute", left: 20, top: 12 }}>
        <DomoLogo size={38} theme={theme} />
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 19, top: 63, width: 216 }}>
        <Headline text={headline} fontSize={15} lineHeight={1.3} theme={theme} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 20, top: 174 }}>
        <CTAButton label={cta} fontSize={9} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
