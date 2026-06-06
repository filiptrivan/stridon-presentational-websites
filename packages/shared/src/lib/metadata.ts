import { getBrandConfig } from "@brand/config";
import type { Metadata } from "next";
import { buildOgImageUrl, OG_SIZE, type OgImageParams } from "./og/utils";

const brand = getBrandConfig();

// Builds the `openGraph.images` / `twitter.images` pair from one OG URL so every
// page exposes `og:image:alt` + dimensions (the file-convention used to inject
// these automatically; the query-param route doesn't, so we set them here).
function ogImageMeta(params: OgImageParams, alt: string) {
  const url = buildOgImageUrl(params);
  return {
    openGraph: [{ url, width: OG_SIZE.width, height: OG_SIZE.height, alt }],
    twitter: [{ url, alt }],
  };
}

export function createRootMetadata(): Metadata {
  const og = ogImageMeta(
    {
      type: "default",
      title: brand.defaultTitle,
      description: brand.siteDescription,
    },
    brand.siteName,
  );

  return {
    metadataBase: new URL(brand.siteUrl),
    title: {
      default: brand.defaultTitle,
      template: `%s | ${brand.siteName}`,
    },
    description: brand.siteDescription,
    openGraph: {
      siteName: brand.siteName,
      locale: "sr_RS",
      type: "website",
      images: og.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      images: og.twitter,
    },
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-touch-icon.png",
    },
  };
}

// The single page-shape builder. `createListingMetadata` and
// `createProductMetadata` delegate here, differing only in their `ogParams`.
export function createPageMetadata({
  title,
  description,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogParams,
}: {
  title: string;
  description: string;
  canonicalUrl: string;
  // Escape hatch: override the OG card copy where a curated headline beats the
  // SEO title (e.g. the About page). Defaults to the page title/description.
  ogTitle?: string;
  ogDescription?: string;
  // Non-default OG card (product/category/tag). Defaults to a `default`-type card
  // built from the page title/description; entity pages pass their own.
  ogParams?: OgImageParams;
}): Metadata {
  const resolvedOgParams: OgImageParams = ogParams ?? {
    type: "default",
    title: ogTitle ?? title,
    description: ogDescription ?? description,
  };
  const og = ogImageMeta(resolvedOgParams, resolvedOgParams.title);
  const socialTitle = `${title} | ${brand.siteName}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title: socialTitle, description, images: og.openGraph },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: og.twitter,
    },
  };
}

// Listing pages (products/category/tag) share pagination: the "Strana N" title
// suffix and the `?strana=` canonical. The OG card always reflects the base entity,
// never the paginated page — so `ogParams` carries the unsuffixed title.
function createListingMetadata({
  title,
  description,
  canonicalBase,
  currentPage,
  ogParams,
}: {
  title: string;
  description: string;
  canonicalBase: string;
  currentPage: number;
  ogParams: OgImageParams;
}): Metadata {
  const pageSuffix = currentPage > 1 ? ` - Strana ${currentPage}` : "";
  const canonical =
    currentPage > 1 ? `${canonicalBase}?strana=${currentPage}` : canonicalBase;

  return createPageMetadata({
    title: `${title}${pageSuffix}`,
    description,
    canonicalUrl: canonical,
    ogParams,
  });
}

export function createProductsPageMetadata({
  currentPage,
}: {
  currentPage: number;
}): Metadata {
  return createListingMetadata({
    title: "Svi proizvodi",
    description: brand.productsPageDescription,
    canonicalBase: `${brand.siteUrl}/proizvodi`,
    currentPage,
    ogParams: {
      type: "default",
      title: "Svi proizvodi",
      description: brand.productsPageDescription,
    },
  });
}

export function createCategoryMetadata({
  title,
  description,
  slug,
  currentPage,
}: {
  title: string;
  description: string;
  slug: string;
  currentPage: number;
}): Metadata {
  return createListingMetadata({
    title,
    description,
    canonicalBase: `${brand.siteUrl}/proizvodi/kategorije/${slug}`,
    currentPage,
    ogParams: { type: "category", title, description },
  });
}

export function createTagMetadata({
  title,
  description,
  slug,
  currentPage,
}: {
  title: string;
  description: string;
  slug: string;
  currentPage: number;
}): Metadata {
  return createListingMetadata({
    title,
    description,
    canonicalBase: `${brand.siteUrl}/proizvodi/tagovi/${slug}`,
    currentPage,
    ogParams: { type: "tag", title, description },
  });
}

export function createNotFoundMetadata(): Metadata {
  return {
    title: "Stranica nije pronađena",
    description:
      "Stranica koju tražiš ne postoji ili je premeštena. Proveri adresu ili se vrati na početnu.",
    robots: { index: false, follow: true },
  };
}

export function createProductMetadata({
  title,
  description,
  slug,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  image?: string;
}): Metadata {
  return createPageMetadata({
    title,
    description,
    canonicalUrl: `${brand.siteUrl}/proizvodi/${slug}/`,
    ogParams: { type: "product", title, image },
  });
}
