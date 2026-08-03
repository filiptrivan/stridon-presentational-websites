// Latency budget for server-side backend reads. Kept free of Next and brand
// config imports so it stays unit-testable on its own, and so api.ts can import
// it without a cycle.
//
// Why this exists: apiFetch had no timeout at all, so a stalled backend held the
// Vercel lambda until Cloudflare gave up at ~100s. That is the shape of every
// 522/524 these two sites have ever filed (all of them the 2026-07-17 backend
// boot wedge — pa-cms docs/incidents/2026-07-17-backend-boot-wedge.md). The wedge
// itself is fixed upstream, and the Caddy readiness health check now holds traffic
// off a cold container, so this is defense-in-depth for the shape that gate cannot
// see: a backend that is up, readiness-green, and slow.

// Two tiers, and apiFetch takes the tier as a REQUIRED argument — an optional one
// with a default would quietly make every new fetcher critical.
//
// - "critical": the entity a route is about (product / category / tag by slug).
//   Without it the page cannot render, so failing is honest — but bounded.
// - "auxiliary": everything else — listings, chrome taxonomy, sitemap rows, build
//   inputs. Never allowed to hang a render; the section degrades into its
//   SectionErrorBoundary instead of the whole page waiting.
export type FetchTier = "critical" | "auxiliary";

// Inherited from pa-storefront's measured policy rather than re-derived: it is the
// same backend, from the same Vercel region (fra1 → Hetzner nbg1). Sized just above
// a healthy backend's cold read, NOT to outlast a stall — surviving an outage is
// stale-serving's job, not the timeout's. Measured 2026-08-03, the endpoints behind
// the old 524s answer in 50-285ms, so the headroom here is large.
const TIER_BUDGET_MS: Record<FetchTier, number> = {
  critical: 4_000,
  auxiliary: 2_500,
};

// A build prerenders every category and tag against a possibly-cold backend, and a
// dev machine reaches the same EU API over a home connection with no CDN in front.
// Both legitimately outrun a serve budget, and a false timeout in either place is
// worse than no timeout: it reds a build or sends a developer chasing a phantom.
// apps/*/next.config.ts already carries staticGenerationRetryCount for the build
// case, which is the same blip seen from the other side.
const LIFTED_BUDGET_MS = 60_000;

// Read at call time, never captured at module load: a build and a serve run the
// same bundle, so a value frozen at import would carry the build budget into the
// lambda. CI covers the Vercel build, where NEXT_PHASE is not set for us.
function isLiftedPhase(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    Boolean(process.env.CI) ||
    process.env.NODE_ENV === "development"
  );
}

export function budgetMsFor(tier: FetchTier): number {
  if (isLiftedPhase()) return LIFTED_BUDGET_MS;
  return TIER_BUDGET_MS[tier];
}

// Deliberately NOT copied from pa-storefront: its per-tier retry (critical retries
// once, auxiliary never). It buys riding out a sub-second blip, at the cost of a
// backoff loop and a retry-storm vector; these sites are almost entirely prerendered
// and ISR-served, so a failed revalidation already degrades to serving the previous
// complete page. Add it only with a measured reason.
