import { isTrustedImageUrl } from "@brand/config/public-assets";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import type { ReactElement } from "react";
import { loadFonts } from "./fonts";
import { OG_SIZE, type OgImageParams } from "./utils";

// Crawlers fetch this once per page; the CDN serves it for a year thereafter.
const CACHE_CONTROL = "public, max-age=604800, s-maxage=31536000, immutable";

// Normalized inputs handed to each brand's template renderer.
export type OgTemplateArgs = {
  title: string;
  description?: string;
  image?: string;
};

type OgRenderer = (args: OgTemplateArgs) => ReactElement;

// `default` is required (the fallback for any unknown/unsupported type); the rest
// are opt-in per brand — e.g. only DCK supplies `tag`.
export type OgTemplateMap = { default: OgRenderer } & Partial<
  Record<OgImageParams["type"], OgRenderer>
>;

// Builds the GET handler for an app's `/api/og` route. The brand supplies only its
// templates — the part that genuinely differs per brand — while param parsing, the
// image-host gate, title validation, font loading, and caching stay shared.
export function createOgImageRoute(templates: OgTemplateMap) {
  return async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const type = (searchParams.get("type") ?? "default") as OgImageParams["type"];
    const title = searchParams.get("title");
    const description = searchParams.get("description") ?? undefined;
    const rawImage = searchParams.get("image");
    const image = rawImage && isTrustedImageUrl(rawImage) ? rawImage : undefined;

    if (!title) {
      return new Response("Missing required param: title", { status: 400 });
    }

    const render = templates[type] ?? templates.default;
    const fonts = await loadFonts();

    return new ImageResponse(render({ title, description, image }), {
      ...OG_SIZE,
      fonts,
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  };
}
