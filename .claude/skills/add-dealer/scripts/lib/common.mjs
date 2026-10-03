// Paths and the tiny CLI layer shared by the add-dealer scripts.
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

export const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const REPO_ROOT = path.resolve(SKILL_DIR, "../../..");

// The OSM cache lives outside the repo, so nothing stray can end up in a commit.
export const WORK_DIR = path.join(os.tmpdir(), "add-dealer");

export const SITES = {
  dck: "apps/dck/constants/dealers.ts",
  "sg-tools": "apps/sg-tools/constants/dealers.ts",
};

// Service centres spread into the dck list (`...SERVICE_DEALERS`); their ids are taken.
export const SERVICE_FILES = { dck: "apps/dck/constants/service-centers.ts" };

export const LIVE_PAGES = {
  dck: "https://dcksrbija.rs/gde-kupiti",
  "sg-tools": "https://sgtools.rs/gde-kupiti",
};

export const UPSTREAM_REPO = "filiptrivan/stridon-presentational-websites";

// The options of one command, all `--name value` strings. An unknown option or one without a
// value is an error, so a typo such as `--webiste` is never dropped silently. Values are trimmed
// and may not be empty.
export function readOptions(argv, names) {
  let values;
  try {
    ({ values } = parseArgs({ args: argv, options: Object.fromEntries(names.map((n) => [n, { type: "string" }])), strict: true }));
  } catch (err) {
    fail(`${err.message.replace(/\.?$/, ".")} Opcije: ${names.map((n) => `--${n}`).join(", ") || "nema ih"}.`, { code: "bad_args" });
  }
  for (const [key, value] of Object.entries(values)) {
    if (!value.trim()) fail(`--${key} je bez vrednosti.`, { code: "bad_args" });
    values[key] = value.trim();
  }
  return values;
}

// git and gh, from the repo root, without a shell.
export const run = (cmd, args) => spawnSync(cmd, args, { cwd: REPO_ROOT, encoding: "utf8" });

export function print(obj) {
  process.stdout.write(`${JSON.stringify(obj, null, 2)}\n`);
}

export function fail(message, extra = {}) {
  print({ ok: false, error: message, ...extra });
  process.exit(1);
}
