import RootLayout from "@brand/shared/components/root-layout";
import {
  COMPANY_FOOTER_LINKS,
  LEGAL_LINKS,
  NAV_LINKS,
  PRODUCTS_FOOTER_LINKS,
  SOCIAL_LINKS,
} from "@/constants/links";
import { routing } from "@/i18n/routing";
import { HREFLANG, type Locale } from "@brand/i18n/config";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";

export { metadata, viewport } from "@brand/shared/components/root-layout";

// Both locales are prerendered at build time. This is the whole point of
// reading the locale from a root param instead of a cookie or a header: the
// language is part of the route, so nothing about a translated page has to be
// resolved per request.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Both subsets of both families, because Serbian copy mixes plain latin with
// č ć ž š đ on every page — the latin-ext file is never optional here. Without
// next/font nothing preloads these, so the browser would only discover them
// after it has parsed globals.css.
const FONT_FILES = [
  "/fonts/inter-latin.woff2",
  "/fonts/inter-latinext.woff2",
  "/fonts/spacegrotesk-latin.woff2",
  "/fonts/spacegrotesk-latinext.woff2",
];

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Fonts are self-hosted via @font-face in globals.css (no next/font), so no
  // font className is injected here.
  return (
    <RootLayout
      lang={HREFLANG[locale as Locale]}
      fontClassNames=""
      navLinks={NAV_LINKS}
      productLinks={PRODUCTS_FOOTER_LINKS}
      companyLinks={COMPANY_FOOTER_LINKS}
      legalLinks={LEGAL_LINKS}
      socialLinks={SOCIAL_LINKS}
      showCategoryMenu={false}
      showLanguageSwitch
    >
      {FONT_FILES.map((href) => (
        <link
          key={href}
          rel="preload"
          href={href}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      {/* Only the page content needs the client provider: everything outside it
          (navbar, footer, toaster) takes its text as props from this app, which
          is how @brand/shared stays free of an i18n dependency the other two
          sites do not have. */}
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
    </RootLayout>
  );
}
