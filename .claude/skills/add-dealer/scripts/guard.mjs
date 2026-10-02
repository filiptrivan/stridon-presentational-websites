#!/usr/bin/env node
// PreToolUse hook registered by the add-dealer skill (see SKILL.md frontmatter): dealer files are
// written only by `dealers.mjs add|move`, never by Edit/Write, so the pin check and the
// import-back verification cannot be skipped. Exit code 2 blocks the call and shows stderr to
// Claude. Data rules on commits are enforced in CI by the dealer-change check.
import fs from "node:fs";
import path from "node:path";

// Case-insensitive and on the normalized path: Windows also accepts `Apps\DCK\...` and `..` hops.
const DEALER_FILE = /(^|[\\/])apps[\\/](dck|sg-tools)[\\/]constants[\\/]dealers\.ts$/i;

let input;
try {
  input = JSON.parse(fs.readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}
const params = input.tool_input ?? {};
if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(input.tool_name) && DEALER_FILE.test(path.normalize(params.file_path ?? params.notebook_path ?? ""))) {
  process.stderr.write(
    "add-dealer: dealers.ts se ne menja ručno. Upis radi samo " +
      "`node .claude/skills/add-dealer/scripts/dealers.mjs add` ili `move` (pravila iz SKILL.md).\n",
  );
  process.exit(2);
}
process.exit(0);
