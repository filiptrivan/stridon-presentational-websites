import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { assertStaticHtml, DYNAMIC_PAGES } from "../../../scripts/assert-static-html.mjs";
import { CLIENT_ONLY_ALLOWED } from "../../../scripts/client-only-allowed.mjs";

/**
 * Trips each check of scripts/assert-static-html.mjs on a fake dck `.next/` in a temp directory:
 * the clean build passes, and every case breaks it in one way and expects that one cause. Nothing
 * is built and nothing leaves the machine, so it runs in the hermetic lane.
 *
 * Lives in dck for the same reason ssr-guard.test.ts does: the script belongs to no package.
 */

const REPO_ROOT = resolve(__dirname, "../../..");
const SCRIPT = join(REPO_ROOT, "scripts", "assert-static-html.mjs");
const tmp = mkdtempSync(join(tmpdir(), "assert-static-html-"));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

/** The part of a build the script reads. */
interface Build {
  /** app-path-routes-manifest.json: every page, "/o-nama/page" -> "/o-nama". */
  pages: Record<string, string>;
  /** prerender-manifest.json `routes`: what was prerendered, and from which page. */
  prerendered: Record<string, { srcRoute: string; renderingMode?: string; experimentalPPR?: boolean }>;
  /** server/app/**.html, by path. */
  html: Record<string, string>;
}

const page = (body: string) =>
  `<!DOCTYPE html><html><head><title>T</title></head><body>${body}</body></html>`;
const clientRendered = (digest: string) =>
  `<!--$!--><template data-dgst="${digest}"></template><!--/$-->`;

/** dck reduced to one page per kind, every allowed map, and a decoration that starts hidden. */
function cleanBuild(): Build {
  const html: Build["html"] = {
    "index.html": page(
      '<div aria-hidden="true" style="opacity:0;transform:translateX(-80px)"><img alt=""/></div>' +
        "<main>Text</main>",
    ),
  };
  const maps: Record<string, number> = {};
  for (const pages of Object.values(CLIENT_ONLY_ALLOWED)) {
    for (const [file, count] of Object.entries(pages.dck ?? {})) maps[file] = (maps[file] ?? 0) + count;
  }
  for (const [file, count] of Object.entries(maps)) {
    html[file] = page(clientRendered("BAILOUT_TO_CLIENT_SIDE_RENDERING").repeat(count));
  }
  return {
    pages: {
      "/page": "/",
      "/proizvodi/[slug]/page": "/proizvodi/[slug]",
      ...Object.fromEntries(DYNAMIC_PAGES.dck.map((route) => [`${route}/page`, route])),
    },
    prerendered: { "/": { srcRoute: "/" }, "/proizvodi/a": { srcRoute: "/proizvodi/[slug]" } },
    html,
  };
}

let builds = 0;
/** Writes the clean build with one change as `<tmp>/<n>/<app>/.next` and returns `<tmp>/<n>/<app>`. */
function write(change: (build: Build) => void = () => {}, app = "dck") {
  const build = cleanBuild();
  change(build);
  const appDir = join(tmp, String(builds++), app);
  const nextDir = join(appDir, ".next");
  mkdirSync(join(nextDir, "server", "app"), { recursive: true });
  writeFileSync(join(nextDir, "app-path-routes-manifest.json"), JSON.stringify(build.pages));
  writeFileSync(join(nextDir, "prerender-manifest.json"), JSON.stringify({ routes: build.prerendered }));
  for (const [file, content] of Object.entries(build.html)) {
    mkdirSync(dirname(join(nextDir, "server", "app", file)), { recursive: true });
    writeFileSync(join(nextDir, "server", "app", file), content);
  }
  return appDir;
}
const check = (change?: (build: Build) => void, app?: string) =>
  assertStaticHtml(write(change, app)).problems;
const causes = (change?: (build: Build) => void, app?: string) => [...check(change, app).keys()];

