// Fails the build when its output hides content from a crawler or a visitor
// without JavaScript in one of the ways named below. Runs from an app directory
// right after `next build` (each app's `build` script, which each vercel.json
// pins as Vercel's build command), reads only `.next/`, makes no network calls
// and takes well under a second. apps/dck/__tests__/assert-static-html.test.ts
// trips each check on a fake `.next/`.
//
// Why after the build and not in a test: every regression it catches builds
// green and looks right with JavaScript on. A Suspense boundary around content
// sends it as a fallback and a hidden segment (React 19.2, static pages
// included), an entrance animation leaves its starting opacity 0 in the HTML,
// cacheComponents brings back the PPR shell, and a static route that starts
// reading a request API silently becomes dynamic. All of it shows in `.next/`
// for prerendered pages. The dynamic ones have no HTML here, so for them
// apps/dck/__tests__/ssr-guard.test.ts checks the source.

import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

import { CLIENT_ONLY_ALLOWED } from "./client-only-allowed.mjs";

// Pages that render per request on purpose: they read searchParams (`?strana=`).
// Every other page must come out of the build prerendered; one that does not
// has turned dynamic, usually through cookies(), headers() or searchParams read
// somewhere in it, and its HTML is no longer checked below.
export const DYNAMIC_PAGES = {
  dck: ["/proizvodi", "/proizvodi/kategorije/[slug]", "/proizvodi/tagovi/[slug]"],
  "sg-tools": ["/proizvodi", "/proizvodi/kategorije/[slug]"],
  stridon: [],
};

// Causes whose fix is a list entry name that list.
const ON_PURPOSE = "only on purpose, then list it on DYNAMIC_PAGES in scripts/assert-static-html.mjs";
const OFF_DYNAMIC = "take it off DYNAMIC_PAGES in scripts/assert-static-html.mjs";
const CLIENT_RENDERED =
  "client-rendered boundaries other than CLIENT_ONLY_ALLOWED in scripts/client-only-allowed.mjs " +
  "(a new ssr: false, or a throw or notFound() inside Suspense)";

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (name.endsWith(".html")) yield path;
  }
}

// Checks `<appDir>/.next` and returns each cause once, with the routes or files it hit.
export function assertStaticHtml(appDir) {
  const app = basename(appDir);
  const nextDir = join(appDir, ".next");
  const problems = new Map();
  const fail = (cause, where) => problems.set(cause, [...(problems.get(cause) ?? []), where]);

  if (!DYNAMIC_PAGES[app]) {
    fail("unknown app (run it from apps/<app>)", app);
    return { checked: 0, problems };
  }

  const readJson = (file) => JSON.parse(readFileSync(join(nextDir, file), "utf8"));
  const manifest = readJson("prerender-manifest.json");

  for (const [route, meta] of Object.entries(manifest.routes)) {
    if ((meta.renderingMode && meta.renderingMode !== "STATIC") || meta.experimentalPPR) {
      fail("partially prerendered (cacheComponents or PPR is back)", route);
    }
  }

  // Every page the build has ("/o-nama/page" -> "/o-nama"; route handlers end in
  // "/route") against the pages it prerendered ("/sr/onama" came from "/[locale]/onama").
  const pages = new Set(
    Object.entries(readJson("app-path-routes-manifest.json"))
      .filter(([entry]) => entry.endsWith("/page"))
      .map(([, route]) => route),
  );
  const prerendered = new Set(Object.values(manifest.routes).map((meta) => meta.srcRoute));
  for (const page of pages) {
    // Next's own pages (_not-found, _global-error) are not ours to keep static.
    if (page.startsWith("/_")) continue;
    const dynamic = DYNAMIC_PAGES[app].includes(page);
    if (!dynamic && !prerendered.has(page)) {
      fail(
        page.includes("[")
          ? `no page prerendered: empty generateStaticParams, or it reads a request API (${ON_PURPOSE})`
          : `not prerendered: it reads cookies(), headers() or searchParams (${ON_PURPOSE})`,
        page,
      );
    }
    if (dynamic && prerendered.has(page)) fail(`prerendered, so ${OFF_DYNAMIC}`, page);
  }
  for (const page of DYNAMIC_PAGES[app]) {
    if (!pages.has(page)) fail(`no such page, so ${OFF_DYNAMIC}`, page);
  }

  // Client-rendered boundaries (`<!--$!-->`) each page has to have, exactly: one per
  // client-only map. Any other one is content missing from the HTML: a new
  // `ssr: false` component, or a throw or notFound() inside Suspense.
  const clientRendered = new Map();
  for (const pagesOf of Object.values(CLIENT_ONLY_ALLOWED)) {
    for (const [file, count] of Object.entries(pagesOf[app] ?? {})) {
      clientRendered.set(file, (clientRendered.get(file) ?? 0) + count);
    }
  }

  const appRoot = join(nextDir, "server", "app");
  let checked = 0;
  for (const file of htmlFiles(appRoot)) {
    const shown = relative(appRoot, file).split(sep).join("/");
    // global-error renders its own document without the app's metadata.
    if (basename(shown).startsWith("_global-error")) continue;
    checked++;
    const html = readFileSync(file, "utf8");

    // A boundary whose content is not in place: React sends the fallback, and the
    // content in a hidden segment (`<div hidden id="S:n">`, `<table hidden>`, ...)
    // that only its reveal script moves in.
    if (html.includes("<!--$?-->")) fail("Suspense fallback in the HTML, its content shown only by JS", shown);

    const expected = clientRendered.get(shown) ?? 0;
    clientRendered.delete(shown);
    const found = html.split("<!--$!-->").length - 1;
    if (found !== expected) fail(CLIENT_RENDERED, `${shown} has ${found}, expects ${expected}`);

    // framer-motion writes `initial` into the HTML as an inline style, so whatever
    // animates in from opacity 0 stays invisible without JS. Only decoration may,
    // marked aria-hidden on that same element.
    const hidden = (html.match(/<[a-z][^>]*\sstyle="(?:[^"]*;)?opacity:0[;"][^>]*>/g) ?? []).filter(
      (tag) => !tag.includes('aria-hidden="true"'),
    );
    if (hidden.length) {
      fail(
        "inline opacity:0 on content, invisible without JS: remove the entrance animation (aria-hidden is only for a decoration with no text)",
        `${shown} (${hidden.length})`,
      );
    }

    const headEnd = html.indexOf("</head>");
    if (headEnd < 0 || !/<title[\s>]/.test(html.slice(0, headEnd))) fail("<title> not in <head>", shown);
  }
  for (const [file, expected] of clientRendered) fail(CLIENT_RENDERED, `${file} has no HTML, expects ${expected}`);
  if (checked === 0) fail("no HTML (did the build run?)", ".next/server/app");

  return { checked, problems };
}

// Runs when each app's build runs it, not when a test imports it. Node resolves
// the main module through symlinks and junctions, so argv[1] is resolved too;
// unresolved, a repo opened through one would skip the check and exit 0.
if (realpathSync(process.argv[1]) === import.meta.filename) {
  const app = basename(process.cwd());
  const { checked, problems } = assertStaticHtml(process.cwd());
  if (problems.size) {
    const lines = [...problems].map(
      ([cause, where]) =>
        `${cause}: ${where.slice(0, 3).join(", ")}${where.length > 3 ? ` and ${where.length - 3} more` : ""}`,
    );
    console.error(`assert-static-html (${app}): ${problems.size} problem(s)\n  ${lines.join("\n  ")}`);
    process.exit(1);
  }
  console.log(`assert-static-html (${app}): ${checked} HTML files and the prerender manifest are clean`);
}
