import type { NavLinkDef } from "@/constants/links";
import { getPathname } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import type { Locale } from "@brand/i18n/config";

/**
 * The URL a route has in a given locale: `/o-nama` in Serbian, `/en/about` in
 * English.
 *
 * Everything that hands a path to a `@brand/shared` component goes through here.
 * Those components link with plain `next/link`, which knows nothing about
 * locales, so an unconverted `/brendovi` inside the English site would send the
 * reader back to the Serbian page. Keeping the conversion here rather than
 * teaching the shared package about routing is what lets dck and sg-tools stay
 * exactly as they are.
 */
export function pathFor(href: StaticPathname, locale: Locale): string {
  return getPathname({ href, locale });
}

export function brandPath(slug: string, locale: Locale): string {
  return getPathname({
    href: { pathname: "/brendovi/[slug]", params: { slug } },
    locale,
  });
}

export interface ResolvedLink {
  label: string;
  href: string;
  external?: boolean;
}

/** Turns the label-free link definitions in `constants/links.ts` into what the
    shared navbar and footer render. */
export function resolveLinks<K extends string>(
  defs: readonly NavLinkDef<K>[],
  locale: Locale,
  t: (key: K) => string,
): ResolvedLink[] {
  return defs.map((def) => ({
    label: t(def.key),
    href: def.external
      ? (def.href as string)
      : pathFor(def.href as StaticPathname, locale),
    external: def.external,
  }));
}
