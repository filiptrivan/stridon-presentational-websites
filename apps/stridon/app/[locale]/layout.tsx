import LanguageSwitch from "@/components/language-switch";
import { base, heading } from "@/constants/fonts";
import {
  COMPANY_FOOTER_LINKS,
  LEGAL_LINKS,
  NAV_LINKS,
  PRODUCTS_FOOTER_LINKS,
  SOCIAL_LINKS,
  type FooterLinkKey,
} from "@/constants/links";
import { pathFor, resolveLinks } from "@/lib/nav";
import { routing } from "@/i18n/routing";
import { HREFLANG } from "@brand/i18n/config";
import { getBrandConfig } from "@brand/config";
import RootLayout from "@brand/shared/components/root-layout";
import { createRootMetadata } from "@brand/shared/lib/metadata";
import { buildOgImageUrl, OG_SIZE } from "@brand/shared/lib/og/utils";
import { cn } from "@brand/shared/lib/utils";
import { getPathname } from "@/i18n/navigation";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";

export { viewport } from "@brand/shared/components/root-layout";

const { siteName } = getBrandConfig();

// Both locales are prerendered at build time. This is the whole point of
// reading the locale from a root param instead of a cookie or a header: the
// language is part of the route, so nothing about a translated page has to be
// resolved per request.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Site" });

  // The shared builder is static and hardcodes `canonical: "/"`, which would
  // make the English homepage declare the Serbian one as its canonical. Take
  // its icons, OG image and title template, then say where this locale lives.
  const base = createRootMetadata();

  const title = t("defaultTitle");
  const description = t("description");
  const canonical = getPathname({ href: "/", locale });

  // `Site.defaultTitle` is the whole `<title>`, brand suffix included, because
  // it is the `default` and `template` never applies to it. The OG card is the
  // one place that suffix is wrong: the logo sits directly above the headline,
  // so "| Stridon Group" repeats the artwork and costs the title a second line.
  const suffix = ` | ${siteName}`;
  const cardTitle = title.endsWith(suffix)
    ? title.slice(0, -suffix.length)
    : title;
  const cardUrl = buildOgImageUrl({
    type: "default",
    title: cardTitle,
    description,
  });
  const cardImage = {
    url: cardUrl,
    width: OG_SIZE.width,
    height: OG_SIZE.height,
    alt: siteName,
  };

  return {
    ...base,
    title: { default: title, template: `%s | ${siteName}` },
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        routing.locales.map((other) => [
          HREFLANG[other],
          getPathname({ href: "/", locale: other }),
        ]),
      ),
    },
    openGraph: {
      ...base.openGraph,
      // Facebook and LinkedIn treat `og:url` as the share's canonical, which
      // is what consolidates a link shared with tracking params onto one
      // entry. Relative: Next resolves it against `metadataBase`.
      url: canonical,
      locale: locale === "sr" ? "sr_RS" : "en_US",
      images: [cardImage],
    },
    twitter: { ...base.twitter, images: [{ url: cardUrl, alt: siteName }] },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const [nav, footer, common, messages] = await Promise.all([
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Footer" }),
    getTranslations({ locale, namespace: "Common" }),
    getMessages({ locale }),
  ]);

  // Only the namespaces a client component reads. Left alone the provider
  // inherits the whole catalog and serialises it into the flight payload of
  // every page: on /servis that is both legal documents, ~9.9 kB of text that
  // page never renders. Exactly two client components call `useTranslations` -
  // `error.tsx` ("Error") and `b2b-form.tsx` ("B2b.form") - and @brand/shared
  // has no next-intl import at all, so nothing else can need a namespace.
  // Whole namespaces rather than "B2b.form" keeps the rule simple: a new
  // client `useTranslations("X")` means adding X here, or it throws.
  const clientMessages = {
    Error: messages.Error,
    B2b: messages.B2b,
  };

  const footerLinkLabel = (key: FooterLinkKey) => footer(`links.${key}`);

  return (
    <RootLayout
      lang={HREFLANG[locale]}
      fontClassNames={cn(base.variable, heading.variable)}
      navLinks={resolveLinks(NAV_LINKS, locale, nav)}
      productLinks={resolveLinks(
        PRODUCTS_FOOTER_LINKS,
        locale,
        footerLinkLabel,
      )}
      companyLinks={resolveLinks(
        COMPANY_FOOTER_LINKS,
        locale,
        footerLinkLabel,
      )}
      legalLinks={resolveLinks(LEGAL_LINKS, locale, footerLinkLabel)}
      socialLinks={SOCIAL_LINKS}
      showCategoryMenu={false}
      languageSwitch={
        // The switch sits in the navbar, which @brand/shared renders outside
        // the provider below, and next-intl's `usePathname` needs a locale in
        // context to map the rendered URL back to the internal route. Its own
        // provider, with an empty catalog, gives it exactly that and nothing
        // else - its one string arrives as a prop.
        <NextIntlClientProvider locale={locale} messages={{}}>
          <LanguageSwitch
            locale={locale}
            label={common("switchLanguage")}
          />
        </NextIntlClientProvider>
      }
      navbarLabels={{ headerCta: nav("headerCta") }}
      mobileLabels={{
        menu: nav("menu"),
        menuDescription: nav("menuDescription"),
        headerCta: nav("headerCta"),
      }}
      footerLabels={{
        newsletterTitle: footer("newsletterTitle"),
        newsletterDescription: footer("newsletterDescription"),
        products: footer("products"),
        company: footer("company"),
      }}
      newsletterLabels={{
        placeholder: footer("newsletter.placeholder"),
        submit: footer("newsletter.submit"),
        submitting: footer("newsletter.submitting"),
        success: footer("newsletter.success"),
      }}
      footerTagline={footer("tagline")}
      // brand-config spells both of these in Serbian and cannot vary by locale.
      headerCtaHref={pathFor("/b2b", locale)}
      homeHref={pathFor("/", locale)}
    >
      {/* Only the page content needs the client provider: everything outside it
          (navbar, footer, toaster) takes its text as props from this app, which
          is how @brand/shared stays free of an i18n dependency the other two
          sites do not have. */}
      <NextIntlClientProvider messages={clientMessages}>
        {children}
      </NextIntlClientProvider>
    </RootLayout>
  );
}
