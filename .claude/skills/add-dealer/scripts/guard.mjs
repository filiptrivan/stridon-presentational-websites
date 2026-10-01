#!/usr/bin/env node
// PreToolUse hook registered by the add-dealer skill (see SKILL.md frontmatter).
// 1. Dealer files are written only by `dealers.mjs apply`, never by Edit/Write, so the pin
//    checks and the re-import verification cannot be skipped.
// 2. A commit that includes a dealer file must pass `dealers.mjs validate`.
// Exit code 2 blocks the tool call and shows stderr to Claude.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { REPO_ROOT, SKILL_DIR } from "./lib/paths.mjs";

const DEALER_FILE = /(^|[\\/])apps[\\/](dck|sg-tools)[\\/]constants[\\/]dealers\.ts$/;

let input;
try {
  input = JSON.parse(fs.readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}
const tool = input.tool_name;
const params = input.tool_input ?? {};

if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool) && DEALER_FILE.test(params.file_path ?? params.notebook_path ?? "")) {
  process.stderr.write(
    "add-dealer: dealers.ts se ne menja ručno. Upis radi samo " +
      "`node .claude/skills/add-dealer/scripts/dealers.mjs apply --plan <plan.json>`, " +
      "posle locate.mjs i plan (pravila pina iz SKILL.md).\n",
  );
  process.exit(2);
}

if (tool === "Bash" && /\bgit\b[^|;&]*\bcommit\b/.test(params.command ?? "")) {
  const staged = spawnSync("git", ["diff", "--cached", "--name-only"], { cwd: REPO_ROOT, encoding: "utf8" });
  if (!staged.stdout.split(/\r?\n/).some((f) => DEALER_FILE.test(f))) process.exit(0);
  const check = spawnSync(process.execPath, [path.join(SKILL_DIR, "scripts", "dealers.mjs"), "validate"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (check.status !== 0) {
    process.stderr.write(`add-dealer: commit je zaustavljen, dealers.ts ne prolazi proveru:\n${check.stdout}${check.stderr}\n`);
    process.exit(2);
  }
}
process.exit(0);
