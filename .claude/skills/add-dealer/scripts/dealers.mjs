#!/usr/bin/env node
// The only writer of apps/*/constants/dealers.ts.
//
//   dealers.mjs check                        can this machine run the skill and push the change?
//   dealers.mjs list [--find <name>]         existing dealers on both sites (+ the id a new one would get)
//   dealers.mjs add  --name <n> --sites dck,sg-tools --category dealer|online
//                    --street <s> --number <no> --place <settlement> [--municipality <m>]
//                    [--link <Google Maps link | lat,lng>] [--phone] [--email] [--website] [--id]
//   dealers.mjs move --id <id> --street <s> --number <no> --place <settlement> [--municipality <m>]
//                    [--link <Google Maps link | lat,lng>]
//   dealers.mjs remove --id <id>
//
// add and move check the pin, write the file, read it back with the parser the PR check uses,
// compare with what was intended and restore the original on any mismatch; remove takes one
// dealer out the same way. Then they say whether the change is "expected" (merges by itself) or
// waits for Filip, by the same rule the PR check applies (classify-pr.mjs).
import fs from "node:fs";
import path from "node:path";
import { readOptions, print, fail, run, REPO_ROOT, SITES, SERVICE_FILES, LIVE_PAGES, UPSTREAM_REPO } from "./lib/common.mjs";
import {
  parseDealers,
  entriesOf,
  insertEntry,
  replaceEntry,
  removeEntry,
  checkEntry,
  classifyChange,
  serviceIds,
  FIELD_ORDER,
} from "./lib/dealers-io.mjs";
import { distanceM, mapLinks, pinFromLink } from "./lib/geo.mjs";
import { checkPin, geocodeOffice } from "./lib/osm.mjs";
import { normalizeHouseNumber, similarity, simple, slugify } from "./lib/text.mjs";

// Options each command takes; anything else is refused.
const OPTIONS = {
  check: [],
  list: ["find"],
  add: ["name", "sites", "category", "street", "number", "place", "municipality", "link", "phone", "email", "website", "id"],
  move: ["id", "street", "number", "place", "municipality", "link"],
  remove: ["id"],
};
const command = process.argv[2];
if (!Object.hasOwn(OPTIONS, command ?? "")) fail(`Nepoznata komanda "${command ?? ""}". Dozvoljeno: ${Object.keys(OPTIONS).join(", ")}.`, { code: "bad_args" });
const opts = readOptions(process.argv.slice(3), OPTIONS[command]);
const need = (key) => opts[key] ?? fail(`Nedostaje --${key}.`, { code: "bad_args" });
const read = (file) => fs.readFileSync(path.join(REPO_ROOT, file), "utf8");

const parseAll = () =>
  Object.fromEntries(Object.entries(SITES).map(([site, file]) => [site, parseDealers(read(file))]));
const entriesBySite = (parsed) => Object.fromEntries(Object.entries(parsed).map(([site, p]) => [site, entriesOf(p)]));

// Both lists as the dealer-change check reads them. A file the parser cannot read is not
// written to: the check would call any change to it invalid.
function readDealers() {
  const parsed = parseAll();
  const errors = Object.entries(parsed).flatMap(([site, p]) => p.errors.map((e) => `${site}: ${e}`));
  if (errors.length) fail("Spisak dilera ima oblik koji skripta ne ume da pročita; javi Filipu.", { errors });
  return { parsed, bySite: entriesBySite(parsed) };
}

// The dck service centres come into its list from service-centers.ts (`...SERVICE_DEALERS`), so
// their ids are taken although the parsed list does not contain them.
const reservedIds = () =>
  Object.fromEntries(Object.entries(SERVICE_FILES).map(([site, file]) => [site, serviceIds(read(file))]));

