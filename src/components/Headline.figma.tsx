import figma from "@figma/code-connect";

/**
 * Code Connect: Headline
 *
 * Maps the headline text group (node "Group 1778") to our
 * Headline component. The props show designers what's configurable.
 */
figma.connect(
  "https://www.figma.com/design/m7GfJt0ueRrK1Q0s2G6Neo/test1?node-id=5:216",
  {
    example: () => (
      <Headline
        text="Maximize your finance data to fuel your business strategy"
        fontSize={64}
        theme={theme}
      />
    ),
    imports: ['import { Headline } from "@/components"'],
  }
);
