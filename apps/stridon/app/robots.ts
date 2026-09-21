import { SITE_URL } from "@/constants/links";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Neither `/api/` nor `/_next/` may be blocked here. Every page's
      // `og:image` is `/api/og?...`, so disallowing it hides the link preview
      // of the whole site; `/_next/` covers `/_next/image` (every optimized
      // image on the site) and `/_next/static` (the CSS and JS Googlebot
      // renders the page with). `/monitoring` is the Sentry tunnel and is the
      // only path here that is not meant to be crawled.
      disallow: ["/monitoring"],
    },
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