// Every entry links over https (`https://host/`). A site given as http:// is written as https://,
// and the requester checks the link once the dealer is live, as with the pin.
function normalizeWebsite(w, warnings) {
  if (!w) return undefined;
  try {
    const url = new URL(/^https?:\/\//i.test(w) ? w : `https://${w}`);
    if (url.protocol === "http:") {
      url.protocol = "https:";
      warnings.push(`Sajt je bio naveden sa http://, upisan je kao ${url.href}. Kad diler bude na sajtu, proveri da link radi.`);
    }
    return url.href;
  } catch {
    return w;
  }
}

// A second shop of a chain has the same name, so the same id. Offer one with the street (or the
// settlement), e.g. "doming-zrenjaninski-put".
function freeId(base, input, taken) {
  const [street, place, number] = [input.street, input.place, input.numberRaw].map(slugify);
  for (const parts of [[street], [place], [street, number]]) {
    const candidate = [base, ...parts].join("-");
    if (parts.every(Boolean) && !taken.has(candidate)) return candidate;
  }
  for (let n = 2; ; n++) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
}

// Messages are relayed to the requester, who is not technical (Serbian, informal).
const LINK_HELP = {
  not_a_link: "To nije link ni koordinate. Pošalji link radnje sa Google mapa (otvori radnju, pa Podeli i Kopiraj link).",
  link_not_found: "Google kaže da taj link ne postoji. Pošalji ponovo link radnje sa Google mapa.",
  map_view_not_place: "Link pokazuje deo mape, a ne samu radnju. Otvori radnju na Google mapama (klikni na njen naziv), pa Podeli i Kopiraj link.",
  directions: "To je link za putanju, a ne za radnju. Otvori samu radnju na Google mapama, pa Podeli i Kopiraj link.",
  // Links shared from the phone app carry only a place id, not coordinates.
  no_coordinates:
    "Iz tog linka ne mogu da pročitam tačnu lokaciju (linkovi iz aplikacije na telefonu je nemaju). Pošalji mi koordinate radnje: na telefonu drži prst na zgradi radnje dok se ne pojavi crvena oznaka, pa kopiraj brojeve iz polja za pretragu; na računaru desni klik na zgradu radnje, pa klikni na brojeve na vrhu menija (kopiraju se). Izgledaju ovako: 44.80123, 20.46543.",
  unreadable: "Taj link trenutno ne mogu da otvorim. Pošalji ga ponovo ili mi pošalji koordinate radnje (na primer 44.80123, 20.46543).",
  too_few_decimals: "Te koordinate su previše grube, mogu da promaše zgradu. Pošalji ih sa bar 5 decimala, onako kako ih Google mape kopiraju, na primer 44.80123, 20.46543.",
  decimal_comma: "U koordinatama ide tačka, a ne zarez, na primer 44.80123, 20.46543. Kopiraj ih ponovo sa Google mapa.",
  degrees: "Pošalji koordinate kao decimalne brojeve, na primer 44.80123, 20.46543. Na Google mapama klikni na brojeve i oni se kopiraju u tom obliku.",
};

function addressInput() {
  const number = opts.number;
  return {
    street: need("street"),
    numberRaw: number ?? "",
    hn: normalizeHouseNumber(number),
    place: need("place"),
    // Only a search hint for the office address: the pin's settlement must match --place itself.
    municipality: opts.municipality ?? "",
  };
}

// The pin (reference.md, decision 2): a physical shop's pin is its Google Maps link and
// OSM only checks that it lies on the stated street in the stated settlement; an online dealer
// is pinned on the registered office from OSM (or a link, checked the same way).
async function pinFor(input, category) {
  const link = opts.link;
  if (link) {
    const pin = await pinFromLink(link);
    if (pin.error) fail(LINK_HELP[pin.error] ?? LINK_HELP.unreadable, { code: "bad_link", detail: pin.error, resolved: pin.resolved ?? null });
    const check = await checkPin(pin, input);
    if (!check.ok) {
      fail(
        check.suggestedPlace
          ? `Tačka je u ulici sa adrese, ali u naselju „${check.suggestedPlace}“, a ne „${input.place}“. Pitaj da li da upišeš „${check.suggestedPlace}“ kao mesto.`
          : "Tačka iz linka i adresa ne opisuju isto mesto. Pitaj šta je tačno: link radnje ili adresa.",
        {
          code: "pin_address_mismatch",
          reasons: check.reasons,
          suggestedPlace: check.suggestedPlace ?? null,
          atPin: check.atPin,
          pin: { lat: pin.lat, lng: pin.lng, links: mapLinks(pin) },
        },
      );
    }
    return { lat: pin.lat, lng: pin.lng, source: "link", link, resolved: pin.resolved, osmCheck: check.how };
  }
  if (category !== "online") fail("Za radnju treba link radnje sa Google mapa (--link).", { code: "link_required" });
  const office = await geocodeOffice(input);
  if (office.error) fail(`${office.error} Pošalji link sedišta sa Google mapa (--link).`, { code: "office_not_found" });
  return { lat: office.lat, lng: office.lng, source: "osm", osmCheck: office.how };
}

function refuseOnMain() {
  const branch = run("git", ["branch", "--show-current"]).stdout.trim();
  if (branch === "main") fail("Na grani main si. Prvo napravi granu dealers/<id> (korak „Grana“ u SKILL.md).");
}

const fingerprint = (list) => list.map((d) => JSON.stringify([...FIELD_ORDER, "coordinates"].map((k) => d[k] ?? null))).join("\n");

// Writes every site with `edit`, parses the written files again, compares them with `expected`
// and classifies the change by the same rule as the dealer-change check, so the requester knows
// what happens next. A write that differs from the plan or is `invalid` is restored.
function writeVerified(sites, edit, expected) {
  const before = parseAll();
  const restore = () => sites.forEach((site) => fs.writeFileSync(path.join(REPO_ROOT, SITES[site]), before[site].text));
  const changed = sites.map((site) => SITES[site]);
  let gate;
  try {
    for (const site of sites) fs.writeFileSync(path.join(REPO_ROOT, SITES[site]), edit(site, before[site].text, before[site].eol));
    const after = parseAll();
    const off = sites.find((site) => fingerprint(entriesOf(after[site])) !== fingerprint(expected(site)));
    if (off) throw new Error(`${off}: fajl posle upisa ne odgovara planu`);
    gate = classifyChange(before, after, changed, reservedIds());
    if (gate.kind === "invalid") throw new Error(gate.errors.join("; "));
  } catch (err) {
    restore();
    fail(`Upis je vraćen na staro stanje: ${err.message}`);
  }
  return { changed, gate };
}

function nearbyWarnings(bySite, point, skipId) {
  const out = new Map();
  for (const [site, dealers] of Object.entries(bySite)) {
    for (const d of dealers) {
      if (d.id === skipId || d.category === "service") continue;
      const m = distanceM(point, d.coordinates);
      if (m <= 50) out.set(d.id, `Na ${m} m od tačke već je diler „${d.name}“ (${site}); proveri da nije isti.`);
    }
  }
  return [...out.values()];
}

function report(sites, pin, written, warnings) {
  print({
    ok: true,
    changed: written.changed,
    pin: { ...pin, links: mapLinks(pin) },
    expected: written.gate.kind === "expected",
    gate: written.gate.reasons ?? written.gate.errors,
    livePages: sites.map((s) => LIVE_PAGES[s]),
    warnings,
  });
}

async function cmdAdd() {
  const name = need("name");
  const category = need("category");
  if (!["dealer", "online"].includes(category)) fail("--category mora biti dealer (radnja) ili online (webshop bez radnje).", { code: "bad_args" });
  const wanted = need("sites").split(",").map((s) => s.trim()).filter(Boolean);
  if (!wanted.length || wanted.some((s) => !Object.hasOwn(SITES, s))) fail(`--sites mora biti ${Object.keys(SITES).join(", ")} ili oba, odvojeno zarezom.`, { code: "bad_args" });
  // Always dck first, so `changed` (and the commit command built from it) has one fixed order.
  const sites = Object.keys(SITES).filter((s) => wanted.includes(s));
  refuseOnMain();
  const input = addressInput();
  const contact = { id: opts.id, phone: opts.phone, email: opts.email, website: opts.website };
  const id = contact.id ?? slugify(name);
  const address = [input.street, input.numberRaw].filter(Boolean).join(" ");

  // The id must be free on both sites (service centres included) before anything is looked up.
  const { bySite } = readDealers();
  const services = Object.values(reservedIds()).flat();
  const taken = new Set([...Object.values(bySite).flat().map((d) => d.id), ...services]);
  const holders = Object.entries(bySite).flatMap(([site, list]) => list.filter((d) => d.id === id).map((d) => ({ site, name: d.name, address: d.address ?? "", city: d.city ?? "" })));
  if (holders.length) {
    const sameShop = holders.find((h) => simple(h.address) === simple(address) && simple(h.city) === simple(input.place));
    if (sameShop) fail(`Ova radnja je već na mapi (${sameShop.site}: ${sameShop.address}, ${sameShop.city}).`, { code: "already_on_map", existing: holders });
    const suggestedId = freeId(id, input, taken);
    fail(`Već postoji diler „${holders[0].name}“ na drugoj adresi (${holders[0].site}: ${holders[0].address}, ${holders[0].city}). Ako je ovo druga radnja istog lanca, ponovi sa --id ${suggestedId}.`, {
      code: "name_taken",
      suggestedId,
      existing: holders,
    });
  }
  if (services.includes(id)) {
    const suggestedId = freeId(id, input, taken);
    fail(`Id „${id}“ već ima ovlašćeni servis na DCK mapi. Ponovi sa --id ${suggestedId}.`, { code: "id_reserved", suggestedId });
  }

  const pin = await pinFor(input, category);
  const warnings = [];
  const entry = {
    id,
    name,
    address,
    city: input.place,
    phone: contact.phone,
    email: contact.email,
    website: normalizeWebsite(contact.website, warnings),
    category,
    coordinates: { lat: pin.lat, lng: pin.lng },
  };
  for (const k of Object.keys(entry)) if (entry[k] === undefined) delete entry[k];

  const own = checkEntry(entry, { strict: true });
  warnings.push(...own.warnings, ...nearbyWarnings(bySite, pin));
  for (const site of sites) {
    const same = bySite[site].find((d) => d.id !== entry.id && similarity(d.name, entry.name) >= 0.85);
    if (same) warnings.push(`${site}: postoji sličan diler „${same.name}“ (${same.address ?? ""}, ${same.city ?? ""}); proveri da nije isti`);
  }
  if (own.errors.length) fail("Diler ne prolazi pravila.", { errors: own.errors, warnings });

  const written = writeVerified(
    sites,
    (site, text, eol) => insertEntry(text, eol, entry),
    (site) => [...bySite[site], entry],
  );
  report(sites, pin, written, warnings);
}

async function cmdMove() {
  const id = need("id");
  refuseOnMain();
  const { parsed, bySite } = readDealers();
  // A dealer listed on both sites moves on both.
  const sites = Object.keys(SITES).filter((s) => bySite[s].some((d) => d.id === id));
  if (!sites.length) fail(`Diler "${id}" ne postoji ni na jednom sajtu.`);
  const old = bySite[sites[0]].find((d) => d.id === id);
  const input = addressInput();
  const pin = await pinFor(input, old.category);
  const changes = { address: [input.street, input.numberRaw].filter(Boolean).join(" "), city: input.place, coordinates: { lat: pin.lat, lng: pin.lng } };
  const strict = checkEntry({ ...old, ...changes }, { strict: true });
  if (strict.errors.length) fail("Diler ne prolazi pravila.", { errors: strict.errors });

  const written = writeVerified(
    sites,
    (site, text, eol) => replaceEntry(text, eol, { ...entriesOf(parsed[site]).find((d) => d.id === id), ...changes }),
    (site) => bySite[site].map((d) => (d.id === id ? { ...d, ...changes } : d)),
  );
  report(sites, pin, written, nearbyWarnings(bySite, pin, id));
}

// A dealer listed on both sites is removed from both. The removed entry is printed in full, so the
// PR shows it and `add` can put it back.
function cmdRemove() {
  const id = need("id");
  refuseOnMain();
  const { bySite } = readDealers();
  const sites = Object.keys(SITES).filter((s) => bySite[s].some((d) => d.id === id));
  if (!sites.length) fail(`Diler "${id}" ne postoji ni na jednom sajtu. Tačan id daje list --find "<ime>".`, { code: "not_found" });
  const { comments, ...removed } = bySite[sites[0]].find((d) => d.id === id);
  const written = writeVerified(
    sites,
    (site, text, eol) => removeEntry(text, eol, id),
    (site) => bySite[site].filter((d) => d.id !== id),
  );
  print({
    ok: true,
    changed: written.changed,
    removed,
    expected: written.gate.kind === "expected",
    gate: written.gate.reasons ?? written.gate.errors,
    livePages: sites.map((s) => LIVE_PAGES[s]),
  });
}

function cmdList() {
  const { bySite } = readDealers();
  const find = opts.find ?? null;
  const rows = {};
  for (const [site, dealers] of Object.entries(bySite)) {
    rows[site] = dealers
      .map((d) => ({ id: d.id, name: d.name, address: d.address ?? "", city: d.city ?? "", category: d.category }))
      .filter((d) => !find || similarity(d.name, find) >= 0.6 || d.name.toLowerCase().includes(find.toLowerCase()));
  }
  print({ ...rows, ...(find ? { newId: slugify(find) } : {}) });
}

function cmdCheck() {
  const problems = [];
  const notes = [];
  const remotes = run("git", ["remote", "-v"]).stdout;
  const remote = remotes.match(new RegExp(`^(\\S+)\\s+\\S*[/:]${UPSTREAM_REPO}(?:\\.git)?\\s+\\(fetch\\)`, "im"))?.[1] ?? null;
  if (!remote) problems.push(`Nijedan git remote ne pokazuje na ${UPSTREAM_REPO}.`);
  const dirty = run("git", ["status", "--porcelain", "--", ...Object.values(SITES)]).stdout.trim();
  if (dirty) problems.push(`U fajlovima dilera već ima nesačuvanih izmena:\n${dirty}\nSačuvaj ih ili vrati pre novog dilera.`);

  const dryRun = Boolean(process.env.ADD_DEALER_DRY_RUN);
  // Claude Code on the web: git and gh go through a GitHub proxy, `git push` works only on the
  // session's own branch, and the proxy serves only pull-request operations, so the permission
  // query is skipped there (the push itself tells).
  const cloud = Boolean(process.env.CLAUDE_CODE_REMOTE_SESSION_ID || process.env.CLAUDE_CODE_REMOTE);
  const branch = run("git", ["branch", "--show-current"]).stdout.trim();
  // The dry run stops at the local commit, so it needs no GitHub at all.
  const gh = dryRun ? [] : problems;
  let permission = null;
  if (run("gh", ["--version"]).status !== 0) gh.push("GitHub CLI (gh) nije instaliran (https://cli.github.com).");
  else if (!cloud && run("gh", ["auth", "status"]).status !== 0) gh.push("gh nije prijavljen: pokreni `gh auth login`.");
  else if (!cloud) permission = run("gh", ["repo", "view", UPSTREAM_REPO, "--json", "viewerPermission", "-q", ".viewerPermission"]).stdout.trim() || null;
  if (!cloud && !dryRun && !gh.length && !["ADMIN", "MAINTAIN", "WRITE"].includes(permission)) gh.push("Tvoj GitHub nalog nema pravo pisanja na repo; Filip treba da ti ga da.");
  if (dryRun) notes.push("Probni režim (ADD_DEALER_DRY_RUN): sve se radi lokalno, ništa se ne šalje na GitHub.");

  // Two open dealer PRs both append at the end of the list, so the second one conflicts,
  // and GitHub runs no checks on a conflicting PR.
  const open = run("gh", ["pr", "list", "--repo", UPSTREAM_REPO, "--state", "open", "--search", "(dealers) in:title", "--json", "url,title"]);
  // Titles this skill writes (SKILL.md step 5): "feat(dealers): add X to both sites", "fix(dealers): move X to ...",
  // "fix(dealers): remove X from both sites".
  const skillTitle = /^(feat\(dealers\): add .+ to (both sites|dck|sg-tools)|fix\(dealers\): move .+ to .+|fix\(dealers\): remove .+ from (both sites|dck|sg-tools))$/;
  let pending = [];
  try {
    if (open.status === 0) pending = JSON.parse(open.stdout || "[]").filter((p) => skillTitle.test(p.title));
  } catch {} // advisory only; an odd gh answer must not stop the skill
  if (pending.length) notes.push(`Prethodni diler još nije na sajtu (${pending.map((p) => p.url).join(", ")}). Novi bi se sudario sa njim: sačekaj da se spoji.`);

  print({ ok: problems.length === 0, problems, notes, remote, cloud, branch, route: dryRun ? "dry-run" : "push" });
  if (problems.length) process.exit(1);
}

const commands = { check: cmdCheck, list: cmdList, add: cmdAdd, move: cmdMove, remove: cmdRemove };
try {
  await commands[command]();
} catch (err) {
  // Network or HTTP errors (OpenStreetMap, the short link) still end as JSON for Claude to relay.
  fail(`Nešto nije uspelo: ${err.message}. Sačekaj minut i probaj ponovo.`, { code: "error" });
}
