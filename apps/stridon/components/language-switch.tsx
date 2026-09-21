"use client";

import { getPathname, usePathname } from "@/i18n/navigation";
import type { Locale } from "@brand/i18n/config";
import Link from "next/link";
import { useParams } from "next/navigation";

interface LanguageSwitchProps {
  /** The locale being rendered; the switch always points at the other one. */
  locale: Locale;
  label: string;
}

/**
 * The navbar's language toggle.
 *
 * A real link rather than a click handler that pushes a route: it is crawlable,
 * it works with JavaScript off, and a reader can open the other language in a
 * new tab. `usePathname` here is next-intl's, so it returns the internal route
 * (`/brendovi/[slug]`) rather than the rendered URL, and `useParams` fills the
 * dynamic segments back in - which is what keeps the switch on the same page
 * instead of dropping everyone on the homepage.
 *
 * `getPathname` with a plain `next/link` rather than next-intl's `Link` with a
 * `locale` prop: that prop always emits a prefix, even for the default locale,
 * so switching back to Serbian would link to `/sr/brendovi/dewalt` and rely on
 * a redirect. The prefix exists to update the locale cookie, and this site does
 * not set one, so it buys nothing and costs a round trip on every switch.
 */
const LanguageSwitch = ({ locale, label }: LanguageSwitchProps) => {
  const pathname = usePathname();
  const params = useParams();
  const target: Locale = locale === "sr" ? "en" : "sr";

  const href = getPathname({
    // The pathname and the params of the route being rendered always match,
    // but nothing in the type system can know that.
    // @ts-expect-error -- params are the current route's by construction
    href: { pathname, params },
    locale: target,
  });

  return (
    <Link
      href={href}
      hrefLang={target}
      aria-label={label}
      className="flex items-center justify-center rounded-md p-1 transition-colors hover:bg-accent"
    >
      <span className="flex h-6 w-7 items-center justify-center">
        {target === "en" ? <UnionJack /> : <SerbianFlag />}
      </span>
    </Link>
  );
};

const UnionJack = () => (
  <svg viewBox="0 0 60 30" aria-hidden className="h-3.5 w-7 shrink-0">
    <clipPath id="union-jack-clip">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#00247d" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path
      d="M0,0 L60,30 M60,0 L0,30"
      clipPath="url(#union-jack-clip)"
      stroke="#cf142b"
      strokeWidth="4"
    />
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6" />
  </svg>
);

const SerbianFlag = () => (
  <svg viewBox="0 0 60 30" aria-hidden className="h-3.5 w-7 shrink-0">
    <path d="M0,0 h60 v10 h-60 z" fill="#c6363c" />
    <path d="M0,10 h60 v10 h-60 z" fill="#0c4076" />
    <path d="M0,20 h60 v10 h-60 z" fill="#fff" />
  </svg>
);

export default LanguageSwitch;
