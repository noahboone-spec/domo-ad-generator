import figma from "@figma/code-connect";

/**
 * Code Connect: Full Banner Layout
 *
 * Maps the LinkedIn 1200x627 frame to the full banner composition.
 * This shows designers the complete component tree for a banner.
 */
figma.connect(
  "https://www.figma.com/design/m7GfJt0ueRrK1Q0s2G6Neo/test1?node-id=1:3",
  {
    example: () => (
      <LinkedIn1200x627
        theme={defaultTheme}
        headline="Maximize your finance data to fuel your business strategy"
        cta="LEARN MORE"
      />
    ),
    imports: [
      'import { LinkedIn1200x627 } from "@/layouts"',
      'import { defaultTheme } from "@/themes"',
    ],
  }
);
