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
// starts reading a request API silently becomes dynamic. None of that is
// visible in source; all of it is in `.next/`.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

const appDir = process.cwd();
const app = basename(appDir);
const nextDir = join(appDir, ".next");

// Routes that must stay prerendered. One that drops out has turned dynamic,
// usually through cookies(), headers() or searchParams read somewhere in it.
const MUST_PRERENDER = {
  dck: ["/", "/o-nama", "/kontakt", "/katalozi", "/proizvodi/kategorije", "/proizvodi/tagovi"],
  "sg-tools": ["/", "/o-nama", "/kontakt", "/katalozi", "/proizvodi/kategorije"],
  stridon: ["/sr", "/en", "/sr/onama", "/sr/brendovi", "/sr/katalozi", "/sr/kontakt"],
};

// Dynamic routes whose pages must be prerendered too (at least one page each).
const MUST_PRERENDER_PAGES_OF = {
  dck: ["/proizvodi/[slug]"],
  "sg-tools": ["/proizvodi/[slug]"],
  stridon: ["/[locale]/brendovi/[slug]"],
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

if (!MUST_PRERENDER[app]) {
  console.error(`assert-static-html: unknown app "${app}" (run it from apps/<app>)`);
  process.exit(1);
}

const errors = [];
const manifest = JSON.parse(
  readFileSync(join(nextDir, "prerender-manifest.json"), "utf8"),
);

for (const [route, meta] of Object.entries(manifest.routes)) {
  if (meta.renderingMode && meta.renderingMode !== "STATIC") {
    errors.push(`${route}: renderingMode ${meta.renderingMode} (partial prerender is back)`);
  }
  if (meta.experimentalPPR) errors.push(`${route}: experimentalPPR`);
}
for (const route of MUST_PRERENDER[app]) {
  if (!manifest.routes[route]) {
    errors.push(`${route}: no longer prerendered (did it start reading a request API?)`);
  }
}
for (const src of MUST_PRERENDER_PAGES_OF[app]) {
  if (!Object.values(manifest.routes).some((meta) => meta.srcRoute === src)) {
    errors.push(`${src}: no page prerendered`);
  }
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
