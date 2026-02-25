import figma from "@figma/code-connect";

/**
 * Code Connect: DomoLogo
 *
 * This file tells Figma: "When someone selects the logo vector
 * in Figma Dev Mode, show them this React code snippet."
 *
 * The figmaNodeUrl points to the specific node in your Figma file.
 * The example() function returns the code that gets displayed.
 */
figma.connect(
  "https://www.figma.com/design/m7GfJt0ueRrK1Q0s2G6Neo/test1?node-id=1:4",
  {
    example: () => (
      <DomoLogo size={100} theme={theme} />
    ),
    imports: ['import { DomoLogo } from "@/components"'],
  }
);
