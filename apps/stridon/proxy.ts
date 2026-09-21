import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

/**
 * `localePrefix: "as-needed"` needs a rewrite to map a bare Serbian URL onto the
 * `[locale]` segment, so this runs on every matched request - including ones
 * that end up serving a prerendered file. That is the price of keeping the
 * existing URLs; prefixing both locales would have avoided it and broken every
 * indexed link instead.
 */
export default createMiddleware(routing);

export const config = {
  // Everything except the API route, Sentry's tunnel (`tunnelRoute` in
  // next.config.ts) and anything with a file extension, which covers
  // robots.txt, sitemap.xml, manifest.webmanifest, the fonts and the images.
  //
  // The escaped dot matters and losing it is silent: with a bare `.` the
  // pattern becomes `.*.*`, which matches every path of at least one character,
  // so the negative lookahead rejects all of them and the proxy ends up running
  // on "/" and nowhere else - every other URL 404s while the build still
  // reports a proxy. Next only static-analyses a literal here, so this cannot
  // be assembled from a variable, a RegExp or String.raw.
  matcher: "/((?!api|monitoring|_next|_vercel|.*\\..*).*)",
};
