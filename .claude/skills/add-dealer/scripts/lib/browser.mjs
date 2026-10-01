// The Google Maps check runs in a real browser, the way a person searches. Playwright is not a
// repo dependency: the skill installs playwright-core once into ~/.add-dealer and drives a
// browser the requester already has (Edge on Windows, Chrome on macOS). A bundled Chromium is
// downloaded only when neither exists.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

export const TOOL_DIR = path.join(os.homedir(), ".add-dealer");
const PLAYWRIGHT_VERSION = "1.63.0";
const PLAYWRIGHT_DIR = path.join(TOOL_DIR, "node_modules", "playwright-core");

export const playwrightInstalled = () => fs.existsSync(path.join(PLAYWRIGHT_DIR, "package.json"));

export function installPlaywright() {
  fs.mkdirSync(TOOL_DIR, { recursive: true });
  const pkg = path.join(TOOL_DIR, "package.json");
  if (!fs.existsSync(pkg)) fs.writeFileSync(pkg, JSON.stringify({ name: "add-dealer-tools", private: true }, null, 2));
  // npm is a .cmd file on Windows, which Node only spawns through a shell.
  const r = spawnSync("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error", `playwright-core@${PLAYWRIGHT_VERSION}`], {
    cwd: TOOL_DIR,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (r.status !== 0) throw new Error(`instalacija playwright-core nije uspela: ${(r.stderr || r.stdout || "").trim().slice(0, 400)}`);
}

function installChromium() {
  const r = spawnSync(process.execPath, [path.join(PLAYWRIGHT_DIR, "cli.js"), "install", "chromium"], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`preuzimanje Chromium-a nije uspelo: ${(r.stderr || r.stdout || "").trim().slice(0, 400)}`);
}

// Returns { browser, used }. With install: true, missing pieces are installed first.
export async function launchBrowser({ install = false } = {}) {
  if (!playwrightInstalled()) {
    if (!install) throw new Error("Playwright nije instaliran; pokreni setup-google.mjs");
    installPlaywright();
  }
  const { chromium } = createRequire(path.join(TOOL_DIR, "package.json"))("playwright-core");
  const errors = [];
  for (const channel of ["msedge", "chrome", undefined]) {
    try {
      return { browser: await chromium.launch({ headless: true, channel }), used: channel ?? "chromium" };
    } catch (err) {
      errors.push(`${channel ?? "chromium"}: ${String(err.message).split("\n")[0]}`);
    }
  }
  if (install) {
    installChromium();
    return { browser: await chromium.launch({ headless: true }), used: "chromium" };
  }
  throw new Error(`nijedan pregledač ne može da se pokrene (${errors.join("; ")}); pokreni setup-google.mjs`);
}
