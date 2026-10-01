#!/usr/bin/env node
// One-time setup for the Google Maps check: installs playwright-core into ~/.add-dealer (outside
// the repo), finds a browser (Edge, Chrome, or a downloaded Chromium) and runs one test search.
import { launchBrowser, playwrightInstalled, TOOL_DIR } from "./lib/browser.mjs";
import { googleLookup } from "./lib/google.mjs";
import { print, fail } from "./lib/cli.mjs";

const wasInstalled = playwrightInstalled();
try {
  const { browser, used } = await launchBrowser({ install: true });
  await browser.close();
  const test = await googleLookup({ name: "Stridon Group", street: "Vojislava Ilića", numberRaw: "141g", place: "Beograd" });
  print({
    ok: Boolean(test.match),
    installed: wasInstalled ? "već je bio instaliran" : `instaliran u ${TOOL_DIR}`,
    browser: used,
    testSearch: test.match ? `${test.match.name}: ${test.match.lat}, ${test.match.lng}` : `Google nije vratio Stridon (${test.kind})`,
  });
} catch (err) {
  fail(`Podešavanje Google pretrage nije uspelo: ${err.message}`);
}
