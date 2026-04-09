import { getBrandConfig } from "@brand/config";
import type { Metadata } from "next";

const brand = getBrandConfig();

export function createRootMetadata(): Metadata {
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
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: brand.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
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

export function createPageMetadata({
  title,
  description,
  canonicalUrl,
}: {
  title: string;
  description: string;
  canonicalUrl: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${brand.siteName}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${brand.siteName}`,
      description,
    },
  };
}

function createListingMetadata({
  title,
  description,
  canonicalBase,
  currentPage,
}: {
  title: string;
  description: string;
  canonicalBase: string;
  currentPage: number;
}): Metadata {
  const pageSuffix = currentPage > 1 ? ` - Strana ${currentPage}` : "";
  const fullTitle = `${title}${pageSuffix}`;
  const canonical =
    currentPage > 1 ? `${canonicalBase}?strana=${currentPage}` : canonicalBase;

  return {
    title: fullTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${fullTitle} | ${brand.siteName}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullTitle} | ${brand.siteName}`,
      description,
    },
  };
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
}: {
  title: string;
  description: string;
  slug: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.prodavnicaalata.rs/proizvodi/${slug}/`,
    },
    openGraph: {
      title: `${title} | ${brand.siteName}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${brand.siteName}`,
      description,
    },
  };
}
