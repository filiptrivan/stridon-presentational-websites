// Paths and the tiny CLI layer shared by the add-dealer scripts.
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

// `--key value`, `--key=value` and bare `--flag` arguments.
export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      args._.push(a);
      continue;
    }
    const eq = a.indexOf("=");
    if (eq > 0) args[a.slice(2, eq)] = a.slice(eq + 1);
    else if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) args[a.slice(2)] = argv[++i];
    else args[a.slice(2)] = true;
  }
  return args;
}

export function print(obj) {
  process.stdout.write(`${JSON.stringify(obj, null, 2)}\n`);
}

export function fail(message, extra = {}) {
  print({ ok: false, error: message, ...extra });
  process.exit(1);
}
