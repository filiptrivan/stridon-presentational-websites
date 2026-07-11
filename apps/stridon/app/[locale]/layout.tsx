import { getBrandConfig } from "@brand/config";
import { createRootMetadata } from "@brand/shared/lib/metadata";
import { cn } from "@brand/shared/lib/utils";
import { Toaster } from "@brand/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { base, heading } from "@/constants/fonts";
import "../globals.css";

const brand = getBrandConfig();

export const metadata = createRootMetadata();

export const viewport: Viewport = {
  themeColor: brand.themeColor,
  colorScheme: brand.colorScheme,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={cn(
          "min-h-screen text-foreground font-base antialiased",
          brand.bodyClassName,
          base.variable,
          heading.variable,
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: brand.brandName,
              url: brand.siteUrl,
              logo: `${brand.siteUrl}${brand.logoSrc}`,
            }),
          }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
