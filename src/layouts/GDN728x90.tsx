import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * GDN 728x90 — Leaderboard. Wide horizontal banner at top of pages.
 *
 * Layout (matches Figma node 1:156):
 * ┌──────────────────────────────────────────────┐
 * │ [LOGO]  Maximize your finance data    [CTA]  │
 * │         to fuel your business strategy [ILLU] │
 * └──────────────────────────────────────────────┘
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function GDN728x90({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={728} height={90} theme={theme}>
      {/* Illustration — far right */}
      <div style={{ position: "absolute", right: -22, top: -14 }}>
        <Illustration
          width={111}
          height={136}
          theme={theme}
          scale={1}
        />
      </div>

      {/* Logo — left */}
      <div style={{ position: "absolute", left: 18, top: 18 }}>
        <DomoLogo size={54} theme={theme} />
      </div>

      {/* Headline — center */}
      <div style={{ position: "absolute", left: 116, top: 18, width: 340 }}>
        <Headline text={headline} fontSize={16} lineHeight={1.3} theme={theme} />
      </div>

      {/* CTA — right of headline */}
      <div style={{ position: "absolute", left: 464, top: 39 }}>
        <CTAButton label={cta} fontSize={10} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
