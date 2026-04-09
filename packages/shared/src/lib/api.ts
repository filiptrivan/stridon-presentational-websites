"use cache";

// Caching strategy: time-based expiry only (days for structural data, hours
// for product details). No on-demand revalidation endpoint - this is a
// display-only site so slight staleness is acceptable.

import { getBrandConfig } from "@brand/config";
import { cacheLife, cacheTag } from "next/cache";
import type { Category } from "../types/categories";
import type {
  Product,
  ProductCardData,
  ProductCardsResult,
  SitemapEntry,
} from "../types/products";
import { TAGS } from "./cache-tags";
import { reportError } from "./report-error";

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
const BRAND_SLUG = getBrandConfig().brandSlug;

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error("API_URL is required");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    },
  });

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
  );
}

export async function getAllCategoriesFlat(): Promise<Category[]> {
  const { flattenAllCategories } = await import("./categories");
  return flattenAllCategories(await getCategories());
}

export async function getSitemapProducts(): Promise<SitemapEntry[]> {
  cacheLife("days");
  cacheTag(TAGS.products);
  return apiFetch<SitemapEntry[]>(
    `/api/Storefront/SitemapProductsByBrand?brandSlug=${BRAND_SLUG}`,
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
      `/api/Storefront/CategoryBySlug?slug=${encodeURIComponent(slug)}`,
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
  return apiFetch<ProductCardsResult>("/api/Storefront/FilteredProducts", {
    method: "POST",
    body: JSON.stringify({
      brandSlugs: [BRAND_SLUG],
      tagSlugs: [],
      first: offset,
      rows: limit,
    }),
  });
}

export async function getFeaturedProductsByBrand(
  count?: number,
): Promise<ProductCardData[]> {
  cacheLife("hours");
  cacheTag(TAGS.products);

  const searchParams = new URLSearchParams({ brandSlug: BRAND_SLUG });
  if (count !== undefined) {
    searchParams.set("count", String(count));
  }

  return apiFetch<ProductCardData[]>(
    `/api/Storefront/FeaturedProductsByBrand?${searchParams.toString()}`,
  );
}

export async function getFilteredProductsByCategory(
  categorySlug: string,
  offset: number,
  limit: number,
): Promise<ProductCardsResult> {
  cacheLife("hours");
  cacheTag(TAGS.products);
  return apiFetch<ProductCardsResult>("/api/Storefront/FilteredProducts", {
    method: "POST",
    body: JSON.stringify({
      brandSlugs: [BRAND_SLUG],
      tagSlugs: [],
      categorySlug,
      first: offset,
      rows: limit,
    }),
  });
}

//#endregion
