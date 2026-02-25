import { BannerCanvas, DomoLogo, Headline, CTAButton, Illustration } from "@/components";
import { Theme } from "@/themes";

/**
 * GDN 200x200 — Small Square.
 *
 * Layout (matches Figma node 1:105):
 * ┌────────────────┐
 * │ [LOGO] [ILLUS] │
 * │ Headline       │
 * │ text here      │
 * │ [CTA]          │
 * └────────────────┘
 */
interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

export default function GDN200x200({ theme, headline, cta }: LayoutProps) {
  return (
    <BannerCanvas width={200} height={200} theme={theme}>
      {/* Illustration */}
      <div style={{ position: "absolute", right: -7, top: 98 }}>
        <Illustration width={95} height={116} theme={theme} scale={1} />
      </div>

      {/* Logo */}
      <div style={{ position: "absolute", left: 16, top: 10 }}>
        <DomoLogo size={32} theme={theme} />
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 15, top: 50, width: 173 }}>
        <Headline text={headline} fontSize={12} lineHeight={1.3} theme={theme} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 16, top: 139 }}>
        <CTAButton label={cta} fontSize={8} theme={theme} />
      </div>
    </BannerCanvas>
  );
}
