import { getBrandConfig } from "@brand/config";

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + "…";
}

// Intrinsic OG image size, shared by the /api/og route (the ImageResponse) and
// the `og:image:width`/`height` meta tags in metadata.ts so they can't drift.
export const OG_SIZE = { width: 1200, height: 630 } as const;

// Params for the on-demand OG route (`/api/og`). Trimmed to what the brand
// templates actually render: product shows a raw image + title; the rest show a
// title (+ optional description). `tag` maps to the category template with a
// "TAG" label on brands that have a tags section.
export type OgImageParams =
  | { type: "product"; title: string; image?: string | null }
  | { type: "category"; title: string; description?: string }
  | { type: "tag"; title: string; description?: string }
  | { type: "default"; title: string; description?: string };

// Builds the absolute URL crawlers fetch for a page's OG image. Absolute (not
// relative) so it bypasses `metadataBase` and works from any embedding context;
// the route reads these params and renders on demand, CDN-cached for a year.
export function buildOgImageUrl(params: OgImageParams): string {
  const search = new URLSearchParams();
  search.set("type", params.type);
  search.set("title", params.title);

  if (params.type === "product") {
    if (params.image) search.set("image", params.image);
  } else if (params.description) {
    search.set("description", params.description);
  }

  return `${getBrandConfig().siteUrl}/api/og?${search.toString()}`;
}
