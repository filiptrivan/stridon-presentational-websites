#!/usr/bin/env node
// First step of the skill: can this machine run it, and how will the change reach Filip?
// Prints JSON; `problems` are blocking, `notes` are not. Messages are for the requester (Serbian).
import { spawnSync } from "node:child_process";
import { REPO_ROOT, SITES, UPSTREAM_REPO } from "./lib/paths.mjs";
import { print } from "./lib/cli.mjs";
import { playwrightInstalled } from "./lib/browser.mjs";

const problems = [];
const notes = [];
const run = (cmd, args) => spawnSync(cmd, args, { cwd: REPO_ROOT, encoding: "utf8", shell: false });

// Node 22.18 imports .ts without flags (type stripping); registerHooks needs 22.15.
const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 22 || (major === 22 && minor < 18)) {
  problems.push(`Node ${process.versions.node} je star; treba 22.18 ili noviji (https://nodejs.org, LTS).`);
}

const git = run("git", ["--version"]);
if (git.status !== 0) problems.push("Git nije instaliran (https://git-scm.com).");

let branch = null;
let remotes = {};
if (git.status === 0) {
  branch = run("git", ["branch", "--show-current"]).stdout.trim();
  for (const line of run("git", ["remote", "-v"]).stdout.split(/\r?\n/)) {
    const m = line.match(/^(\S+)\s+(\S+)\s+\((fetch|push)\)$/);
    if (m) remotes[m[1]] = { ...remotes[m[1]], [m[3]]: m[2] };
  }
  const dirty = run("git", ["status", "--porcelain", "--", ...Object.values(SITES)]).stdout.trim();
  if (dirty) problems.push(`U fajlovima dilera već ima nesačuvanih izmena:\n${dirty}\nSačuvaj ih ili vrati pre novog dilera.`);
}

const repoPattern = new RegExp(UPSTREAM_REPO.replace("/", "[/:]") + "(\\.git)?$", "i");
const upstreamRemote = Object.entries(remotes).find(([, r]) => repoPattern.test(r.fetch ?? ""))?.[0] ?? null;
const forkRemote =
  Object.entries(remotes).find(([name, r]) => name !== upstreamRemote && /stridon-presentational-websites(\.git)?$/i.test(r.fetch ?? ""))?.[0] ?? null;
if (!upstreamRemote) problems.push(`Nijedan git remote ne pokazuje na ${UPSTREAM_REPO}.`);

const gh = run("gh", ["--version"]);
let permission = null;
if (gh.status !== 0) {
  notes.push("GitHub CLI (gh) nije instaliran: izmena će biti spremna lokalno, a PR otvara neko drugi (https://cli.github.com).");
} else if (run("gh", ["auth", "status"]).status !== 0) {
  notes.push("gh nije prijavljen (`gh auth login`): izmena će biti spremna lokalno, bez PR-a.");
} else {
  permission = run("gh", ["repo", "view", UPSTREAM_REPO, "--json", "viewerPermission", "-q", ".viewerPermission"]).stdout.trim() || null;
}
const canPushUpstream = ["ADMIN", "MAINTAIN", "WRITE"].includes(permission);

// How the branch reaches a PR: straight into the repo, through a fork, or not at all.
// ADD_DEALER_DRY_RUN=1 stops after the local commit (for trying the skill out).
const dryRun = Boolean(process.env.ADD_DEALER_DRY_RUN);
const prRoute = dryRun ? "dry-run" : canPushUpstream ? "upstream" : forkRemote && permission ? "fork" : "local-only";
if (prRoute === "local-only") notes.push("PR neće moći da se otvori odavde; skill će pripremiti commit i reći šta dalje.");
if (dryRun) notes.push("Probni režim (ADD_DEALER_DRY_RUN): sve se radi lokalno, ništa se ne šalje Filipu.");

// The Google Maps check needs a small browser driver, installed once outside the repo.
const googleReady = playwrightInstalled();
if (!googleReady) notes.push("Google pretraga još nije podešena: pokreni setup-google.mjs (jednom, oko 13 MB).");

print({
  ok: problems.length === 0,
  problems,
  notes,
  node: process.versions.node,
  branch,
  upstreamRemote,
  forkRemote,
  permission,
  prRoute,
  googleReady,
});
process.exit(problems.length ? 1 : 0);
