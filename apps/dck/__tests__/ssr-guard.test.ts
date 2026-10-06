import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { CLIENT_ONLY_ALLOWED } from "../../../scripts/client-only-allowed.mjs";

/**
 * Holds the full-SSR model (repo CLAUDE.md → "Rendering: full SSR, no `cacheComponents`") to the
 * few lines that would quietly undo it. Every one of them builds green and looks fine with
 * JavaScript on; what breaks is the HTML a crawler or a no-JS visitor gets, which no other test
 * reads.
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
/** The base every config spreads (repo CLAUDE.md → Rendering). */
const BASE_NEXT_CONFIG = "packages/brand-config/src/next-config.ts";

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
    // `cacheComponents: true`, the `cacheComponents,` shorthand, or nested under experimental.
    const offenders = [...nextConfigs, BASE_NEXT_CONFIG].filter((file) =>
      /\bcacheComponents\s*[:,}]/.test(read(file)),
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
    // `dynamic(..., { ssr: false })` leaves its component out of the HTML. The files that may,
    // each with its reason, are listed once for this test and the HTML check after the build.
    const clientOnlyAllowed = Object.keys(CLIENT_ONLY_ALLOWED);
    // <Suspense> or <React.Suspense> in JSX, or Suspense imported from react under any name.
    const usesSuspense =
      /<(?:React\.)?Suspense\b|import\s+(?:\w+\s*,\s*)?\{[^}]*\bSuspense\b[^}]*\}\s*from\s*["']react["']/;
    // next/dynamic, or React.lazy called or imported under any name. With `ssr: false` the
    // component is missing from the HTML, and next/dynamic with a `loading` fallback wraps it
    // in Suspense even with SSR on (next/dist/shared/lib/lazy-dynamic/loadable.js).
    const defersRender =
      /from\s*["']next\/dynamic["']|\blazy\s*\(|import\s+(?:\w+\s*,\s*)?\{[^}]*\blazy\b[^}]*\}\s*from\s*["']react["']/;
    const suspense = sources.filter(
      (file) => !suspenseAllowed.includes(file) && usesSuspense.test(read(file)),
    );
    const deferred = sources.filter(
      (file) => !clientOnlyAllowed.includes(file) && defersRender.test(read(file)),
    );
    expect(
      suspense,
      `Suspense in ${suspense.join(", ")}. On a page past ~12.8 KB, React 19.2 sends a ` +
        `finished boundary over ~500 B as a hidden <div> that only JavaScript reveals, and ` +
        `on a dynamic route no other check sees it.`,
    ).toEqual([]);
    expect(
      deferred,
      `next/dynamic or React.lazy in ${deferred.join(", ")}: with ssr: false that component is ` +
        `missing from the HTML, and with a loading fallback it waits behind Suspense. Only a ` +
        `widget with no content, like a map, belongs on CLIENT_ONLY_ALLOWED in ` +
        `scripts/client-only-allowed.mjs.`,
    ).toEqual([]);
    const stale = clientOnlyAllowed.filter(
      (file) => !sources.includes(file) || !/\bssr:\s*false\b/.test(read(file)),
    );
    expect(
      stale,
      `${stale.join(", ")}: no longer uses ssr: false; take it off CLIENT_ONLY_ALLOWED.`,
    ).toEqual([]);
  });

  it("every app keeps metadata in <head> for every user agent", () => {
    const why =
      "On a dynamic route Next then streams metadata into <body> for Googlebot, and Google " +
      "reads canonical only from <head>.";
    expect(read(BASE_NEXT_CONFIG), `${BASE_NEXT_CONFIG} lacks htmlLimitedBots: /.*/. ${why}`).toMatch(
      /^\s*htmlLimitedBots:\s*\/\.\*\/,/m,
    );
    const offenders = nextConfigs.filter(
      (file) => !/\bbaseNextConfig\b/.test(read(file)) || /\bhtmlLimitedBots\b/.test(read(file)),
    );
    expect(
      offenders,
      `${offenders.join(", ")} does not build on baseNextConfig or sets its own htmlLimitedBots. ${why}`,
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
        "experimental.rootParams.",
    ).toMatch(/^\s*rootParams:\s*true,/m);
  });
});
