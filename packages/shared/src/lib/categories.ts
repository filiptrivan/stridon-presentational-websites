import { getBrandConfig } from "@brand/config";
import type { Category } from "@brand/shared/types/categories";
import type { CategoryBreadcrumb } from "@brand/shared/types/products";

export type BreadcrumbSegment = { label: string; href: string };

export const BASE_BREADCRUMBS: BreadcrumbSegment[] = [
  { label: "Početna", href: "/" },
  { label: "Kategorije", href: "/proizvodi/kategorije" },
];

export const TAG_BASE_BREADCRUMBS: BreadcrumbSegment[] = [
  { label: "Početna", href: "/" },
  { label: "Tagovi", href: "/proizvodi/tagovi" },
];

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

function segmentsToJsonLd(allCrumbs: BreadcrumbSegment[]) {
  const { siteUrl } = getBrandConfig();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allCrumbs.map((crumb, i) => {
      const isLast = i === allCrumbs.length - 1;
      return {
        "@type": "ListItem",
        position: i + 1,
        name: crumb.label,
        ...(isLast ? {} : { item: `${siteUrl}${crumb.href}` }),
      };
    }),
  };
}

/**
 * Builds a schema.org BreadcrumbList JSON-LD object from segments.
 * The last segment is treated as the current page (no `item` URL).
 */
export function buildBreadcrumbJsonLd(segments: BreadcrumbSegment[] = []) {
  return segmentsToJsonLd([...BASE_BREADCRUMBS, ...segments]);
}

export function buildTagBreadcrumbJsonLd(
  tagName: string,
  tagSlug: string,
) {
  return segmentsToJsonLd([
    ...TAG_BASE_BREADCRUMBS,
    { label: tagName, href: `/proizvodi/tagovi/${tagSlug}` },
  ]);
}
