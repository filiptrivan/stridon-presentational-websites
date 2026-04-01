import { SITE_URL } from "@/constants/links";
import type { Category } from "@brand/shared/types/categories";

export type BreadcrumbSegment = { label: string; href: string };

/**
 * Recursively collects leaf categories (those with no sub-categories).
 */
export function flattenToLeafCategories(categories: Category[]): Category[] {
  const leaves: Category[] = [];
  for (const cat of categories) {
    if (cat.subCategories.length === 0) {
      leaves.push(cat);
    } else {
      leaves.push(...flattenToLeafCategories(cat.subCategories));
    }
  }
  return leaves;
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
  const items: Record<string, unknown>[] = [
    { name: "Početna", item: `${SITE_URL}/` },
    { name: "Kategorije", item: `${SITE_URL}/proizvodi/kategorije` },
    ...segments.map((seg) => ({
      name: seg.label,
      item: `${SITE_URL}${seg.href}`,
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
