import figma from "@figma/code-connect";

/**
 * Code Connect: CTAButton
 *
 * Maps the "watch video" frame (which contains "LEARN MORE" text)
 * to our CTAButton component.
 */
figma.connect(
  "https://www.figma.com/design/m7GfJt0ueRrK1Q0s2G6Neo/test1?node-id=1:31",
  {
    example: () => (
      <CTAButton label="LEARN MORE" fontSize={10} theme={theme} />
    ),
    imports: ['import { CTAButton } from "@/components"'],
  }
);
