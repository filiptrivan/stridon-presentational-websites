// Caching strategy: time-based expiry only (days for structural data, hours
// for product details). No on-demand revalidation endpoint - this is a
// display-only site so slight staleness is acceptable.
//
// The cache is Next's fetch Data Cache (`next: { revalidate, tags }`), not
// `"use cache"`. Without Cache Components a `"use cache"` entry on Vercel lives
// in one instance's memory and is gone on the next deploy; a Data Cache entry
// survives it. pa-storefront moved its reads the same way (cachedFetch,
// 2026-08). On Vercel that cache is shared by the whole team, the webshop
// included, so it is never purged by hand.

import { getBrandConfig } from "@brand/config";
import { cache } from "react";
import type { Brand, BrandCard } from "../types/brands";
import type { Catalog, CatalogsResult } from "../types/catalogs";
import type { Category } from "../types/categories";
import type {
  Product,
  ProductCardData,
  ProductCardsResult,
  SitemapEntry,
} from "../types/products";
import type { Tag } from "../types/tags";
import { TAGS } from "./cache-tags";
import { reportError } from "./report-error";
import { type FetchTier, budgetMsFor } from "./request-budget";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const API_URL = process.env.API_URL;
// Trusted first-party caller secret, sent as X-Internal-Bypass on every apiFetch. The Cloudflare
// edge fronting api.pacms.in.rs validates + strips it and injects the trusted marker, so SSG build
// reads aren't rate-limited as anonymous. Absent ⇒ not sent (local/dev); never touches auth.
// See PACMS docs/trusted-first-party-caller.md.
const RATELIMIT_BYPASS_SECRET = process.env.PACMS_RATELIMIT_BYPASS_SECRET;
// Built once at module load, not per request.
const BYPASS_HEADERS: Record<string, string> = RATELIMIT_BYPASS_SECRET
  ? { "X-Internal-Bypass": RATELIMIT_BYPASS_SECRET }
  : {};
const BRAND_SLUG = getBrandConfig().brandSlug;

// The same freshness the `cacheLife` profiles gave these reads under Cache
// Components: "days" and "hours" both revalidated after one day / one hour. A
// page revalidates as often as its freshest read.
const DAYS = { revalidate: 86_400 } as const;
const HOURS = { revalidate: 3_600 } as const;

type CachePolicy = { revalidate: number; tag: string };

// One network read per distinct request per render. Next memoizes a GET fetch
// across generateMetadata and the page, but only when it carries no `signal`
// (next/dist/server/lib/dedupe-fetch.js), and every read here carries one: the
// budget. Without this the product page would read its product twice. `cache`
// keys on argument identity, hence primitives only and the body as a string.
const requestJson = cache(
  async (
    path: string,
    tier: FetchTier,
    revalidate: number,
    tag: string,
    body: string | undefined,
  ): Promise<unknown> => {
    if (!API_URL) throw new Error("API_URL is required");

    const budgetMs = budgetMsFor(tier);
    const context = {
      source: `apiFetch ${path}`,
      details: `tier=${tier} budgetMs=${budgetMs}`,
    };

    const res = await fetch(`${API_URL}${path}`, {
      method: body === undefined ? "GET" : "POST",
      body,
      // A real abort, not just a lost wait: the socket is torn down, so a saturated
      // backend can shed the work instead of the request holding both a lambda and
      // a connection slot.
      signal: AbortSignal.timeout(budgetMs),
      headers: {
        "Content-Type": "application/json",
        ...BYPASS_HEADERS,
      },
      next: { revalidate, tags: [tag] },
    }).catch((error: unknown) => {
      // A timeout or network failure produces no Response, so the `!res.ok` branch
      // below structurally cannot see it. Rethrown, never swallowed — the 404
      // guards must not receive an availability failure as a resolved absence.
      reportError(error, context);
      throw error;
    });

    if (!res.ok) {
      const error = new ApiError(
        res.status,
        `API error: ${res.status} ${res.statusText}`,
      );
      if (res.status !== 404) {
        reportError(error, context);
      }
      throw error;
    }
    return res.json();
  },
);

/** GET, or POST with a JSON body when `body` is given. */
function apiFetch<T>(
  path: string,
  tier: FetchTier,
  { revalidate, tag }: CachePolicy,
  body?: unknown,
): Promise<T> {
  return requestJson(
    path,
    tier,
    revalidate,
    tag,
    body === undefined ? undefined : JSON.stringify(body),
  ) as Promise<T>;
}

//#region Days profile - structural/marketing data

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>(
    `/api/Storefront/Categories?brandSlug=${BRAND_SLUG}`,
    "auxiliary",
    { ...DAYS, tag: TAGS.categories },
  );
}

export async function getFlatCategories(count = 6): Promise<Category[]> {
  return apiFetch<Category[]>(
    `/api/Storefront/FlatCategories?brandSlug=${BRAND_SLUG}&count=${count}`,
    "auxiliary",
    { ...DAYS, tag: TAGS.categories },
  );
}

export async function getAllCategoriesFlat(): Promise<Category[]> {
  const { flattenAllCategories } = await import("./categories");
  return flattenAllCategories(await getCategories());
}

export async function getCatalogs(): Promise<Catalog[]> {
  return apiFetch<Catalog[]>(
    `/api/Storefront/CatalogsByBrand?brandSlug=${BRAND_SLUG}`,
    "auxiliary",
    { ...DAYS, tag: TAGS.catalogs },
  );
}

