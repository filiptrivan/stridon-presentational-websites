"use cache";

// Caching strategy: time-based expiry only (days for structural data, hours
// for product details). No on-demand revalidation endpoint - this is a
// display-only site so slight staleness is acceptable.

import { getBrandConfig } from "@brand/config";
import { cacheLife, cacheTag } from "next/cache";
import type { Catalog } from "../types/catalogs";
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

async function apiFetch<T>(
  path: string,
  tier: FetchTier,
  options?: RequestInit,
): Promise<T> {
  if (!API_URL) throw new Error("API_URL is required");

  const budgetMs = budgetMsFor(tier);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      // A real abort, not just a lost wait: the socket is torn down, so a
      // saturated backend can shed the work instead of the request holding both
      // a lambda and a connection slot.
      signal: AbortSignal.timeout(budgetMs),
      headers: {
        "Content-Type": "application/json",
        ...BYPASS_HEADERS,
        ...(options?.headers as Record<string, string>),
      },
    });
  } catch (error) {
    // Reporting used to hang entirely off `!res.ok` below. A timeout or a network
    // failure never produces a Response, so adding the budget without this catch
    // would have made backend stalls *less* visible than the 100s 524s they
    // replace — silently degrading a section with nothing in Sentry.
    reportError(error, {
      source: `apiFetch ${path}`,
      details: `tier=${tier} budgetMs=${budgetMs}`,
    });
    // Rethrown, never swallowed: an availability failure must not reach the
    // callers below as a resolved absence (see the 404 guards).
    throw error;
  }

  if (!res.ok) {
    const error = new ApiError(
      res.status,
      `API error: ${res.status} ${res.statusText}`,
    );
    if (res.status !== 404) {
      reportError(error, { source: `apiFetch ${path}` });
    }
    throw error;
  }
  return res.json() as Promise<T>;
}

//#region Days profile - structural/marketing data

export async function getCategories(): Promise<Category[]> {
  cacheLife("days");
  cacheTag(TAGS.categories);
  return apiFetch<Category[]>(
    `/api/Storefront/Categories?brandSlug=${BRAND_SLUG}`,
    "auxiliary",
  );
}

export async function getFlatCategories(count = 6): Promise<Category[]> {
  cacheLife("days");
  cacheTag(TAGS.categories);
  return apiFetch<Category[]>(
    `/api/Storefront/FlatCategories?brandSlug=${BRAND_SLUG}&count=${count}`,
    "auxiliary",
  );
}

export async function getAllCategoriesFlat(): Promise<Category[]> {
  const { flattenAllCategories } = await import("./categories");
  return flattenAllCategories(await getCategories());
}

export async function getCatalogs(): Promise<Catalog[]> {
  cacheLife("days");
  cacheTag(TAGS.catalogs);
  return apiFetch<Catalog[]>(
    `/api/Storefront/CatalogsByBrand?brandSlug=${BRAND_SLUG}`,
    "auxiliary",
  );
}

export async function getSitemapProducts(): Promise<SitemapEntry[]> {
  cacheLife("days");
  cacheTag(TAGS.products);
  return apiFetch<SitemapEntry[]>(
    `/api/Storefront/SitemapProductsByBrand?brandSlug=${BRAND_SLUG}`,
    "auxiliary",
  );
}

export async function getTagsByBrand(count?: number): Promise<Tag[]> {
  cacheLife("days");
  cacheTag(TAGS.tags);
  const params = new URLSearchParams({ brandSlug: BRAND_SLUG });
  if (count !== undefined) params.set("count", String(count));
  return apiFetch<Tag[]>(
    `/api/Storefront/TagsByBrand?${params.toString()}`,
    "auxiliary",
  );
}

// Backend endpoints below are not brand-scoped — they return tags across all brands.
// Tag detail pages filter products by BRAND_SLUG, so cross-brand tags render empty grids.

export async function getSitemapTags(): Promise<SitemapEntry[]> {
  cacheLife("days");
  cacheTag(TAGS.tags);
  return apiFetch<SitemapEntry[]>("/api/Storefront/SitemapTags", "auxiliary");
}

export async function getPrerenderedTagSlugs(): Promise<string[]> {
  cacheLife("days");
  cacheTag(TAGS.tags);
  return apiFetch<string[]>(
    "/api/Storefront/PrerenderedTagSlugs",
    "auxiliary",
  );
}

//#endregion

//#region Hours profile - product/detail data

export async function getProductBySlug(slug: string): Promise<Product | null> {
  cacheLife("hours");
  cacheTag(TAGS.products);
  try {
    return await apiFetch<Product>(
      `/api/Storefront/ProductBySlug?slug=${encodeURIComponent(slug)}`,
      "critical",
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  cacheLife("hours");
  cacheTag(TAGS.categories);
  try {
    return await apiFetch<Category>(
      `/api/Storefront/CategoryBySlug?slug=${encodeURIComponent(slug)}&brandSlug=${BRAND_SLUG}`,
      "critical",
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getFilteredProducts(
  offset: number,
  limit: number,
): Promise<ProductCardsResult> {
  cacheLife("hours");
  cacheTag(TAGS.products);
  return apiFetch<ProductCardsResult>(
    "/api/Storefront/FilteredProducts",
    "auxiliary",
    {
      method: "POST",
      body: JSON.stringify({
        brandSlugs: [BRAND_SLUG],
        tagSlugs: [],
        first: offset,
        rows: limit,
      }),
    },
  );
}

export async function getTopProductsByBrand(
  count = 4,
): Promise<ProductCardData[]> {
  cacheLife("hours");
  cacheTag(TAGS.products);
  return apiFetch<ProductCardData[]>(
    `/api/Storefront/TopProductsByBrand?brandSlug=${BRAND_SLUG}&count=${count}`,
    "auxiliary",
  );
}

export async function getFilteredProductsByCategory(
  categorySlug: string,
  offset: number,
  limit: number,
): Promise<ProductCardsResult> {
  cacheLife("hours");
  cacheTag(TAGS.products);
  return apiFetch<ProductCardsResult>(
    "/api/Storefront/FilteredProducts",
    "auxiliary",
    {
      method: "POST",
      body: JSON.stringify({
        brandSlugs: [BRAND_SLUG],
        tagSlugs: [],
        categorySlug,
        first: offset,
        rows: limit,
      }),
    },
  );
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  cacheLife("hours");
  cacheTag(TAGS.tags);
  try {
    return await apiFetch<Tag>(
      `/api/Storefront/TagBySlug?slug=${encodeURIComponent(slug)}`,
      "critical",
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
  cacheLife("hours");
  cacheTag(TAGS.products);
  return apiFetch<ProductCardsResult>(
    "/api/Storefront/FilteredProducts",
    "auxiliary",
    {
      method: "POST",
      body: JSON.stringify({
        brandSlugs: [BRAND_SLUG],
        tagSlugs: [tagSlug],
        first: offset,
        rows: limit,
      }),
    },
  );
}

//#endregion
