import { getBrandConfig } from "@brand/config";
import type { Category } from "@brand/shared/types/categories";
import type { CategoryBreadcrumb } from "@brand/shared/types/products";

export type BreadcrumbSegment = { label: string; href: string };

export function flattenAllCategories(categories: Category[]): Category[] {
  const result: Category[] = [];
  for (const cat of categories) {
    result.push(cat);
    if (cat.subCategories.length > 0) {
      result.push(...flattenAllCategories(cat.subCategories));
    }
  }
  return result;
}

export function mapCategoryBreadcrumbs(
  crumbs: CategoryBreadcrumb[] | null | undefined,
): BreadcrumbSegment[] {
  if (!crumbs) return [];
  return crumbs.map((c) => ({ label: c.name, href: c.path }));
}

/**
 * Builds a schema.org BreadcrumbList JSON-LD object from segments.
 * All segments get `item` URLs. If `currentPage` is provided, it is
 * appended as the final non-linked item.
 */
export function buildBreadcrumbJsonLd(
  segments: BreadcrumbSegment[] = [],
  currentPage?: string,
) {
  const { siteUrl } = getBrandConfig();
  const items: Record<string, unknown>[] = [
    { name: "Početna", item: `${siteUrl}/` },
    { name: "Kategorije", item: `${siteUrl}/proizvodi/kategorije` },
    ...segments.map((seg) => ({
      name: seg.label,
      item: `${siteUrl}${seg.href}`,
    })),
    ...(currentPage ? [{ name: currentPage }] : []),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      ...entry,
    })),
  };
}