// Not brand-scoped: every catalog in the CMS, each carrying the manufacturers it
// belongs to. `getCatalogs()` above filters by BRAND_SLUG, which only resolves for
// an app whose slug is itself a brand in PACMS (dck, sg-tools). Stridon is the parent
// company, not a brand there, so for it that call is structurally always empty and
// this is the endpoint that has the data.
export async function getAllCatalogs(): Promise<CatalogsResult> {
  return apiFetch<CatalogsResult>("/api/Storefront/Catalogs", "auxiliary", {
    ...DAYS,
    tag: TAGS.catalogs,
  });
}

// The three brand fetchers below are not brand-scoped either - the CMS brand list is
// the webshop's full catalogue of manufacturers, ordered by `orderNumber`, then id.

// Full fidelity, and heavy: 234 rows carrying their whole htmlDescription, ~848 KB.
// It is the only brand list that carries `orderNumber`, which is how stridon picks
// and orders the brands it shows; a page that only needs names and logos can read
// `getBrandCards()` instead. The Data Cache stores a response whole and silently
// skips one over 2 MB, so what this returns is what the entry costs.
export async function getBrands(count?: number): Promise<Brand[]> {
  const params = new URLSearchParams();
  if (count !== undefined) params.set("count", String(count));
  const query = params.toString();
  return apiFetch<Brand[]>(
    `/api/Storefront/Brands${query ? `?${query}` : ""}`,
    "auxiliary",
    { ...DAYS, tag: TAGS.brands },
  );
}

export async function getBrandCards(count?: number): Promise<BrandCard[]> {
  const params = new URLSearchParams();
  if (count !== undefined) params.set("count", String(count));
  const query = params.toString();
  return apiFetch<BrandCard[]>(
    `/api/Storefront/BrandCards${query ? `?${query}` : ""}`,
    "auxiliary",
    { ...DAYS, tag: TAGS.brands },
  );
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  try {
    return await apiFetch<Brand>(
      `/api/Storefront/BrandBySlug?slug=${encodeURIComponent(slug)}`,
      "critical",
      { ...DAYS, tag: TAGS.brands },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getSitemapProducts(): Promise<SitemapEntry[]> {
  return apiFetch<SitemapEntry[]>(
    `/api/Storefront/SitemapProductsByBrand?brandSlug=${BRAND_SLUG}`,
    "auxiliary",
    { ...DAYS, tag: TAGS.products },
  );
}

export async function getTagsByBrand(count?: number): Promise<Tag[]> {
  const params = new URLSearchParams({ brandSlug: BRAND_SLUG });
  if (count !== undefined) params.set("count", String(count));
  return apiFetch<Tag[]>(
    `/api/Storefront/TagsByBrand?${params.toString()}`,
    "auxiliary",
    { ...DAYS, tag: TAGS.tags },
  );
}

// Backend endpoints below are not brand-scoped — they return tags across all brands.
// Tag detail pages filter products by BRAND_SLUG, so cross-brand tags render empty grids.

export async function getSitemapTags(): Promise<SitemapEntry[]> {
  return apiFetch<SitemapEntry[]>("/api/Storefront/SitemapTags", "auxiliary", {
    ...DAYS,
    tag: TAGS.tags,
  });
}

export async function getPrerenderedTagSlugs(): Promise<string[]> {
  return apiFetch<string[]>("/api/Storefront/PrerenderedTagSlugs", "auxiliary", {
    ...DAYS,
    tag: TAGS.tags,
  });
}

//#endregion

//#region Hours profile - product/detail data

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await apiFetch<Product>(
      `/api/Storefront/ProductBySlug?slug=${encodeURIComponent(slug)}`,
      "critical",
      { ...HOURS, tag: TAGS.products },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    return await apiFetch<Category>(
      `/api/Storefront/CategoryBySlug?slug=${encodeURIComponent(slug)}&brandSlug=${BRAND_SLUG}`,
      "critical",
      { ...HOURS, tag: TAGS.categories },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// The three FilteredProducts fetchers below differ only in how they narrow the
// query, so this shares the request shape. `tagSlugs: []` sits before the spread
// so a tag filter overrides it.
function fetchFilteredProducts(
  narrow: { categorySlug?: string; tagSlugs?: string[] },
  offset: number,
  limit: number,
): Promise<ProductCardsResult> {
  return apiFetch<ProductCardsResult>(
    "/api/Storefront/FilteredProducts",
    "auxiliary",
    { ...HOURS, tag: TAGS.products },
    {
      brandSlugs: [BRAND_SLUG],
      tagSlugs: [],
      ...narrow,
      first: offset,
      rows: limit,
    },
  );
}

export async function getFilteredProducts(
  offset: number,
  limit: number,
): Promise<ProductCardsResult> {
  return fetchFilteredProducts({}, offset, limit);
}

export async function getTopProductsByBrand(
  count = 4,
): Promise<ProductCardData[]> {
  return apiFetch<ProductCardData[]>(
    `/api/Storefront/TopProductsByBrand?brandSlug=${BRAND_SLUG}&count=${count}`,
    "auxiliary",
    { ...HOURS, tag: TAGS.products },
  );
}

export async function getFilteredProductsByCategory(
  categorySlug: string,
  offset: number,
  limit: number,
): Promise<ProductCardsResult> {
  return fetchFilteredProducts({ categorySlug }, offset, limit);
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    return await apiFetch<Tag>(
      `/api/Storefront/TagBySlug?slug=${encodeURIComponent(slug)}`,
      "critical",
      { ...HOURS, tag: TAGS.tags },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getFilteredProductsByTag(
  tagSlug: string,
  offset: number,
  limit: number,
): Promise<ProductCardsResult> {
  return fetchFilteredProducts({ tagSlugs: [tagSlug] }, offset, limit);
}

//#endregion
