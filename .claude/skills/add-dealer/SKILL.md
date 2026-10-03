---
name: add-dealer
description: Adds a DCK or SG TOOLS dealer (diler, prodavac, radnja, online prodavnica) to the /gde-kupiti map of dcksrbija.rs and sgtools.rs, or moves an existing dealer to a new address. The pin comes from the shop's Google Maps link, OpenStreetMap checks that it is on the stated street, and an expected change merges by itself. Use when someone says "dodaj dilera", "novi diler", "ubaci prodavca", "dodaj radnju na mapu", "diler se preselio", "pomeri dilera", or sends a dealer's name, address and Google Maps link.
argument-hint: "[firma] [adresa] [Google Maps link] [dck|sg|oba]"
allowed-tools:
  - Bash(node .claude/skills/add-dealer/scripts/*)
  - Bash(git status *)
  - Bash(git fetch *)
  - Bash(git switch *)
  - Bash(git add apps/dck/constants/dealers.ts apps/sg-tools/constants/dealers.ts)
  - Bash(git add apps/dck/constants/dealers.ts)
  - Bash(git add apps/sg-tools/constants/dealers.ts)
  - Bash(git commit *)
  - Bash(git push -u *)
  - Bash(gh pr create *)
  - Bash(gh pr merge *)
hooks:
  PreToolUse:
    - matcher: "Edit|Write|MultiEdit|NotebookEdit"
      hooks:
        - type: command
          command: node "$CLAUDE_PROJECT_DIR/.claude/skills/add-dealer/scripts/guard.mjs"
---

# Add or move a dealer on the /gde-kupiti map

The person running this is usually from sales, not a developer. Talk to them in Serbian, informal "ti", short and plain (no jargon, no em dashes). The scripts do everything that touches data; your job is to collect the facts, run them, relay what they say and write the commit and PR text.

Run every command from the repo root. Scripts print JSON, errors included; messages meant for the requester are already in plain Serbian. If Claude Code asks the requester to allow a git or gh command from the steps below, tell them in one line that it is the skill's own step and safe to allow.

## Rules (owner's decisions, 2026-10-01; background in `reference.md`)

1. **Never edit `apps/*/constants/dealers.ts` yourself.** Only `dealers.mjs add` and `move` write them (a hook blocks Edit/Write on them).
2. **Coordinates come only from the script.** Never type, round or "fix" them.
3. **A physical shop's pin is the Google Maps link the requester sends.** Do not search Google, open Google in a browser or look the shop up anywhere; OpenStreetMap only checks that the link's point is on the stated street in the stated settlement. An online dealer (webshop without a shop) is pinned on its registered office from OpenStreetMap.
4. **The printed address is the official one the requester gives** (for example from the dealer's website); the pin sits on the building the shop is actually in. When the script says the two do not describe the same place, ask the requester which is right. Never choose yourself.
5. **Do not fetch CompanyWall or the dealer's website** with tools; use what the requester wrote. A CompanyWall link goes into the PR text as-is.
6. One dealer per branch and per PR, one at a time. Removing a dealer, renaming, changing the phone or email, logos and service centres are out of scope: say that Filip handles those.
7. Never push to `main`. Auto-merge is turned on only when the script says the change is `expected`.
8. OpenStreetMap's Nominatim is used only through the script, within its usage policy (https://operations.osmfoundation.org/policies/nominatim/): one dealer at a time, never in a loop.

## Steps

**1. Check.** `node .claude/skills/add-dealer/scripts/dealers.mjs check`. If `problems` is not empty, tell the requester exactly what to fix and stop. If `notes` says the previous dealer is not merged yet, tell them to wait. Remember `remote`, `route`, `cloud` and `branch`.

**2. Facts.** Ask only for what is missing from their message, in one short question:
- Company name as it should appear on the map.
- **Which site**: always ask, unless they already said it: "Da li diler ide na oba sajta (DCK i SG TOOLS) ili samo na jedan? Ako na jedan, koji?" A dealer on one site goes live by itself just like one on both.
- Type: **radnja** (a physical shop, even if it also sells online; keep its website) or **webshop bez radnje** (online only). A street address with nothing else means radnja.
- Address: street, house number, settlement.
- For a radnja: **the shop's Google Maps link** ("otvori radnju na Google mapama, pa Podeli i Kopiraj link"), or its coordinates. A link shared from the phone app has no coordinates in it; the script then says how to copy them.
- Phone, email, website, CompanyWall link: use them if given, never ask for them.

For a dealer who **moved**: which dealer, the new address and the new Google Maps link.

Then `node .claude/skills/add-dealer/scripts/dealers.mjs list --find "<name>"`. Adding a dealer that is already on the map: ask whether it moved. Note `newId` (or the existing id when moving).

**3. Branch.** `git fetch <remote> main`, then `git switch -c dealers/<id> <remote>/main`; `<branch>` is now `dealers/<id>`. If that fails (local changes), stop and tell the requester. With `cloud: true` (Claude Code on the web) do not create a branch: `git push` works only on the session's own branch, so stay on `branch` (one dealer per session).

**4. Write.** One command:
```
node .claude/skills/add-dealer/scripts/dealers.mjs add --name "<name>" --sites dck,sg-tools --category dealer|online \
  --street "<street>" --number "<no>" --place "<settlement>" [--municipality "<municipality>"] \
  [--link "<Google Maps link>"] [--phone "0XX/XXX-XXXX"] [--email ...] [--website ...]
node .claude/skills/add-dealer/scripts/dealers.mjs move --id <id> --street "<street>" --number "<no>" --place "<settlement>" --link "<Google Maps link>"
```
`--sites` is `dck`, `sg-tools` or both. `--link` is required for a radnja; for a webshop leave it out (the registered office comes from OpenStreetMap) unless the script asks for one. Phone format `0XX/XXX-XXXX` like the other entries; the address never contains a postal code.

What comes back:
- `ok: true`: written and verified. Show `warnings` (another dealer within 50 m, a similar name, a website switched from http:// to https://) and ask before going on if one of them may mean the dealer is already there.
- `code: already_on_map`: the same shop is already listed; tell the requester where (`existing`) and stop.
- `code: name_taken`: another shop with the same name is on the map (a chain). Ask: "Na mapi već postoji <name> na adresi <existing>. Da li je ovo nova radnja istog lanca?" On yes, rerun with `--id <suggestedId>` (the name on the map stays the same).
- `code: bad_link`, `link_required`, `office_not_found`: pass `error` to the requester and wait for a new link, then rerun.
- `code: pin_address_mismatch` with `suggestedPlace`: the pin is on the stated street, only the settlement differs (a shop in Borča with "Beograd" in its address). Ask: "Tačka je u naselju <suggestedPlace>. Da li da upišem <suggestedPlace> kao mesto?" On yes, rerun with `--place "<suggestedPlace>"`.
- `code: pin_address_mismatch` without it: say simply that the point from the link and the address are not the same place, with `reasons` in plain words, and ask which is right. Rerun with the corrected address or link.
- `Diler ne prolazi pravila`: explain the `errors`. A change to the first 6 dealers on product pages (only an online dealer causes it) is Filip's decision: stop and say so; never pass `--allow-top6-change` on your own.
- `code: error`: a service did not answer; wait a minute and rerun once.
- `Upis je vraćen na staro stanje`: nothing was written. Tell the requester that Filip has to look at it and stop.

**5. Commit.** `git add` exactly the files in `changed`, then `git commit -m "<subject>" -m "<body>"`, written by you in English:
- subject: `feat(dealers): add <Name> to both sites` (or `to dck`, `to sg-tools`), or `fix(dealers): move <Name> to <address>`;
- body, one or two short lines: where the pin comes from (the requester's Google Maps link, or OSM for a webshop) and `pin.osmCheck`.

**6. Pull request.** By `route`:
- `push`: `git push -u <remote> <branch>`, then `gh pr create --repo filiptrivan/stridon-presentational-websites --base main --head <branch> --title "<subject>" --body "<body>"`. The body, in English, short: what was added or moved, the address, the pin with `pin.links` (OSM and Google), the link the requester sent, `pin.osmCheck`, the CompanyWall link if given, `gate`, and "Map data © OpenStreetMap contributors" when the pin came from OSM.
  - `expected: true`: `gh pr merge <PR url> --auto --squash` (the repo deletes merged branches itself). If it answers that the PR is already mergeable, the checks finished first: run `gh pr merge <PR url> --squash`. If it is refused as not allowed (on the web the GitHub proxy may not offer auto-merge), tell the requester to open the PR link and click "Enable auto-merge". Then: "Gotovo, diler ide na sajt sam čim prođu provere. Kad se pojavi, pogledaj ga na <livePages> i javi mi ako pin nije na pravom mestu."
  - `expected: false`: do not turn on auto-merge. Say that it went to Filip for approval and why, in one sentence from `gate`.
- `dry-run` (`ADD_DEALER_DRY_RUN` is set, for trying the skill out): stop after the commit. Show the commit and the PR text and say that nothing was sent.

A pin that turns out wrong on the live site is fixed with `move` and a better link.

## If something goes wrong

- OpenStreetMap returns an HTTP error: wait a minute and rerun once; the service is shared. Do not switch to other sources. On the web, a blocked connection means the environment's network access lacks `nominatim.openstreetmap.org` or `maps.app.goo.gl` (see `reference.md`).
- Anything outside these steps: stop and suggest asking Filip.
