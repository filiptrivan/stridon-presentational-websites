import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Every PACMS endpoint these sites call must either be exercised by an integration test or be
 * listed below as acknowledged debt.
 *
 * Why this exists: on 2026-07-29 a PACMS dependency bump changed the *semantics* of
 * SubmitWarrantyRegistration — same route, same payload shape — and broke DCK's only write path
 * for ~16 hours. No diff-inspecting guard could have seen it: PACMS's storefront controller was
 * byte-identical. The only thing that catches that class is executing the call. So the unit of
 * protection is "a call this repo really makes", and the job of this test is to make sure no such
 * call is silently unprotected.
 *
 * It lives in dck but scans the whole monorepo: the API contract is repo-wide, and sg-tools calls
 * the same backend. Keeping one ledger beats two that drift.
 */

const REPO_ROOT = resolve(__dirname, "../../..");
const ENDPOINT_PATTERN = /api\/Storefront\/([A-Za-z]+)/g;

/**
 * Endpoints called in app code but not yet exercised by an integration test.
 *
 * This is a DEBT LEDGER, not a config knob. Adding an entry is a decision that a contract break on
 * that endpoint will be discovered by a user rather than by CI; deleting one (by writing the test)
 * is always the better move. It is seeded with the state as of 2026-07-29 so the check can ship
 * without a 13-endpoint red build — not because that state is acceptable.
 *
 * All of these are reads. A read breaking degrades a page; the write path (warranty) is covered
 * because that is where a break loses customer data outright.
 */
const ACKNOWLEDGED_UNCOVERED = new Set([
  "CategoryBySlug",
  "FlatCategories",
  "PrerenderedTagSlugs",
  "ProductsAutocompleteByBrand",
  "SitemapProductsByBrand",
  "SitemapTags",
  "TagBySlug",
  "TopProductsByBrand",
]);

/** Endpoint names appearing in files matched by `pathspec`, via git so ignored files can't leak in. */
function endpointsIn(pathspec: string[]): Set<string> {
  const files = execFileSync("git", ["ls-files", ...pathspec], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);

  const found = new Set<string>();
  for (const file of files) {
    const content = readFileSync(resolve(REPO_ROOT, file), "utf8");
    for (const [, name] of content.matchAll(ENDPOINT_PATTERN)) found.add(name);
  }
  return found;
}

// Scanned once: endpointsIn spawns `git ls-files` and reads every match (~200 files), and both
// tests need the same two sets. Computing them at module scope also means the two checks can never
// disagree about what "called" means — a pathspec added to one copy and not the other would have
// made the staleness check silently authoritative over a different file set.
const COVERED_PATHSPEC = ["apps/*/__tests__/*.integration.test.ts"];
const CALLED_PATHSPEC = [
  "apps/*/app/**",
  "apps/*/lib/**",
  "apps/*/components/**",
  "packages/**",
  ":(exclude)**/*.test.ts",
  ":(exclude)**/*.test.tsx",
];

// Derived, not hand-listed: writing an integration test for an endpoint drops it out of the ledger
// requirement automatically, so the two can never disagree.
const covered = endpointsIn(COVERED_PATHSPEC);
const called = endpointsIn(CALLED_PATHSPEC);

describe("PACMS API contract coverage", () => {
  it("every endpoint the apps call is integration-tested or acknowledged as debt", () => {
    const unprotected = [...called].filter(
      (name) => !covered.has(name) && !ACKNOWLEDGED_UNCOVERED.has(name),
    );

    expect(
      unprotected,
      `These PACMS endpoints are called but neither integration-tested nor acknowledged: ` +
        `${unprotected.join(", ")}. Write an integration test (preferred), or add the name to ` +
        `ACKNOWLEDGED_UNCOVERED and accept that a contract break there reaches users first.`,
    ).toEqual([]);
  });

  it("the debt ledger has no stale entries", () => {
    // An entry that is no longer called, or that has since gained a test, is noise that makes the
    // ledger look worse than reality — and noise is how a ledger stops being read.
    const stale = [...ACKNOWLEDGED_UNCOVERED].filter(
      (name) => !called.has(name) || covered.has(name),
    );

    expect(
      stale,
      `ACKNOWLEDGED_UNCOVERED lists endpoints that are no longer called, or that now have an ` +
        `integration test: ${stale.join(", ")}. Remove them.`,
    ).toEqual([]);
  });
});
