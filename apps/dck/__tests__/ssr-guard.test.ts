import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Holds the full-SSR model (repo CLAUDE.md → "Rendering: full SSR, no `cacheComponents`") to the
 * few lines that would quietly undo it. Every one of them builds green and looks fine with
 * JavaScript on; what breaks is the HTML a crawler or a no-JS visitor gets, which no other test
 * reads. That is how all three sites shipped skeletons instead of content until 2026-10.
 *
 * Source-level only, so it runs in the hermetic lane in milliseconds. It cannot see a Suspense
 * boundary around content; the HTML check after `next build` is where that is caught.
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
    .filter(Boolean);
}

const read = (file: string) => readFileSync(resolve(REPO_ROOT, file), "utf8");

const nextConfigs = gitLsFiles(["apps/*/next.config.ts"]);

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
