export type { Theme } from "./types";
export { defaultTheme } from "./default";
export { lightTheme } from "./light";

import { Theme } from "./types";
import { defaultTheme } from "./default";
import { lightTheme } from "./light";

/**
 * Theme Registry
 *
 * All available themes in one place. When you add a new theme file,
 * just import it here and add it to this array.
 */
export const themes: Theme[] = [defaultTheme, lightTheme];
