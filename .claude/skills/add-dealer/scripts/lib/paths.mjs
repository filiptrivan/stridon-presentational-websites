import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const REPO_ROOT = path.resolve(SKILL_DIR, "../../..");

// Everything the skill produces (cache, reports, images, plans, commit messages) lives
// outside the repo, so nothing stray can end up in a commit.
export const WORK_DIR = path.join(os.tmpdir(), "add-dealer");

export const SITES = {
  dck: "apps/dck/constants/dealers.ts",
  "sg-tools": "apps/sg-tools/constants/dealers.ts",
};

export const UPSTREAM_REPO = "filiptrivan/stridon-presentational-websites";
