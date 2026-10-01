---
name: add-dealer
description: Adds a new DCK or SG TOOLS dealer (diler, prodavac, radnja, online prodavnica) to the /gde-kupiti map of dcksrbija.rs and sgtools.rs. Checks the pin on both OpenStreetMap and Google Maps, lets the requester pick when they disagree, then opens a pull request for Filip. Use when someone says "dodaj dilera", "novi diler", "ubaci prodavca", "dodaj radnju na mapu", or sends a dealer's name, address, website or CompanyWall link for the map.
argument-hint: "[firma] [adresa radnje] [dck|sg|oba] [radnja|online]"
allowed-tools:
  - Bash(node .claude/skills/add-dealer/scripts/*)
  - Bash(git status *)
  - Bash(git fetch *)
hooks:
  PreToolUse:
    - matcher: "Edit|Write|MultiEdit|NotebookEdit"
      hooks:
        - type: command
          command: node "$CLAUDE_PROJECT_DIR/.claude/skills/add-dealer/scripts/guard.mjs"
    - matcher: "Bash"
      hooks:
        - type: command
          if: "Bash(git commit *)"
          command: node "$CLAUDE_PROJECT_DIR/.claude/skills/add-dealer/scripts/guard.mjs"
---

# Add a dealer to the /gde-kupiti map

The person running this is usually from sales, not a developer. Talk to them in Serbian, informal "ti", short and plain (no jargon, no em dashes). Everything that touches data is done by the scripts below; your job is to collect the facts, run the scripts in order, show the results honestly and ask only when the rules say so.

Run every command from the repo root. Scripts print JSON. Work files (reports, map image, plan, commit message) go to the OS temp folder, never into the repo.

## How the pin is decided

The pin is looked up in two independent places: OpenStreetMap (address register data) and Google Maps (business listings, searched in a browser the way a person would).
- **green**: both found the shop and they are **within 10 m** of each other. The OSM point is written and the PR goes to Filip without asking the requester anything.
- **yellow**: they disagree by more than 10 m, or only one of them knows the shop. The requester looks at the map image and says which point is right; then the PR goes to Filip.
- **red**: neither knows the shop. The requester sends the exact location (a Google Maps or OpenStreetMap link, or coordinates).

## Hard rules

1. **Never edit `apps/*/constants/dealers.ts` yourself.** Only `dealers.mjs apply` writes them (a hook blocks Edit/Write on them and validates every commit that touches them).
2. **Coordinates come only from a `locate.mjs` report.** Never type, round or "fix" coordinates by hand; a point the requester sends goes through `locate.mjs --pin`.
3. **Never decide for the requester on a yellow pin.** Ask, and pass exactly what they chose.
4. **Do not fetch CompanyWall** with scripts or WebFetch: its terms forbid automated access. Use the link the requester gave as-is.
5. OpenStreetMap services are used within their usage policies (https://operations.osmfoundation.org/policies/nominatim/, https://operations.osmfoundation.org/policies/tiles/), and Google Maps gets one search per dealer. One dealer at a time; never loop the scripts over many addresses.
6. One dealer per branch and per PR. Changing or removing an existing dealer, logos and service centres are out of scope: tell the requester that Filip handles those.

## Steps

**1. Environment.** `node .claude/skills/add-dealer/scripts/check-env.mjs`. If `problems` is not empty, tell the requester exactly what to install or fix and stop. If `googleReady` is false, run `node .claude/skills/add-dealer/scripts/setup-google.mjs` once: it installs a small browser driver (playwright-core, about 13 MB) into `~/.add-dealer`, outside the repo, and uses the browser the requester already has (Edge or Chrome); only if neither exists it downloads Chromium. Tell the requester in one sentence that you are setting up Google Maps search. Remember `upstreamRemote`, `forkRemote` and `prRoute` for step 7.

**2. Facts.** Keep it short: the requester should answer as few questions as possible. Ask only for what is missing from their message, all in one short question:
- Company name as it should appear on the map.
- Brand: DCK, SG TOOLS, or both.
- Type: **radnja** (a physical shop, even if it also sells online; keep its website) or **webshop bez radnje** (online only; the pin goes on the registered office). If they gave a street address and said nothing else, it is a radnja.
- **Address of the shop**: street, house number, settlement.
- Phone, email, website, CompanyWall link: use them if given, never ask for them.

Do not ask who is requesting or the date (the plan takes the git name and today).

Then `node .claude/skills/add-dealer/scripts/dealers.mjs list --find "<name>"` to make sure the dealer is not already on the map.

**3. Pin.**
```
node .claude/skills/add-dealer/scripts/locate.mjs --name "<name>" --street "<street>" --number "<no>" --place "<settlement>" [--municipality "<municipality>"]
```
**Read the image file** from the output yourself (red ring = OpenStreetMap, blue = Google Maps, orange = a point the requester sent) and check that each ring sits on a building, not on a road or a field. Do not describe the technical details to the requester.

Talk to the requester exactly this simply (they are not technical):
- **green**: one line, for example "Našao sam radnju, Google i mapa se slažu. Upisujem je i šaljem Filipu." Then go on without asking.
- **yellow with two points**: `locate.mjs` has already opened a page with the picture in their browser (`page` in the output). Say: "Našao sam dve tačke za <name>. Otvorio sam ti sliku, pogledaj je i reci mi koja je dobra: plava (Google) ili crvena (OpenStreetMap). Ako nisi siguran, izaberi bilo koju." Below that line put the `page` path, in case the browser did not open. Ask with AskUserQuestion with exactly two options, "Plava (Google)" and "Crvena (OpenStreetMap)". The answer is `google` or `osm`.
- **yellow with one point**: "Našao sam radnju samo na jednom mestu. Otvorio sam ti sliku, pogledaj da li je tačka dobra." Options "Da, dobra je" (the answer is that candidate's key) and "Ne, poslaću ti tačnu lokaciju".
- **red**, or "Ne": "Ne mogu da nađem radnju na mapi. Pošalji mi link radnje sa Google mapa (otvori radnju na Google mapama, pa Podeli i Kopiraj link)." Rerun step 3 with `--pin "<link>"` (coordinates also work) and ask the one-point question again; the answer is `manual`.
- If the image clearly contradicts a green verdict (a ring on a road or a field), do not go on: ask as for yellow.

**4. Branch.** `git fetch <upstreamRemote> main`, then `git switch -c dealers/<id> <upstreamRemote>/main` (`<id>` is `input.id` in the report). If the switch fails because of local changes, stop and tell the requester.

**5. Plan and write.**
```
node .claude/skills/add-dealer/scripts/dealers.mjs plan --locate "<report>" --sites dck,sg-tools --category dealer|online --name "<name>" [--phone "0XX/XXX-XXXX"] [--email ...] [--website ...] [--company "<link>"] [--pib ...] [--mb ...] [--choice osm|google|manual]
node .claude/skills/add-dealer/scripts/dealers.mjs apply --plan "<plan>"
```
`--choice` is required for a yellow pin and must be what the requester picked. `--sites`: `dck`, `sg-tools`, or both. `--address` and `--city` default to the street, number and settlement from step 3; the address never contains a postal code. Phone format is `0XX/XXX-XXXX` like the other entries. If the plan fails, fix the input and rerun; do not work around an error. An online entry that would change the first 6 dealers on product pages needs Filip's decision: stop and say so (never pass `--allow-top6-change` on your own). `apply` writes the entry, re-imports both files, checks them and restores everything if anything is off.

**6. Commit.** `node .claude/skills/add-dealer/scripts/dealers.mjs message --plan "<plan>"`, then stage exactly the files `apply` listed (`git add apps/dck/constants/dealers.ts apps/sg-tools/constants/dealers.ts`) and `git commit -F "<commitFile>"`.

**7. Pull request to Filip.** Once the pin is green or the requester has chosen, send it without asking again, by `prRoute`:
- `upstream`: `git push -u <upstreamRemote> dealers/<id>`, then `gh pr create --repo filiptrivan/stridon-presentational-websites --base main --head dealers/<id> --title "<title>" --body-file "<prFile>"`.
- `fork`: `git push -u <forkRemote> dealers/<id>`, then the same `gh pr create` with `--head <fork owner>:dealers/<id>`.
- `local-only`: do not push. Tell the requester the branch name and that someone with access opens the PR.
- `dry-run` (`ADD_DEALER_DRY_RUN` is set, used for trying the skill out): do not push and do not open a PR. Show the commit and the PR text instead.

Never push to `main`, never merge. Finish with the PR link and two sentences in Serbian: what was added and that it goes live on dcksrbija.rs / sgtools.rs when Filip approves.

## If something goes wrong

- `locate.mjs` fails with an HTTP error: wait a minute and retry once; the public services are shared. Do not switch to other sources.
- Google search failed (`google_unavailable`): rerun `setup-google.mjs` once; if it still fails, continue, the pin is then yellow and the requester confirms it.
- Anything outside these steps (logo, moving a dealer, a new category): stop and suggest asking Filip.

Background, measurements and tests: `reference.md` in this folder.
