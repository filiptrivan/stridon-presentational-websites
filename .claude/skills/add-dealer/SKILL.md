---
name: add-dealer
description: Adds a DCK or SG TOOLS dealer (diler, prodavac, radnja, online prodavnica) to the /gde-kupiti map of dcksrbija.rs and sgtools.rs, moves an existing dealer to a new address, or removes one. The pin comes from the shop's Google Maps link, OpenStreetMap checks that it is on the stated street, and an expected change merges by itself. Use when someone says "dodaj dilera", "novi diler", "ubaci prodavca", "dodaj radnju na mapu", "diler se preselio", "pomeri dilera", "ukloni dilera", "obriši dilera", "skini dilera sa mape", or sends a dealer's name, address and Google Maps link.
argument-hint: "[firma] [adresa] [Google Maps link] [dck|sg|oba]"
allowed-tools:
  - Bash(node .claude/skills/add-dealer/scripts/dealers.mjs *)
  - Bash(git fetch *)
  - Bash(git switch -c dealers/* origin/main)
  - Bash(git commit -m * -- apps/dck/constants/dealers.ts apps/sg-tools/constants/dealers.ts)
  - Bash(git commit -m * -- apps/dck/constants/dealers.ts)
  - Bash(git commit -m * -- apps/sg-tools/constants/dealers.ts)
  - Bash(git push -u origin dealers/*)
  - Bash(gh pr create --repo filiptrivan/stridon-presentational-websites --base main --head dealers/*)
  - Bash(gh pr merge --auto --squash *)
hooks:
  PreToolUse:
    - matcher: "Edit|Write|MultiEdit"
      hooks:
        - type: command
          command: node "$CLAUDE_PROJECT_DIR/.claude/skills/add-dealer/scripts/guard.mjs"
---

# Add, move or remove a dealer on the /gde-kupiti map

The person running this is usually from sales, not a developer. Talk to them in Serbian, informal "ti", short and plain (no jargon, no em dashes). The scripts do everything that touches data; your job is to collect the facts, run them, relay what they say and write the commit and PR text.

Run every command from the repo root. Scripts print JSON, errors included; messages meant for the requester are already in plain Serbian. If Claude Code asks the requester to allow a git or gh command from the steps below, tell them in one line that it is the skill's own step and safe to allow.

## Rules (Filip's decisions; background in `reference.md`)

1. **Never edit `apps/*/constants/dealers.ts` yourself.** Only `dealers.mjs add`, `move` and `remove` write them (a hook blocks Edit/Write on them).
2. **Coordinates reach `dealers.ts` only through the script**, from the link or from the coordinates the requester sent. Pass what they sent as-is in `--link`; never type, round or "fix" coordinates yourself.
3. **A physical shop's pin is the Google Maps link the requester sends.** Do not search Google, open Google in a browser or look the shop up anywhere; OpenStreetMap only checks that the link's point is on the stated street in the stated settlement. An online dealer (webshop without a shop) is pinned on its registered office from OpenStreetMap.
4. **The printed address is the official one the requester gives** (for example from the dealer's website); the pin sits on the building the shop is actually in. When the script says the two do not describe the same place, ask the requester which is right. Never choose yourself.
5. **Do not fetch CompanyWall or the dealer's website** with tools; use what the requester wrote. A CompanyWall link goes into the PR text as-is.
6. One dealer per branch and per PR, one at a time. Renaming, changing the phone or email, logos and service centres are out of scope: say that Filip handles those. A dealer added with a wrong name, phone or site is removed and, once that is live, added again.
7. Never push to `main`. Auto-merge is turned on only when the script says the change is `expected` (the rule is `classifyChange()` in `scripts/lib/dealers-io.mjs`).
8. OpenStreetMap's Nominatim is used only through the script, within its usage policy (https://operations.osmfoundation.org/policies/nominatim/): one dealer at a time, never in a loop.

## Steps

**1. Check.** `node .claude/skills/add-dealer/scripts/dealers.mjs check`. If `problems` is not empty, tell the requester exactly what to fix and stop. If `notes` says the previous dealer is not merged yet, tell them to wait. Remember `remote`, `route`, `cloud` and `branch`.

**2. Facts.** Ask only for what is missing from their message, in one short question:
- Company name as it should appear on the map.
- **Which site**: always ask, unless they already said it: "Da li diler ide na oba sajta (DCK i SG TOOLS) ili samo na jedan? Ako na jedan, koji?" Either answer is fine.
- Type: **radnja** (a physical shop, even if it also sells online; keep its website) or **webshop bez radnje** (online only). A street address with nothing else means radnja.
- Address: street, house number, settlement.
- For a radnja: **the shop's Google Maps link** ("otvori radnju na Google mapama, pa Podeli i Kopiraj link"), or its coordinates. A link shared from the phone app has no coordinates in it; the script then says how to copy them.
- Phone, email, website, CompanyWall link: use them if given, never ask for them.

For a dealer who **moved**: which dealer, the new address and the new Google Maps link.

For a dealer to **remove**: find it with `list --find "<name>"`, show the requester the exact entry and ask: "Uklanjam <name>, <address>, <city> sa <oba sajta / DCK / SG TOOLS>. Da li je to taj diler?" Run `remove` only after a clear yes. If several entries match (a chain), list them with addresses and let the requester pick; never pick or guess the id yourself.

Then `node .claude/skills/add-dealer/scripts/dealers.mjs list --find "<name>"`. Adding a dealer that is already on the map: ask whether it moved. Note `newId` (or the existing id when moving).

**3. Branch.** `git fetch <remote> main`, then `git switch -c dealers/<id> <remote>/main` (`dealers/remove-<id>` for a removal); `<branch>` is now that branch. If that fails (local changes), stop and tell the requester. With `cloud: true` (Claude Code on the web) do not create a branch: `git push` works only on the session's own branch, so stay on `branch` (one dealer per session).

**4. Write.** One command, on one line:
```
node .claude/skills/add-dealer/scripts/dealers.mjs add --name "<name>" --sites dck,sg-tools --category dealer|online --street "<street>" --number "<no>" --place "<settlement>" [--municipality "<municipality>"] [--link "<Google Maps link>"] [--phone "0XX/XXX-XXXX"] [--email ...] [--website ...]
node .claude/skills/add-dealer/scripts/dealers.mjs move --id <id> --street "<street>" --number "<no>" --place "<settlement>" [--link "<Google Maps link>"]
node .claude/skills/add-dealer/scripts/dealers.mjs remove --id <id>
```
`--sites` is `dck`, `sg-tools` or both. `--link` is required for a radnja, in `add` and in `move`; for a webshop leave it out (the registered office comes from OpenStreetMap) unless the script asks for one. Phone format `0XX/XXX-XXXX` like the other entries; the address never contains a postal code.

What comes back:
- `ok: true`: written and verified. Show `warnings` (another dealer within 50 m, a similar name, a website switched from http:// to https://) and ask before going on if one of them may mean the dealer is already there. After `remove`, `removed` is the entry taken out, for the PR text.
- `code: not_found` (remove): the id is not on the map. A dealer whose own PR is still open is not on the map yet: wait until it is live, or ask Filip.
- `code: already_on_map`: the same shop is already listed; tell the requester where (`existing`) and stop.
- `code: name_taken`: another shop with the same name is on the map (a chain). Ask: "Na mapi već postoji <name> na adresi <existing>. Da li je ovo nova radnja istog lanca?" On yes, rerun with `--id <suggestedId>` (the name on the map stays the same).
- `code: id_reserved`: the id from the name belongs to a service centre. Rerun with `--id <suggestedId>` without asking (the name on the map stays the same).
- `code: bad_link`, `link_required`, `office_not_found`: pass `error` to the requester and wait for a new link, then rerun.
- `code: pin_address_mismatch` with `suggestedPlace`: the pin is on the stated street, only the settlement differs (a shop in Borča with "Beograd" in its address). Ask: "Tačka je u naselju <suggestedPlace>. Da li da upišem <suggestedPlace> kao mesto?" On yes, rerun with `--place "<suggestedPlace>"`.
- `code: pin_address_mismatch` without it: say simply that the point from the link and the address are not the same place, with `reasons` in plain words, and ask which is right. Rerun with the corrected address or link.
- `Diler ne prolazi pravila`: explain the `errors`.
- `code: error`: a service did not answer; wait a minute and rerun once.
- `code: bad_args`: the command itself is wrong (an unknown command or option, a missing or wrong value); fix it from `error` and rerun, without bothering the requester.
- `Upis je vraćen na staro stanje`: nothing was written. Tell the requester that Filip has to look at it and stop.

**5. Commit.** `git commit -m "<subject>" -m "<body>" -- <the files in changed>`, no `git add` (a commit with paths takes exactly those files). Write each `-m` as one quoted line, without a heredoc or `$(…)`, so the repo's permission rule for it applies. In English:
- subject: `feat(dealers): add <Name> to both sites` (or `to dck`, `to sg-tools`), `fix(dealers): move <Name> to <address>`, or `fix(dealers): remove <Name> from both sites` (or `from dck`, `from sg-tools`);
- body, one or two short lines: where the pin comes from (the requester's Google Maps link, or OSM for a webshop) and `pin.osmCheck`; for a removal, the requester's reason if they gave one.

**6. Pull request.** By `route`:
- `push`: `git push -u <remote> <branch>`, then `gh pr create --repo filiptrivan/stridon-presentational-websites --base main --head <branch> --title "<subject>" --body "<body>"`, in this order. The body is one quoted argument (no heredoc or `$(…)`), in English, short: what was added or moved, the address, the pin with `pin.links` (OSM and Google), the link the requester sent, `pin.osmCheck`, the CompanyWall link if given, `gate`, and "Map data © OpenStreetMap contributors" when the pin came from OSM. For a removal: what was removed and from which sites, the whole `removed` entry (coordinates included, so it can be added back), the reason if given, and `gate`.
  - `expected: true`: `gh pr merge --auto --squash <PR url>` (it merges at once if the checks already passed; the repo deletes merged branches itself). If it is refused as not allowed (on the web the GitHub proxy may not offer auto-merge), tell the requester to open the PR link and click "Enable auto-merge". Then: "Gotovo, diler ide na sajt sam čim prođu provere. Kad se pojavi, pogledaj ga na <livePages> i javi mi ako pin nije na pravom mestu." After a removal: "Gotovo, diler nestaje sa sajta čim prođu provere. Proveri na <livePages>."
  - `expected: false`: do not turn on auto-merge. Say that it went to Filip for approval and why, in one sentence from `gate`.
- `dry-run` (`ADD_DEALER_DRY_RUN` is set, for trying the skill out): stop after the commit. Show the commit and the PR text and say that nothing was sent.

A pin that turns out wrong on the live site is fixed with `move` and a better link.

## If something goes wrong

- OpenStreetMap returns an HTTP error: wait a minute and rerun once; the service is shared. Do not switch to other sources. On the web, a blocked connection means the environment's network access lacks `nominatim.openstreetmap.org` or `maps.app.goo.gl` (see `reference.md`).
- Anything outside these steps: stop and suggest asking Filip.
