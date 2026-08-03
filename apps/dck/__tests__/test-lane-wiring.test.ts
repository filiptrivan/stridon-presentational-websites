import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Holds the two-lane split (repo CLAUDE.md → "Tests") to the only thing that actually separates the
 * lanes: a filename. `pnpm test` excludes `*.integration.test.ts` via a CLI glob in each workspace's
 * script, and `pnpm test:integration` selects them back. Nothing but the assertions below stops a
 * new file from landing in the wrong lane — or in no lane at all.
 *
 * The second failure is the quiet one. `turbo test:integration` resolves a package that doesn't
 * define the script to `<NONEXISTENT>` and skips it without an error, so an integration test added
 * to a package with no integration lane runs nowhere — while `api-contract-coverage.test.ts` still
 * counts it as coverage, since its COVERED_PATHSPEC matches on filename alone. That combination
 * turns the ledger into a false all-clear for exactly the outage class it exists to catch.
 *
 * Lives in dck for the same reason the API ledger does: it scans the whole monorepo, and one
 * repo-wide check beats one per package that drift.
 */

const REPO_ROOT = resolve(__dirname, "../../..");
/** The exact glob each workspace's `test` script must pass to `vitest --exclude`. */
const EXCLUDE_GLOB = "**/*.integration.test.ts";
/** Same set, as a git pathspec — git's `*` crosses `/`, so this matches at any depth. */
const INTEGRATION_PATHSPEC = ["*.integration.test.ts"];

/** Mirrors pnpm-workspace.yaml — a new workspace glob there needs a matching entry here. */
const WORKSPACE_MANIFESTS = ["apps/*/package.json", "packages/*/package.json"];

function gitLsFiles(pathspec: string[]): string[] {
  return execFileSync("git", ["ls-files", ...pathspec], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
}

function scriptsOf(packageDir: string): Record<string, string> {
  const manifest: { scripts?: Record<string, string> } = JSON.parse(
    readFileSync(resolve(REPO_ROOT, packageDir, "package.json"), "utf8"),
  );
  return manifest.scripts ?? {};
}

/** Nearest ancestor of `file` holding a package.json, so this survives a move out of `__tests__/`. */
function packageDirOf(file: string): string {
  let dir = dirname(file);
  while (dir !== "." && !existsSync(resolve(REPO_ROOT, dir, "package.json"))) {
    dir = dirname(dir);
  }
  return dir;
}

const workspaceDirs = gitLsFiles(WORKSPACE_MANIFESTS).map(dirname);

describe("test lane wiring", () => {
  it("every package holding an integration test defines a test:integration script", () => {
    const packagesWithIntegrationTests = [
      ...new Set(gitLsFiles(INTEGRATION_PATHSPEC).map(packageDirOf)),
    ];

    const runNowhere = packagesWithIntegrationTests.filter(
      (dir) => !scriptsOf(dir)["test:integration"],
    );

    expect(
      runNowhere,
      `These packages hold *.integration.test.ts files but define no test:integration script: ` +
        `${runNowhere.join(", ")}. turbo skips the missing task silently, so those tests run in ` +
        `no lane while still counting as coverage in api-contract-coverage.test.ts. Add ` +
        `"test:integration": "vitest run integration.test" to each.`,
    ).toEqual([]);
  });

  it("every vitest test script keeps integration specs out of the hermetic lane", () => {
    const leaking = workspaceDirs.filter((dir) => {
      const scripts = scriptsOf(dir);
      return ["test", "test:watch"].some(
        (name) =>
          scripts[name]?.includes("vitest") &&
          !scripts[name].includes(EXCLUDE_GLOB),
      );
    });

    expect(
      leaking,
      `These packages run vitest without --exclude "${EXCLUDE_GLOB}" in test or test:watch: ` +
        `${leaking.join(", ")}. That puts live, key-requiring specs back into the lane everyone ` +
        `runs — the regression this guard exists for.`,
    ).toEqual([]);
  });
});
