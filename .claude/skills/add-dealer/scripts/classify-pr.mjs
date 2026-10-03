#!/usr/bin/env node
// The dealer-change check (.github/workflows/dealer-change.yml): classifies a PR with
// classifyChange(). It runs from the base commit and reads the PR's dealer files as text with
// `git show`, so nothing from the PR is executed.
//
//   classify-pr.mjs --base <sha> --head <sha>     exit 0 pass, 2 needs @filiptrivan, 1 invalid
import fs from "node:fs";
import { readOptions, print, fail, run, SITES, SERVICE_FILES } from "./lib/common.mjs";
import { classifyChange, parseDealers, serviceIds } from "./lib/dealers-io.mjs";

const { base, head } = readOptions(process.argv.slice(2), ["base", "head"]);
// Full commit ids from the pull_request event, so a value can never act as a git option.
for (const sha of [base, head]) if (!/^[0-9a-f]{40}$/.test(sha ?? "")) fail(`--base i --head moraju biti pun SHA commita, a ne „${sha ?? ""}“.`);

const mergeBase = run("git", ["merge-base", base, head]).stdout.trim();
if (!mergeBase) fail(`Nema zajedničkog pretka za ${base} i ${head}.`);
const names = run("git", ["diff", "--name-only", "--no-renames", mergeBase, head]);
if (names.status !== 0) fail(`git diff nije uspeo: ${names.stderr}`);
const changed = names.stdout.split(/\r?\n/).filter(Boolean);

const at = (ref, file) => {
  const r = run("git", ["show", `${ref}:${file}`]);
  return r.status === 0 ? parseDealers(r.stdout) : null;
};
const lists = (ref) => Object.fromEntries(Object.entries(SITES).map(([site, file]) => [site, at(ref, file)]));
const reserved = Object.fromEntries(Object.entries(SERVICE_FILES).map(([site, file]) => [site, serviceIds(run("git", ["show", `${head}:${file}`]).stdout)]));

let gate;
try {
  gate = classifyChange(lists(mergeBase), lists(head), changed, reserved);
} catch (err) {
  // An edit the rule did not foresee is never routine; Filip decides.
  gate = { kind: "owner", ok: false, reasons: [`provera nije mogla da pročita izmenu: ${err.message}`] };
}
print(gate);

const lines = gate.reasons ?? gate.errors ?? [];
const title = { none: "Nije izmena dilera", mixed: "Izmena dilera uz druge fajlove", expected: "Očekivana izmena dilera", owner: "Čeka @filiptrivan", invalid: "Spisak dilera ne prolazi proveru" }[gate.kind];
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### dealer-change: ${title}\n\n${lines.map((l) => `- ${l}`).join("\n")}\n`);
process.exit(gate.ok ? 0 : gate.kind === "owner" ? 2 : 1);
