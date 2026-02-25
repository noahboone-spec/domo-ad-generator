import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * GDN 300x600 — Half Page. Large vertical format.
 *
 * Layout (matches Figma node 1:87):
 * ┌─────────────────────┐
 * │ [LOGO]              │
 * │                     │
 * │ Maximize your       │
 * │ finance data to     │
 * │ fuel your           │
 * │ business strategy   │
 * │                     │
 * │ [LEARN MORE]        │
 * │                     │
 * │       [ILLUST]      │
 * │                     │
 * └─────────────────────┘
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function GDN300x600({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={300} height={600} theme={theme}>
      {/* Illustration — bottom */}
      <div style={{ position: "absolute", left: 78, top: 325 }}>
        <Illustration width={250} height={306} theme={theme} scale={1} />
      </div>

      {/* Logo */}
      <div style={{ position: "absolute", left: 24, top: 16 }}>
        <DomoLogo size={65} theme={theme} />
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 22, top: 108, width: 224 }}>
        <Headline text={headline} fontSize={24} lineHeight={1.3} theme={theme} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 22, top: 309 }}>
        <CTAButton label={cta} fontSize={12} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
