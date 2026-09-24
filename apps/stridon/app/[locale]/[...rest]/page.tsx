import { notFound } from "next/navigation";

/**
 * Next sends an unmatched URL to the ROOT `app/not-found.tsx`, and this app has
 * none: the root layout is `app/[locale]/layout.tsx`, because `locale` has to be
 * a root param for `next/root-params` to read it. A nested `not-found.tsx` only
 * covers a `notFound()` thrown inside its own segment, so without this catch-all
 * every unknown URL falls through to Next's own unstyled 404 instead of
 * `[locale]/not-found.tsx`. This is next-intl's prescribed shape for a root
 * layout that lives under `[locale]`.
 *
 * It sits below every static route, so it changes nothing for a page that
 * exists. It cannot cover a path the proxy skips (anything with a dot); that
 * would need `globalNotFound`, which renders without this layout.
 */
export default function CatchAllPage() {
  notFound();
}
