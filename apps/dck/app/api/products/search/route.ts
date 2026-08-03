import { NextResponse } from "next/server";
import { reportError } from "@brand/shared/lib/report-error";
import { AUTOCOMPLETE_BUDGET_MS } from "@brand/shared/lib/request-budget";

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

    // The customer is waiting on this one synchronously, so it fails fast rather
    // than holding the lambda: an abort lands in the catch below and returns the
    // same "search unavailable" 500 the client already renders. Note the browser's
    // own stale-request AbortController (product-autocomplete.tsx) is NOT wired to
    // this fetch, so abandoned keystrokes used to run to completion — this bounds
    // that wasted backend work too.
    const res = await fetch(url, {
      headers: { "X-Api-Key": apiKey },
      cache: "no-store",
      signal: AbortSignal.timeout(AUTOCOMPLETE_BUDGET_MS),
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
