import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { HREFLANG, type Locale } from "@brand/i18n/config";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import type { Metadata } from "next";

// Taken from `getPathname` itself rather than rebuilt: it is the type that
// already knows a dynamic route needs its params alongside it.
type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Page metadata with the canonical and the hreflang set both pointing at the
 * locale's own spelling of the route.
 *
 * The shared `createPageMetadata` takes a single `canonicalUrl`, which is right
 * for a one-language site and wrong here in two ways: the English page would
 * declare the Serbian URL as its canonical, effectively asking Google to drop
 * it, and neither page would name the other as an alternate. next-intl's proxy
 * does emit `Link: rel="alternate"` headers, but only on a request it handles -
 * the tags belong in the document as well, which is where the crawler looks
 * first.
 */
export function createLocalizedMetadata({
  locale,
  href,
  title,
  description,
  ogTitle,
  ogDescription,
}: {
  locale: Locale;
  href: Href;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}): Metadata {
  const base = createPageMetadata({
    title,
    description,
    canonicalUrl: getPathname({ href, locale }),
    ogTitle,
    ogDescription,
  });

  return {
    ...base,
    alternates: {
      canonical: getPathname({ href, locale }),
      languages: Object.fromEntries(
        routing.locales.map((other) => [
          // `sr-Latn` rather than a bare `sr`: Serbian is digraphic and this
          // site is Latin-only, so the script subtag is the honest tag even
          // though the URL segment stays "sr".
          HREFLANG[other],
          getPathname({ href, locale: other }),
        ]),
      ),
    },
    openGraph: {
      ...base.openGraph,
      locale: locale === "sr" ? "sr_RS" : "en_US",
    },
  };
}
