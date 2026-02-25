/**
 * Layout Registry
 *
 * Maps banner size slugs to their React components.
 * This is the single source of truth — the dashboard, render pipeline,
 * and Figma push all use this registry to know what layouts exist.
 */
export { default as LinkedIn1200x627 } from "./LinkedIn1200x627";
export { default as GDN200x200 } from "./GDN200x200";
export { default as GDN250x250 } from "./GDN250x250";
export { default as GDN300x250 } from "./GDN300x250";
export { default as GDN336x280 } from "./GDN336x280";
export { default as GDN468x60 } from "./GDN468x60";
export { default as GDN728x90 } from "./GDN728x90";
export { default as GDN320x50 } from "./GDN320x50";
export { default as GDN320x100 } from "./GDN320x100";
export { default as GDN120x600 } from "./GDN120x600";
export { default as GDN160x600 } from "./GDN160x600";
export { default as GDN300x600 } from "./GDN300x600";

import { Theme } from "@/themes";
import { bannerSizes } from "@/lib/banner-sizes";

import LinkedIn1200x627 from "./LinkedIn1200x627";
import GDN200x200 from "./GDN200x200";
import GDN250x250 from "./GDN250x250";
import GDN300x250 from "./GDN300x250";
import GDN336x280 from "./GDN336x280";
import GDN468x60 from "./GDN468x60";
import GDN728x90 from "./GDN728x90";
import GDN320x50 from "./GDN320x50";
import GDN320x100 from "./GDN320x100";
import GDN120x600 from "./GDN120x600";
import GDN160x600 from "./GDN160x600";
import GDN300x600 from "./GDN300x600";

interface LayoutProps {
  theme: Theme;
  headline: string;
  cta: string;
}

type LayoutComponent = React.ComponentType<LayoutProps>;

/**
 * Maps each banner size slug → its layout component.
 * Used by the dashboard and render pipeline.
 */
export const layoutMap: Record<string, LayoutComponent> = {
  "linkedin-1200x627": LinkedIn1200x627,
  "gdn-200x200": GDN200x200,
  "gdn-250x250": GDN250x250,
  "gdn-300x250": GDN300x250,
  "gdn-336x280": GDN336x280,
  "gdn-468x60": GDN468x60,
  "gdn-728x90": GDN728x90,
  "gdn-320x50": GDN320x50,
  "gdn-320x100": GDN320x100,
  "gdn-120x600": GDN120x600,
  "gdn-160x600": GDN160x600,
  "gdn-300x600": GDN300x600,
};
