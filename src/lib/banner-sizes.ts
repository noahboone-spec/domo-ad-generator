/**
 * Banner Size Definitions
 *
 * Every banner size we support, with metadata about the channel
 * and a slug for URL routing. This registry drives the dashboard
 * and the rendering pipeline — add a size here and it automatically
 * appears everywhere.
 */
export interface BannerSize {
  slug: string;
  label: string;
  width: number;
  height: number;
  channel: "linkedin" | "gdn" | "demandbase";
}

export const bannerSizes: BannerSize[] = [
  // LinkedIn
  { slug: "linkedin-1200x627", label: "LinkedIn Post", width: 1200, height: 627, channel: "linkedin" },

  // GDN (Google Display Network)
  { slug: "gdn-200x200", label: "GDN 200x200", width: 200, height: 200, channel: "gdn" },
  { slug: "gdn-250x250", label: "GDN 250x250", width: 250, height: 250, channel: "gdn" },
  { slug: "gdn-300x250", label: "GDN 300x250", width: 300, height: 250, channel: "gdn" },
  { slug: "gdn-336x280", label: "GDN 336x280", width: 336, height: 280, channel: "gdn" },
  { slug: "gdn-468x60", label: "GDN 468x60", width: 468, height: 60, channel: "gdn" },
  { slug: "gdn-728x90", label: "GDN 728x90", width: 728, height: 90, channel: "gdn" },
  { slug: "gdn-320x50", label: "GDN 320x50", width: 320, height: 50, channel: "gdn" },
  { slug: "gdn-320x100", label: "GDN 320x100", width: 320, height: 100, channel: "gdn" },
  { slug: "gdn-120x600", label: "GDN 120x600", width: 120, height: 600, channel: "gdn" },
  { slug: "gdn-160x600", label: "GDN 160x600", width: 160, height: 600, channel: "gdn" },
  { slug: "gdn-300x600", label: "GDN 300x600", width: 300, height: 600, channel: "gdn" },
];
