import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * GDN 300x250 — Medium Rectangle. The most common display ad size.
 *
 * Layout (matches Figma node 1:33):
 * ┌─────────────────────┐
 * │ [LOGO]     [ILLUST] │
 * │                     │
 * │ Maximize your       │
 * │ finance data to     │
 * │ fuel your business  │
 * │ strategy            │
 * │                     │
 * │ [LEARN MORE]        │
 * └─────────────────────┘
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function GDN300x250({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={300} height={250} theme={theme}>
      {/* Illustration — right side */}
      <div style={{ position: "absolute", right: -26, top: 108 }}>
        <Illustration
          width={131}
          height={161}
          theme={theme}
          scale={1}
        />
      </div>

      {/* Logo — top left */}
      <div style={{ position: "absolute", left: 21, top: 12 }}>
        <DomoLogo size={42} theme={theme} />
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 20, top: 68, width: 232 }}>
        <Headline text={headline} fontSize={18} lineHeight={1.3} theme={theme} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 21, top: 185 }}>
        <CTAButton label={cta} fontSize={10} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
