import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Holds the full-SSR model (repo CLAUDE.md → "Rendering: full SSR, no `cacheComponents`") to the
 * few lines that would quietly undo it. Every one of them builds green and looks fine with
 * JavaScript on; what breaks is the HTML a crawler or a no-JS visitor gets, which no other test
 * reads. That is how dck and sg-tools shipped skeletons instead of content until 2026-10.
 *
 * Source-level only, so it runs in the hermetic lane in milliseconds. A check of the built HTML
 * sees only prerendered pages: the dynamic ones (/proizvodi, category and tag pages) have no HTML
 * after `next build`, so for a Suspense boundary or a client-only render there, this is the guard.
 *
 * Lives in dck for the same reason the API ledger does: it scans the whole monorepo.
 */

const REPO_ROOT = resolve(__dirname, "../../..");

function gitLsFiles(pathspec: string[]): string[] {
  return execFileSync("git", ["ls-files", ...pathspec], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    // The index still lists a file deleted but not staged; reading it would fail the
    // whole suite with an ENOENT that says nothing about SSR.
    .filter((file) => existsSync(resolve(REPO_ROOT, file)));
}

const read = (file: string) => readFileSync(resolve(REPO_ROOT, file), "utf8");

const nextConfigs = gitLsFiles(["apps/*/next.config.ts"]);

/** App and package source, tests excluded (their messages quote the patterns they ban). */
const sources = gitLsFiles(["apps/*.ts", "apps/*.tsx", "packages/*.ts", "packages/*.tsx"]).filter(
  (file) => !/(^|\/)__tests__\/|\.test\.tsx?$/.test(file),
);

describe("full SSR guard", () => {
  it("finds the three app configs", () => {
    // A renamed or moved config would otherwise make every check below pass vacuously.
    expect(nextConfigs).toHaveLength(3);
  });

  it("no app turns cacheComponents back on", () => {
    const offenders = nextConfigs.filter((file) =>
      /^\s*cacheComponents\s*:/m.test(read(file)),
    );
    expect(
      offenders,
      `cacheComponents is set in ${offenders.join(", ")}. It brings back the PPR shell and ` +
        `streamed segments that left the sites empty without JavaScript.`,
    ).toEqual([]);
  });

  it('no source file uses a "use cache" directive', () => {
    const directive = /^\s*["']use cache(?::\s*[\w-]+)?["'];?\s*$/m;
    const offenders = gitLsFiles([
      "apps/*.ts",
      "apps/*.tsx",
      "packages/*.ts",
      "packages/*.tsx",
    ]).filter((file) => directive.test(read(file)));
    expect(
      offenders,
      `"use cache" in ${offenders.join(", ")}. Without cacheComponents it fails the build on ` +
        `16.1, and on Vercel it is one instance's memory. Cache through apiFetch's fetch policy.`,
    ).toEqual([]);
  });

  it("no route has a loading.tsx", () => {
    const offenders = gitLsFiles(["apps/*/app/**"]).filter((file) =>
      /^loading\.(tsx|ts|jsx|js)$/.test(basename(file)),
    );
    expect(
      offenders,
      `${offenders.join(", ")}: a loading file wraps the page in Suspense, so its content is ` +
        `sent hidden and only JavaScript reveals it, and a missing entity answers 200.`,
    ).toEqual([]);
  });

  it("no content waits behind <Suspense> or renders only in the browser", () => {
    // Suspense may wrap only something with no content (repo CLAUDE.md → Rendering). None
    // does today; such a file goes here with its reason.
    const suspenseAllowed: string[] = [];
    // `dynamic(..., { ssr: false })` leaves its component out of the HTML. These are maps
    // and the media lightbox, which carry no content.
    const clientOnlyAllowed = [
      "packages/shared/src/components/contact/contact-locations.tsx",
      "packages/shared/src/components/products/product-gallery.tsx",
      "packages/shared/src/components/where-to-buy/where-to-buy-content.tsx",
    ];
    // <Suspense> or <React.Suspense> in JSX, or Suspense imported from react under any name.
    const usesSuspense =
      /<(?:React\.)?Suspense\b|import\s+(?:\w+\s*,\s*)?\{[^}]*\bSuspense\b[^}]*\}\s*from\s*["']react["']/;
    const suspense = sources.filter(
      (file) => !suspenseAllowed.includes(file) && usesSuspense.test(read(file)),
    );
    const clientOnly = sources.filter(
      (file) => !clientOnlyAllowed.includes(file) && /\bssr:\s*false\b/.test(read(file)),
    );
    expect(
      suspense,
      `Suspense in ${suspense.join(", ")}. React 19.2 sends a finished boundary over 500 B as a ` +
        `hidden <div> that only JavaScript reveals, and on a dynamic route no other check sees it.`,
    ).toEqual([]);
    expect(
      clientOnly,
      `ssr: false in ${clientOnly.join(", ")}: that component is missing from the HTML. Only a ` +
        `widget with no content, like a map, belongs on the list above.`,
    ).toEqual([]);
    const stale = clientOnlyAllowed.filter(
      (file) => !sources.includes(file) || !/\bssr:\s*false\b/.test(read(file)),
    );
    expect(stale, `${stale.join(", ")}: no longer uses ssr: false; take it off the list.`).toEqual(
      [],
    );
  });

  it("every app keeps metadata in <head> for every user agent", () => {
    const offenders = nextConfigs.filter(
      (file) => !/^\s*htmlLimitedBots:\s*\/\.\*\/,/m.test(read(file)),
    );
    expect(
      offenders,
      `${offenders.join(", ")} lacks htmlLimitedBots: /.*/. On a dynamic route Next then streams ` +
        `metadata into <body> for Googlebot, and Google reads canonical only from <head>.`,
    ).toEqual([]);
  });

  it("content that animates in is still shown without JavaScript", () => {
    // framer-motion writes `initial` (opacity 0) into the server HTML as an inline
    // style; only the <noscript> stylesheet lifts it, and only on `data-reveal`.
    expect(read("packages/shared/src/components/root-layout.tsx")).toMatch(
      /<noscript>[\s\S]*?<style[\s\S]*?<\/noscript>/,
    );
    expect(read("packages/shared/src/components/root-layout.tsx")).toContain(
      "[data-reveal]{opacity:1!important;transform:none!important}",
    );
    // Every file that animates something in from `initial` marks it; `initial={false}`
    // starts at the end state and hides nothing. Per file: the HTML check after the build
    // sees each element, but only on prerendered pages.
    const decorative = [
      // Two aria-hidden tool images behind the sg-tools hero; nothing to read.
      "apps/sg-tools/components/hero-decorations.tsx",
    ];
    const unmarked = sources.filter(
      (file) =>
        !decorative.includes(file) &&
        /from\s+["'](?:framer-motion|motion\/react(?:-client)?)["']/.test(read(file)) &&
        /\binitial=(?!\{false\})/.test(read(file)) &&
        !/\bdata-reveal\b/.test(read(file)),
    );
    expect(
      unmarked,
      `${unmarked.join(", ")}: a motion element that starts hidden needs data-reveal, or it stays ` +
        `at opacity 0 with JS off.`,
    ).toEqual([]);
  });

  it("stridon enables root params while Next is below 16.3", () => {
    const { dependencies } = JSON.parse(read("apps/stridon/package.json")) as {
      dependencies: Record<string, string>;
    };
    const [major, minor] = dependencies.next
      .replace(/^[^\d]*/, "")
      .split(".")
      .map(Number);
    if (major > 16 || (major === 16 && minor >= 3)) return;

    expect(
      read("apps/stridon/next.config.ts"),
      "packages/i18n reads the locale through next/root-params, which on Next < 16.3 needs " +
        "experimental.rootParams now that cacheComponents no longer switches it on.",
    ).toMatch(/^\s*rootParams:\s*true,/m);
  });
});
