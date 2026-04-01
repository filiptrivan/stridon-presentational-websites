#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const HARMLESS_BUILTINS = new Set([
  "cd",
  "echo",
  "pwd",
  "export",
  "true",
  "false",
  "test",
  "[",
  "[[",
  "set",
  "pushd",
  "popd",
  "printf",
  "source",
  ".",
]);

const COMPOUND_OPERATORS = ["&&", "||", ";", "|"];

function main() {
  let raw = "";
  try {
    raw = fs.readFileSync(0, "utf-8");
  } catch {
    process.exit(0);
  }

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  if (input.tool_name !== "Bash") process.exit(0);

  const command = input.tool_input?.command;
  if (!command || typeof command !== "string") process.exit(0);

  if (!isCompound(command)) process.exit(0);

  const segments = splitCompound(command);
  if (segments.length <= 1) process.exit(0);

  const patterns = loadAllowPatterns(input.cwd);
  if (patterns.length === 0) process.exit(0);

  for (const seg of segments) {
    const cleaned = stripEnvPrefixes(seg.trim());
    if (!cleaned) continue;
    if (isHarmlessBuiltin(cleaned)) continue;
    if (!matchesAnyPattern(cleaned, patterns)) process.exit(0);
  }

  const result = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      permissionDecisionReason: "All compound segments individually allowed",
    },
  };

  process.stdout.write(JSON.stringify(result));
}

function isCompound(command) {
  let inSingle = false;
  let inDouble = false;
  let escaped = false;

  for (let i = 0; i < command.length; i++) {
    const ch = command[i];

    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }

    if (inSingle || inDouble) continue;

    if (ch === ";" || ch === "|") return true;
    if (ch === "&" && i + 1 < command.length && command[i + 1] === "&")
      return true;
    if (ch === "|" && i + 1 < command.length && command[i + 1] === "|")
      return true;
  }
  return false;
}

function splitCompound(command) {
  const segments = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let escaped = false;

  for (let i = 0; i < command.length; i++) {
    const ch = command[i];

    if (escaped) {
      escaped = false;
      current += ch;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      current += ch;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      current += ch;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      current += ch;
      continue;
    }

    if (inSingle || inDouble) {
      current += ch;
      continue;
    }

    if (ch === "&" && i + 1 < command.length && command[i + 1] === "&") {
      segments.push(current);
      current = "";
      i++;
      continue;
    }
    if (ch === "|" && i + 1 < command.length && command[i + 1] === "|") {
      segments.push(current);
      current = "";
      i++;
      continue;
    }
    if (ch === ";") {
      segments.push(current);
      current = "";
      continue;
    }
    if (ch === "|") {
      segments.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  if (current.trim()) segments.push(current);
  return segments;
}

function stripEnvPrefixes(cmd) {
  let s = cmd;
  while (/^[A-Za-z_][A-Za-z0-9_]*=\S*\s+/.test(s)) {
    s = s.replace(/^[A-Za-z_][A-Za-z0-9_]*=\S*\s+/, "");
  }
  return s.trim();
}

function isHarmlessBuiltin(cmd) {
  const firstWord = cmd.split(/\s+/)[0];
  return HARMLESS_BUILTINS.has(firstWord);
}

function loadAllowPatterns(cwd) {
  const patterns = [];
  const home = process.env.HOME || process.env.USERPROFILE || "";

  const files = [
    path.join(home, ".claude", "settings.json"),
    path.join(home, ".claude", "settings.local.json"),
  ];

  if (cwd) {
    files.push(path.join(cwd, ".claude", "settings.json"));
    files.push(path.join(cwd, ".claude", "settings.local.json"));
  }

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf-8");
      const json = JSON.parse(content);
      const allow = json?.permissions?.allow;
      if (Array.isArray(allow)) {
        for (const entry of allow) {
          const match = entry.match(/^Bash\((.+)\)$/);
          if (match) {
            let pat = match[1];
            pat = pat.replace(/:/g, " ");
            patterns.push(pat);
            if (pat.endsWith(" *")) {
              patterns.push(pat.slice(0, -2));
            }
          }
        }
      }
    } catch {
      // File doesn't exist or isn't valid JSON — skip
    }
  }

  return patterns;
}

function matchesAnyPattern(cmd, patterns) {
  for (const pat of patterns) {
    if (globMatch(pat, cmd)) return true;
  }
  return false;
}

function globMatch(pattern, str) {
  let regexStr = "^";
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "*") {
      regexStr += ".*";
    } else if (ch === "?") {
      regexStr += ".";
    } else {
      regexStr += escapeRegex(ch);
    }
  }
  regexStr += "$";

  try {
    return new RegExp(regexStr).test(str);
  } catch {
    return false;
  }
}

function escapeRegex(ch) {
  return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

main();
