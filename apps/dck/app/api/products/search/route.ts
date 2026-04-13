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
      return NextResponse.json({ hits: [] });
    }

    const hits = (await res.json()) as ProductAutocompleteHit[];
    return NextResponse.json({ hits });
  } catch (error) {
    reportError(error, { source: "GET /api/products/search" });
    return NextResponse.json({ hits: [] }, { status: 500 });
  }
}
