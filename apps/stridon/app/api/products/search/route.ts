import { NextResponse } from "next/server";
import { reportError } from "@brand/shared/lib/report-error";

const BRAND_SLUG = "dck";

export type ProductAutocompleteHit = {
  slug: string;
  title: string;
  sku: string | null;
  imageUrl: string | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  const apiUrl = process.env.API_URL;
  const apiKey = process.env.PACMS_API_KEY;

  if (!apiUrl || !apiKey) {
    reportError(new Error("API_URL or PACMS_API_KEY missing"), {
      source: "GET /api/products/search",
    });
    return NextResponse.json({ hits: [] }, { status: 500 });
  }

  try {
    const url = `${apiUrl}/api/Storefront/ProductsAutocompleteByBrand?q=${encodeURIComponent(
      q,
    )}&brandSlug=${BRAND_SLUG}`;

    const res = await fetch(url, {
      headers: { "X-Api-Key": apiKey },
      cache: "no-store",
    });

    if (!res.ok) {
      // Surface upstream failures (e.g. a 429 from the backend rate limiter)
      // instead of laundering them into an empty result — the client shows
      // "search unavailable", not "no products" (2026-07-13 warranty incident).
      reportError(new Error(`Products search API error: ${res.status}`), {
        source: "GET /api/products/search",
      });
      return NextResponse.json({ hits: [] }, { status: 502 });
    }

    const hits = (await res.json()) as ProductAutocompleteHit[];
    return NextResponse.json({ hits });
  } catch (error) {
    reportError(error, { source: "GET /api/products/search" });
    return NextResponse.json({ hits: [] }, { status: 500 });
  }
}
