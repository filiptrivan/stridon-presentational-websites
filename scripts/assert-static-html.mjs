#!/usr/bin/env node
// Fails the build when its output would show less than the whole page to a
// crawler or a visitor without JavaScript. Runs from an app directory right
// after `next build` (each app's `build` script), reads only `.next/`, makes no
// network calls and takes well under a second.
//
// Why after the build and not in a test: every regression it catches builds
// green and looks right with JavaScript on. A Suspense boundary around content
// outlines it into a hidden `<div hidden id="S:n">` (React 19.2, static pages
// included), cacheComponents brings back the PPR shell, and a static route that
// starts reading a request API silently becomes dynamic. All of it shows in
// `.next/` for prerendered pages. The dynamic ones have no HTML here, so for
// them apps/dck/__tests__/ssr-guard.test.ts checks the source.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

const appDir = process.cwd();
const app = basename(appDir);
const nextDir = join(appDir, ".next");

// Pages that render per request on purpose: they read searchParams (`?strana=`).
// Every other page must come out of the build prerendered; one that does not
// has turned dynamic, usually through cookies(), headers() or searchParams read
// somewhere in it, and its HTML is no longer checked below.
const DYNAMIC_PAGES = {
  dck: ["/proizvodi", "/proizvodi/kategorije/[slug]", "/proizvodi/tagovi/[slug]"],
  "sg-tools": ["/proizvodi", "/proizvodi/kategorije/[slug]"],
  stridon: [],
};

// Client-side rendering bailouts allowed per HTML file, each with its reason.
// Anything else that renders only in the browser is content missing from the HTML.
const ALLOWED_BAILOUTS = {
  // Leaflet maps (`dynamic(..., { ssr: false })`): a map needs JS anyway, and
  // the dealer and location lists beside them are in the HTML. dck's service
  // and warranty pages show one map per location card, two locations.
  "gde-kupiti.html": 1,
  "servis.html": 2,
  "produzetak-garancije.html": 2,
  [join("sr", "servis.html")]: 1,
  [join("en", "servis.html")]: 1,
};

if (!DYNAMIC_PAGES[app]) {
  console.error(`assert-static-html: unknown app "${app}" (run it from apps/<app>)`);
  process.exit(1);
}

const errors = [];
const readJson = (file) => JSON.parse(readFileSync(join(nextDir, file), "utf8"));
const manifest = readJson("prerender-manifest.json");

for (const [route, meta] of Object.entries(manifest.routes)) {
  if (meta.renderingMode && meta.renderingMode !== "STATIC") {
    errors.push(`${route}: renderingMode ${meta.renderingMode} (partial prerender is back)`);
  }
  if (meta.experimentalPPR) errors.push(`${route}: experimentalPPR`);
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
    errors.push(
      page.includes("[")
        ? `${page}: no page prerendered (empty generateStaticParams, or it reads a request API)`
        : `${page}: not prerendered (did it start reading cookies(), headers() or searchParams?)`,
    );
  }
  if (dynamic && prerendered.has(page)) {
    errors.push(`${page}: prerendered, yet DYNAMIC_PAGES lists it; take it off the list`);
  }
}
for (const page of DYNAMIC_PAGES[app]) {
  if (!pages.has(page)) errors.push(`${page}: in DYNAMIC_PAGES, but there is no such page`);
}

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (name.endsWith(".html")) yield path;
  }
}

const appRoot = join(nextDir, "server", "app");
let checked = 0;
for (const file of htmlFiles(appRoot)) {
  const rel = relative(appRoot, file);
  // global-error renders its own document without the app's metadata.
  if (basename(rel).startsWith("_global-error")) continue;
  checked++;
  const html = readFileSync(file, "utf8");
  const shown = rel.split(sep).join("/");

  if (html.includes('<div hidden id="S:')) errors.push(`${shown}: content sent hidden behind a Suspense boundary`);
  if (html.includes("$RC(")) errors.push(`${shown}: Suspense reveal script ($RC)`);

  const bailouts = (html.match(/BAILOUT_TO_CLIENT_SIDE_RENDERING/g) ?? []).length;
  if (bailouts > (ALLOWED_BAILOUTS[rel] ?? 0)) {
    errors.push(`${shown}: ${bailouts} client-side rendering bailout(s), allowed ${ALLOWED_BAILOUTS[rel] ?? 0}`);
  }

  const headEnd = html.indexOf("</head>");
  if (headEnd < 0 || !/<title[\s>]/.test(html.slice(0, headEnd))) {
    errors.push(`${shown}: <title> not in <head>`);
  }
}

if (checked === 0) errors.push("no HTML in .next/server/app (did the build run?)");

if (errors.length) {
  console.error(`assert-static-html (${app}): ${errors.length} problem(s)\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`assert-static-html (${app}): ${checked} HTML files and the prerender manifest are clean`);
