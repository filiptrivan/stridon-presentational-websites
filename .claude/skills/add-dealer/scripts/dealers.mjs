#!/usr/bin/env node
// The only writer of apps/*/constants/dealers.ts for the add-dealer skill.
//
//   dealers.mjs list [--find <text>]         existing dealers on both sites
//   dealers.mjs validate                     rules for both files (exit 1 on errors)
//   dealers.mjs plan --locate <locate.json> --sites dck,sg-tools --category dealer|online
//                    [--name] [--id] [--address] [--city] [--phone] [--email] [--website]
//                    [--comment] [--company <link>] [--pib] [--mb] [--requested-by] [--requested-on]
//                    [--choice osm|google|manual] [--allow-top6-change]
//   dealers.mjs apply --plan <plan.json>     writes, re-imports, verifies, restores on failure
//   dealers.mjs message --plan <plan.json>   commit message and PR body files
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { parseArgs, print, fail } from "./lib/cli.mjs";
import { REPO_ROOT, SITES, WORK_DIR } from "./lib/paths.mjs";
import {
  loadDealers,
  readText,
  renderEntry,
  insertEntry,
  simulateInsert,
  checkEntry,
  checkSites,
  FIELD_ORDER,
} from "./lib/dealers-io.mjs";
import { mapLinks } from "./lib/geo.mjs";
import { similarity, slugify } from "./lib/text.mjs";

const args = parseArgs(process.argv.slice(2));
const command = args._[0];

async function loadAll() {
  const bySite = {};
  for (const [site, file] of Object.entries(SITES)) bySite[site] = await loadDealers(path.join(REPO_ROOT, file));
  return bySite;
}

