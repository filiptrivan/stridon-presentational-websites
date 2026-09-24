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
 *
 * The params are load-bearing on Next 16.1. A catch-all that throws `notFound()`
 * without reading them is prerendered as one static shell whose router tree
 * carries a placeholder (`%%drp:rest:...%%`) where the URL belongs, so the
 * client cannot match it and shows global-error instead of the 404, in
 * production only. Reading them makes an unknown URL render per request with
 * the real path, the way `/brendovi/[slug]` does. Next fixed the underlying
 * notFound prerender in 16.3.0-canary.30 (vercel/next.js#94037).
 *
 * Reading params under Cache Components needs `generateStaticParams` to return
 * at least one value. There is no real one here, so it returns a placeholder,
 * which is the pattern the Next docs give for exactly this case ("return a
 * placeholder param ... then handle it in your page with notFound()",
 * generate-static-params, "With Cache Components").
 */
export function generateStaticParams() {
  return [{ rest: ["__placeholder__"] }];
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  await params;
  notFound();
}
