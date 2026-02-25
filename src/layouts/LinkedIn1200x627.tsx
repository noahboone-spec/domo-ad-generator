import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * LinkedIn 1200x627 — The largest banner. Hero-style layout.
 *
 * Layout (matches Figma node 1:3):
 * ┌──────────────────────────────────┐
 * │ [LOGO]                           │
 * │                                  │
 * │ Maximize your          [ILLUST]  │
 * │ finance data to                  │
 * │ fuel your business               │
 * │ strategy                         │
 * │                                  │
 * └──────────────────────────────────┘
 *
 * The illustration sits on the right, the headline on the left.
 * No CTA button on the LinkedIn version (it's organic social).
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function LinkedIn1200x627({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={1200} height={627} theme={theme}>
      {/* Illustration — right side, slightly overflowing */}
      <div style={{ position: "absolute", right: -30, top: -47 }}>
        <Illustration
          width={618}
          height={757}
          theme={theme}
          scale={1}
        />
      </div>

      {/* Logo — top left */}
      <div style={{ position: "absolute", left: 80, top: 40 }}>
        <DomoLogo size={80} theme={theme} />
      </div>

      {/* Headline — left side, vertically centered */}
      <div style={{ position: "absolute", left: 80, top: 180, width: 600 }}>
        <Headline text={headline} fontSize={64} lineHeight={1.3} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