function normalizeWebsite(w) {
  if (!w) return undefined;
  try {
    return new URL(/^https?:\/\//i.test(w) ? w : `https://${w}`).href;
  } catch {
    return w;
  }
}

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

// Shared by plan and apply: everything is re-checked against the files as they are now.
function prepare(plan, bySite) {
  const errors = [];
  const warnings = [];
  const { entry, sites, position } = plan;

  const own = checkEntry(entry, { strict: true });
  errors.push(...own.errors);
  warnings.push(...own.warnings);

  for (const site of sites) {
    if (!SITES[site]) errors.push(`nepoznat sajt "${site}" (dozvoljeno: ${Object.keys(SITES).join(", ")})`);
    else if (bySite[site].some((d) => d.id === entry.id)) errors.push(`${site}: diler sa id "${entry.id}" već postoji`);
  }
  for (const [site, dealers] of Object.entries(bySite)) {
    const same = dealers.find((d) => d.id !== entry.id && similarity(d.name, entry.name) >= 0.85);
    if (same) warnings.push(`${site}: postoji sličan diler „${same.name}“ (${same.id}, ${same.address ?? ""}, ${same.city ?? ""}); proveri da nije isti`);
  }
  if (errors.length) return { errors, warnings };

  const next = { ...bySite };
  const effects = {};
  for (const site of sites) {
    const sim = simulateInsert(bySite[site], entry, position);
    next[site] = sim.next;
    const idx = sim.next.findIndex((d) => d.id === entry.id);
    effects[site] = {
      after: sim.next[idx - 1]?.id ?? null,
      before: sim.next[idx + 1]?.id ?? null,
      top6Before: sim.top6Before,
      top6After: sim.top6After,
      top6Changed: sim.top6Before.join() !== sim.top6After.join(),
    };
    if (effects[site].top6Changed && !plan.allowTop6Change) {
      errors.push(
        `${site}: unos menja prvih 6 dilera na stranici proizvoda (${sim.top6Before.join(", ")} → ${sim.top6After.join(", ")}). ` +
          "To je poslovna odluka: tek uz izričito odobrenje dodaj --allow-top6-change.",
      );
    }
  }
  const whole = checkSites(next);
  errors.push(...whole.errors);
  return { errors, warnings, effects, next };
}

function wrap(text, width = 72) {
  const out = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (line && line.length + 1 + word.length > width) {
      out.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) out.push(line);
  return out.join("\n");
}

const siteLabel = (sites) => (sites.length === 2 ? "both sites" : sites[0]);

function describePin(plan) {
  const { verdict, choice, candidates, agreementM } = plan.locate;
  const who = plan.meta.requestedBy || "the requester";
  const { osm, google, manual } = candidates;
  const at = (c) => `${c.lat}, ${c.lng}`;
  const googleText = google ? `Google Maps place "${google.name}"${google.address ? ` (${google.address})` : ""}` : null;
  if (verdict === "green") {
    return `Coordinates via OSM (${osm.osm}, ${at(osm)}); ${googleText} agrees within ${agreementM} m. Both checked automatically, map image reviewed.`;
  }
  const other =
    choice === "osm" ? (google ? `${googleText} was ${agreementM} m away` : "Google Maps did not know the shop")
    : choice === "google" ? (osm ? `OSM (${osm.osm}) was ${agreementM} m away` : "OSM had no house-level match")
    : "neither source had the shop";
  const source =
    choice === "osm" ? `Coordinates via OSM (${osm.osm}, ${at(osm)})`
    : choice === "google" ? `Coordinates from ${googleText} at ${at(google)}`
    : `Coordinates sent by ${who} (${manual.from}, ${at(manual)})`;
  return `${source}. ${other[0].toUpperCase()}${other.slice(1)}, so ${who} chose this point on the map image.`;
}

function commitMessage(plan) {
  const { entry, sites, position, effects, meta } = plan;
  const subject = `feat(dealers): add ${entry.name} to ${siteLabel(sites)}`;
  const where = [entry.address, entry.city].filter(Boolean).join(", ");
  const paragraphs = [];
  if (position === "online") {
    const first = effects[sites[0]];
    paragraphs.push(
      `Webshop${where ? ` with its registered office at ${where}` : ""}, inserted after ${first.after} at the end of the online block. ` +
        (first.top6Changed
          ? `This changes the product-page first 6 (${first.top6After.join(", ")}), approved before the change.`
          : "The product-page first-6 grid is untouched."),
    );
  } else {
    paragraphs.push(
      `Physical shop in ${entry.city} (${entry.address}), appended at the end of the dealer block so the ` +
        "product-page first-6 grid is untouched. No logoSrc: the entry cannot reach the only surface that renders logos.",
    );
  }
  const who = [meta.requestedBy && `Requested by ${meta.requestedBy}`, meta.requestedOn && `on ${meta.requestedOn}`].filter(Boolean).join(" ");
  const company = meta.company
    ? `Company checked by a person via ${meta.company}${meta.pib || meta.mb ? ` (${[meta.pib && `PIB ${meta.pib}`, meta.mb && `MB ${meta.mb}`].filter(Boolean).join(", ")})` : ""}.`
    : "";
  paragraphs.push([who && `${who}.`, company].filter(Boolean).join(" "));
  paragraphs.push(describePin(plan));
  return [subject, "", ...paragraphs.filter(Boolean).map((p) => wrap(p)).flatMap((p) => [p, ""])].join("\n").trimEnd() + "\n";
}

function prBody(plan) {
  const { entry, sites, locate, meta } = plan;
  const links = mapLinks(entry.coordinates);
  const rows = [
    ["Sites", sites.join(", ")],
    ["Category", entry.category === "dealer" ? "dealer (physical shop)" : entry.category],
    ["Address", [entry.address, entry.city].filter(Boolean).join(", ")],
    ["Pin", `${entry.coordinates.lat}, ${entry.coordinates.lng} ([OSM](${links.osm}), [Google](${links.google}))`],
    ["Pin source", { osm: "OpenStreetMap", google: "Google Maps", manual: "sent by the requester" }[locate.choice]],
    ["Google vs OSM", locate.agreementM === null ? "only one source had the shop" : `${locate.agreementM} m apart`],
    ["Verdict", locate.verdict === "green" ? "green (both sources agree within 10 m)" : `yellow, point chosen by ${meta.requestedBy || "the requester"}`],
    ["Company", meta.company ? `${meta.company}${meta.pib ? ` PIB ${meta.pib}` : ""}${meta.mb ? ` MB ${meta.mb}` : ""}` : "not given"],
    ["Requested by", [meta.requestedBy, meta.requestedOn].filter(Boolean).join(", ") || "not given"],
  ];
  const checks = locate.reasons.map((r) => `- **${r.level}** ${r.code}: ${r.msg}`);
  return [
    `Adds **${entry.name}** to the /gde-kupiti map (${sites.join(", ")}).`,
    "",
    "| | |",
    "|---|---|",
    ...rows.map(([k, v]) => `| ${k} | ${String(v).replace(/\|/g, "\\|")} |`),
    "",
    "Pin checks (messages are in Serbian for the requester):",
    "",
    ...checks,
    "",
    "Made with the `add-dealer` skill (`.claude/skills/add-dealer/`). Map data © OpenStreetMap contributors.",
    "",
  ].join("\n");
}

async function cmdPlan() {
  if (!args.locate) fail("Nedostaje --locate <putanja do locate.json>.");
  if (!args.sites) fail("Nedostaje --sites (dck, sg-tools ili dck,sg-tools).");
  if (!["dealer", "online"].includes(args.category)) fail("--category mora biti dealer (radnja) ili online (webshop bez radnje).");
  const report = readJson(args.locate);
  if (report.verdict === "red") {
    fail("Pin je CRVEN: ni Google ni OpenStreetMap ne znaju ovu radnju. Traži od Alekse tačnu lokaciju i ponovo pokreni locate.mjs sa --pin.", {
      reasons: report.reasons.map((r) => `${r.level}: ${r.msg}`),
    });
  }
  // Green: Google and OSM agree within 10 m, the OSM point is written. Yellow: the requester chose.
  const choice = report.verdict === "green" ? "osm" : args.choice;
  if (!report.candidates[choice]) {
    fail(`Pin je ŽUT: Aleksa mora da izabere tačku na slici, pa ponovi sa --choice ${Object.keys(report.candidates).join(" | ")}.`, {
      reasons: report.reasons.filter((r) => r.level === "yellow").map((r) => r.msg),
    });
  }
  const picked = report.candidates[choice];
  const ageH = (Date.now() - Date.parse(report.createdAt)) / 36e5;

  const input = report.input;
  const entry = {
    id: args.id ?? input.id ?? slugify(args.name ?? input.name),
    name: args.name ?? input.name,
    address: args.address ?? [input.street, input.numberRaw].filter(Boolean).join(" "),
    city: args.city ?? input.place,
    phone: args.phone,
    email: args.email,
    website: normalizeWebsite(args.website),
    category: args.category,
    coordinates: { lat: picked.lat, lng: picked.lng },
  };
  if (args.comment) entry.comments = [String(args.comment)];
  for (const k of Object.keys(entry)) if (entry[k] === undefined) delete entry[k];

  const plan = {
    entry,
    sites: String(args.sites).split(",").map((s) => s.trim()).filter(Boolean),
    position: args.category === "online" ? "online" : "dealers",
    allowTop6Change: Boolean(args["allow-top6-change"]),
    locate: {
      verdict: report.verdict,
      choice,
      agreementM: report.agreementM,
      reasons: report.reasons,
      candidates: report.candidates,
      file: path.resolve(args.locate),
    },
    meta: {
      company: args.company ?? "",
      pib: args.pib ?? "",
      mb: args.mb ?? "",
      // Defaults: whoever runs the skill (their git name) and today, so nobody has to be asked.
      requestedBy: args["requested-by"] ?? spawnSync("git", ["config", "user.name"], { cwd: REPO_ROOT, encoding: "utf8" }).stdout.trim(),
      requestedOn: args["requested-on"] ?? new Date().toISOString().slice(0, 10),
    },
  };
  const bySite = await loadAll();
  const { errors, warnings, effects } = prepare(plan, bySite);
  if (ageH > 24) warnings.push(`izveštaj o pinu je star ${Math.round(ageH)} h; po potrebi ponovo pokreni locate.mjs`);
  if (errors.length) fail("Plan ne prolazi pravila.", { errors, warnings });
  plan.effects = effects;

  const dir = path.join(WORK_DIR, entry.id);
  fs.mkdirSync(dir, { recursive: true });
  const planFile = path.join(dir, "plan.json");
  fs.writeFileSync(planFile, JSON.stringify(plan, null, 2));
  print({
    ok: true,
    plan: planFile,
    preview: renderEntry(entry, "\n"),
    placement: Object.fromEntries(Object.entries(effects).map(([s, e]) => [s, `posle „${e.after}“${e.before ? `, pre „${e.before}“` : ", na kraju niza"}`])),
    top6Changed: Object.fromEntries(Object.entries(effects).map(([s, e]) => [s, e.top6Changed])),
    warnings,
  });
}

async function cmdApply() {
  if (!args.plan) fail("Nedostaje --plan <putanja do plan.json>.");
  const plan = readJson(args.plan);
  const before = await loadAll();
  const { errors } = prepare(plan, before);
  if (errors.length) fail("Plan više ne prolazi pravila (fajlovi su se promenili?).", { errors });

  const originals = {};
  const restore = () => {
    for (const [file, text] of Object.entries(originals)) fs.writeFileSync(file, text);
  };
  try {
    for (const site of plan.sites) {
      const file = path.join(REPO_ROOT, SITES[site]);
      const { text, eol } = readText(file);
      originals[file] = text;
      fs.writeFileSync(file, insertEntry(text, eol, plan.entry, plan.position, before[site]));
    }
    // Re-import what was written and compare it with the plan, entry by entry.
    const after = await loadAll();
    const fingerprint = (list) =>
      list.map((d) => JSON.stringify([...FIELD_ORDER, "coordinates"].map((k) => d[k] ?? null))).join("\n");
    for (const site of plan.sites) {
      const expected = simulateInsert(before[site], plan.entry, plan.position).next;
      if (fingerprint(after[site]) !== fingerprint(expected)) throw new Error(`${site}: fajl posle upisa ne odgovara planu`);
    }
    const { errors: afterErrors } = checkSites(after);
    if (afterErrors.length) throw new Error(afterErrors.join("; "));
  } catch (err) {
    restore();
    fail(`Upis je vraćen na staro stanje: ${err.message}`);
  }
  print({ ok: true, changed: Object.keys(originals).map((f) => path.relative(REPO_ROOT, f).replace(/\\/g, "/")) });
}

function cmdMessage() {
  if (!args.plan) fail("Nedostaje --plan <putanja do plan.json>.");
  const plan = readJson(args.plan);
  const dir = path.dirname(path.resolve(args.plan));
  const commitFile = path.join(dir, "commit.txt");
  const prFile = path.join(dir, "pr.md");
  const message = commitMessage(plan);
  fs.writeFileSync(commitFile, message);
  fs.writeFileSync(prFile, prBody(plan));
  print({
    ok: true,
    branch: `dealers/${plan.entry.id}`,
    title: message.split("\n")[0],
    commitFile,
    prFile,
    commitMessage: message,
  });
}

async function cmdValidate() {
  const { errors, warnings } = checkSites(await loadAll());
  print({ ok: errors.length === 0, errors, warnings });
  if (errors.length) process.exit(1);
}

async function cmdList() {
  const bySite = await loadAll();
  const find = args.find ? String(args.find) : null;
  const rows = {};
  for (const [site, dealers] of Object.entries(bySite)) {
    rows[site] = dealers
      .map((d, i) => ({ i, id: d.id, name: d.name, address: d.address ?? "", city: d.city ?? "", category: d.category }))
      .filter((d) => !find || similarity(d.name, find) >= 0.6 || d.name.toLowerCase().includes(find.toLowerCase()));
  }
  print(rows);
}

const commands = { plan: cmdPlan, apply: cmdApply, message: cmdMessage, validate: cmdValidate, list: cmdList };
if (!commands[command]) fail(`Nepoznata komanda "${command ?? ""}". Dozvoljeno: ${Object.keys(commands).join(", ")}.`);
await commands[command]();