describe("assert-static-html", () => {
  it("passes a clean build, an aria-hidden decoration at opacity 0 included", () => {
    expect(causes()).toEqual([]);
  });

  it("fails outside a known app", () => {
    expect(causes(undefined, "shop")).toEqual([expect.stringContaining("unknown app")]);
  });

  it("fails on a partially prerendered route, by its rendering mode or by experimentalPPR", () => {
    for (const mark of [{ renderingMode: "PARTIALLY_STATIC" }, { experimentalPPR: true }]) {
      const result = causes((b) => {
        Object.assign(b.prerendered["/"], mark);
      });
      expect(result, JSON.stringify(mark)).toEqual([expect.stringContaining("partially prerendered")]);
    }
  });

  it("fails on a static page that is not prerendered", () => {
    const result = causes((b) => {
      b.pages["/o-nama/page"] = "/o-nama";
    });
    expect(result).toEqual([expect.stringContaining("not prerendered")]);
  });

  it("fails on a [slug] page with none prerendered (empty generateStaticParams)", () => {
    const result = causes((b) => {
      delete b.prerendered["/proizvodi/a"];
    });
    expect(result).toEqual([expect.stringContaining("no page prerendered")]);
  });

  it("fails on a DYNAMIC_PAGES page that is prerendered", () => {
    const result = causes((b) => {
      b.prerendered["/proizvodi"] = { srcRoute: "/proizvodi" };
    });
    expect(result).toEqual([expect.stringContaining("prerendered, so take it off")]);
  });

  it("fails on a DYNAMIC_PAGES page that does not exist", () => {
    const result = causes((b) => {
      delete b.pages["/proizvodi/page"];
    });
    expect(result).toEqual([expect.stringContaining("no such page")]);
  });

  it("fails on a Suspense fallback, a hidden segment in a table included", () => {
    const result = causes((b) => {
      b.html["index.html"] = page(
        '<table><tbody><!--$?--><template id="B:0"></template><!--/$--></tbody></table>' +
          '<table hidden><tbody id="S:0"><tr><td>Text</td></tr></tbody></table>',
      );
    });
    expect(result).toEqual([expect.stringContaining("Suspense fallback")]);
  });

  it("fails on a client-rendered boundary off the list, such as notFound() inside Suspense", () => {
    const result = causes((b) => {
      b.html["index.html"] = page(clientRendered("NEXT_HTTP_ERROR_FALLBACK;404"));
    });
    expect(result).toEqual([expect.stringContaining("client-rendered boundaries")]);
  });

  it("fails when a listed map is gone, so its count cannot cover a real bailout", () => {
    const result = causes((b) => {
      b.html["gde-kupiti.html"] = page("");
    });
    expect(result).toEqual([expect.stringContaining("client-rendered boundaries")]);
  });

  it("fails when a page with a listed map has no HTML at all", () => {
    const problems = check((b) => {
      delete b.html["gde-kupiti.html"];
    });
    expect([...problems]).toEqual([
      [expect.stringContaining("client-rendered boundaries"), ["gde-kupiti.html has no HTML, expects 1"]],
    ]);
  });

  it("fails on content at opacity 0, and names the cause once for every page", () => {
    const problems = check((b) => {
      b.html["index.html"] = page('<div style="opacity:0;transform:translateY(20px)">Text</div>');
      b.html["o-nama.html"] = page('<div style="opacity:0">Text</div><p style="opacity:0.5">Ok</p>');
    });
    expect([...problems]).toEqual([
      [expect.stringContaining("opacity:0"), ["index.html (1)", "o-nama.html (1)"]],
    ]);
  });

  it("fails on a <title> outside <head>", () => {
    const result = causes((b) => {
      b.html["index.html"] = "<html><head></head><body><title>T</title></body></html>";
    });
    expect(result).toEqual([expect.stringContaining("<title> not in <head>")]);
  });

  it("fails when the build left no HTML", () => {
    const result = causes((b) => {
      b.html = {};
    });
    expect(result).toContainEqual(expect.stringContaining("no HTML"));
  });

  it("exits 1 with the cause when the build runs it, and 0 on a clean build", () => {
    // As each app's `build` script runs it: the script itself, from the app folder.
    const run = (change?: (build: Build) => void) =>
      spawnSync(process.execPath, [SCRIPT], { cwd: write(change), encoding: "utf8" });
    const broken = run((b) => {
      b.html["index.html"] = page('<main style="opacity:0">Text</main>');
    });
    expect(broken.status).toBe(1);
    expect(broken.stderr).toContain("inline opacity:0 on content");
    const clean = run();
    expect(clean.status, clean.stderr).toBe(0);
    expect(clean.stdout).toContain("are clean");
  });

  it("runs in every app's build, on Vercel too", () => {
    // A vercel.json buildCommand wins over the dashboard setting and over a `vercel-build`
    // script, either of which would otherwise skip the check without a word.
    const apps = readdirSync(join(REPO_ROOT, "apps"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    // Every folder in apps/, so a new app cannot skip the check; each needs its DYNAMIC_PAGES entry.
    expect(apps.sort()).toEqual(Object.keys(DYNAMIC_PAGES).sort());
    for (const app of apps) {
      const read = (file: string) =>
        JSON.parse(readFileSync(join(REPO_ROOT, "apps", app, file), "utf8"));
      expect(read("package.json").scripts.build, app).toBe(
        "next build && node ../../scripts/assert-static-html.mjs",
      );
      expect(read("vercel.json").buildCommand, app).toBe("pnpm run build");
    }
  });
});
