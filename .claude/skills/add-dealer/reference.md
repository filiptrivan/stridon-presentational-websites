# add-dealer: decisions and background

## Decisions (Filip, review of PR #20, 2026-10-01)

1. **The pin sits on the shop's own building**, not just the right block. The printed address can still be the official one: Iskra servis prints "Mije Kovačevića 10" as on its website, and the pin goes on the building the shop is actually in.
2. **Where the pin comes from.**
   - Physical shop: the requester (sales, Aleksa) always sends the shop's Google Maps link. OpenStreetMap only checks that the point is on the stated street and in the stated settlement. If it is not, Claude asks the requester to sort out which is right, because the pin and the printed address must describe the same place.
   - Online dealer: the pin is the registered office, from OpenStreetMap.
3. **No Google scraping.** The hidden browser, the user-agent edit, the 10 m rule, Photon, the judge()/decide() grading, the blue-or-red picture page, the map image and the PNG code are gone. A short `maps.app.goo.gl` link is resolved by reading the HTTP redirect only (the `Location` header), never the page.
4. **"Expected" change** = exactly one dealer added, or one existing dealer's address and pin moved, identical on both sites, nothing else. It goes live with no review from Filip. An online dealer (adding one changes the first 6 on product pages) and anything else wait for Filip.
   Clarified by Luka on 2026-10-02: a dealer for one brand only, on one site, is expected too (6 of the 20 dck dealers are dck-only); "identical" applies where the dealer is on both sites, and a dealer listed on both moves on both. The skill always asks which site. Anything that changes the first 6 dealers on product pages waits for Filip.
5. **How GitHub enforces it.**
   - A required `dealer-change` check (`.github/workflows/dealer-change.yml`). It reads the diff as plain data and runs the data checks; it replaced the `node --test` files in this folder and the commit check in `guard.mjs`.
   - `CODEOWNERS`: `* @filiptrivan`, with the two `dealers.ts` files exempt.
   - Auto-merge turned on for the repo.
6. **The requester has write access.** The skill pushes a `dealers/<id>` branch to the repo and turns on auto-merge. The fork and local-only routes are gone; the dry-run mode stays for trying the skill out.
7. **No preview before deploy** (from Filip's third question, agreed by Luka). The sites are not a critical system: the requester checks the pin on the live page after the deploy and, if it is off, runs `move` with a better link.

## Setup

**Filip (repo settings, in this order).** PRs use the base branch's CODEOWNERS, so the new owners apply once this PR is on `main`; the dealer-change workflow already runs on this PR (no dealer file changes, so it passes), and a check must have run once before the ruleset can require it.
1. Merge this PR.
2. Settings → General: "Allow auto-merge" and "Automatically delete head branches" (`gh pr merge --auto` ignores `--delete-branch`).
3. Ruleset on `main`: add `dealer-change` to the required checks, keep `strict` off, and pin it to the GitHub Actions app, so a commit status set with a personal token cannot stand in for it. Make sure Repository admin is a bypass actor: with `* @filiptrivan` every PR of Filip's own needs a code-owner review he cannot give himself.
4. Invite Aleksa with write access.
5. Decide how Aleksa's Claude may run git: the skill's `allowed-tools` cover only the turn that starts the skill, so after his first answer `git switch`, `git commit`, `git push` and `gh pr create/merge` ask him for permission. Either he clicks "Allow" (it can be remembered per session), or those commands go into `.claude/settings.json` for everyone working in this repo.

**Aleksa, on Claude Code on the web** (Filip's direction in Slack, 2026-10-01; docs: https://code.claude.com/docs/en/claude-code-on-the-web):
- His own Pro, Max or Team plan; the repo connected (the Claude GitHub App may need installing on Filip's account to push to it).
- The environment's network access set to Custom, with the default list kept, plus `nominatim.openstreetmap.org`, `maps.app.goo.gl` and `goo.gl`. The default trusted list has no OSM or Google Maps hosts. Each environment has its own list, so this is once per person.
- `git push` works only on the session's own branch, so the skill uses that branch and does one dealer per session. Whether the proxy allows `gh pr merge --auto` is not documented: the skill falls back to the "Enable auto-merge" button.
- Locally instead: Node 22.18+, git, `gh auth login`, a clone of the repo, then `claude` in it.

## What the research found (2026-10-02, official docs first)

- A required check whose workflow is filtered out (paths) stays "Expected" and blocks the merge, so `dealer-change` runs on every PR and passes at once when no dealer file changed.
- With 0 required approvals and code-owner review on, a PR touching only ownerless files needs no review. A CODEOWNERS line with a path and no owner makes that path ownerless; the last match wins; exact paths, since a bare `dealers.ts` would also exempt `packages/shared/src/types/dealers.ts`.
- `require_extra_approval_for_unattributed_changes` in the ruleset concerns Copilot pull requests and has no effect with 0 required approvals.
- `gh pr merge --auto` merges at once when the PR is already mergeable; right after `gh pr create` the required checks are pending, so auto-merge is enabled normally.
- Short Google links: every `maps.app.goo.gl` link tested answered 302 without a browser, but only those shared from a computer carried the place's `!3d!4d`; links shared from the phone app carry only a place id. `@lat,lng` is the map centre (65 km from the pin in one example). `goo.gl/maps/...` links made by Google apps keep working; `share.google/...` answers with an HTML page. Reading one redirect from a link a person shared is not page scraping.
- Limits of the gate: anyone with write access can post a check run or edit a workflow on a branch, so the gate stops mistakes, not a malicious collaborator. Workflow and skill edits are code-owned, so they need Filip.

## How a change is classified (`classifyChange()` in `scripts/lib/dealers-io.mjs`)

The same function runs in the skill (so the requester is told what happens next) and in CI. CI checks out the script from the base commit and reads the PR's dealer files with `git show`, so no PR code runs. The files are parsed as text: one `key: "string",` per line, the one-line `coordinates`, `// comments`, `...SPREAD,`; any other shape is an error, so an unusual edit is never classified as routine.

| kind | when | check |
|---|---|---|
| none | no dealer file changed | pass |
| mixed | dealer files and other files changed | pass if the files parse and the ids are unique; CODEOWNERS makes Filip review the PR |
| expected | one dealer added at the end of the shop block, or one dealer's address, city and coordinates changed, on one site or on both (identical on both); category `dealer`; none of the first 6 changed; no logo or comment on a new entry; the rest of each file byte-identical | pass, auto-merge |
| owner | any other dealer-only change: two dealers, an online dealer, one of the first 6 moved or reordered, a phone change, a dealer differing between the sites (one listed on both but moved on one), a postal code or bad website, an edit the rule cannot read | fail until Filip approves the PR's latest commit and re-runs the job, or merges with the ruleset bypass |
| invalid | a dealer file that cannot be parsed or is missing, a duplicate id (service centre ids included), coordinates outside Serbia | fail; only the bypass merges it |

## The pin check (`scripts/lib/osm.mjs`)

Nominatim, within its usage policy (https://operations.osmfoundation.org/policies/nominatim/): identifying User-Agent, at most one request per second kept across runs, results cached for a day, one dealer at a time. OSM Serbia carries 99.75 % of the official RGZ address register, so a house-level hit is the official address point.

1. Reverse-geocode the pin. The settlement must match `--place` by name, ignoring "Opština X" and "Gradska opština X" (OSM puts a village's municipality in `city`, so a pin in Bačko Gradište would otherwise pass as Bečej); `--municipality` only helps find an address, it never makes a settlement match. A wrong settlement ends the check there; if the pin is on the stated street, the settlement at the pin comes back as `suggestedPlace` (a shop in Borča, Veternik or Ostružnica whose address says "Beograd" or "Novi Sad"). If the road at the pin is the stated street, done (one request).
2. Otherwise the pin may be on a corner or behind a yard: it passes if the stated address point is within 75 m, or the street's centre line within 50 m. The street's segments are looked up only in a box of about 400 m around the pin: a long street has more segments than Nominatim returns.
3. Otherwise the pin and the address do not describe the same place, and the requester decides.

Checked on 2026-10-02 against all 20 dealers on the map (their current pins, set by hand): all pass. Google's place for Elektro 025 (Petra Drapšina 9) fails against its printed address Dimitrija Tucovića 105 (the street is 398 m away), and Glavna 65 in Bačko Gradište fails against "Glavna 65, Bečej".

Test on 120 shops in Belgrade and Novi Sad (2026-10-02; 95 from OpenStreetMap with placed pins, 5 real Google Maps listings, 20 extra pins 150-300 m off): every pin of another shop (400 m to 15 km away) was refused, every pin on the shop's building passed once the settlement was right, all real Google pins passed, and 60 shops added in a row kept both sites building and rendering. The OSM check cannot tell two buildings on the same street apart; that is what the requester's link is for. Median 1.2 s and 1.4 Nominatim requests per dealer. Chains (Doming, Uradi sam, Woby Haus) get a second id with the street (`name_taken` and `suggestedId`).

## Placement and format

- `category: "dealer"` for any physical shop (with `website` when it also sells online); `"online"` only for a webshop without a retail location.
- New shops go at the end of the dealer block (before `...SERVICE_DEALERS` on dck), so the first 6 non-service entries shown on product pages stay the same. Anything that would change those 6 is refused unless `--allow-top6-change` is passed after Filip decides.
- Field order `id, name, address, city, phone, email, website, logoSrc, category, coordinates`; empty fields are omitted; `address` without a postal code; `website` as `https://host/` (an http:// site is written as https:// with a warning to check the link); `id` is ASCII kebab-case (`đ` becomes `d`, `&` becomes `and`), and a second shop of a chain gets the street or settlement appended (`doming-zrenjaninski-put`). No `logoSrc`: new entries cannot reach the only place that renders logos.
- `add` and `move` write the text, import both files back the way the sites do (Node 22.18+ type stripping), compare them entry by entry with what was intended and restore the originals on any mismatch.

## Trying it out

`ADD_DEALER_DRY_RUN=1` runs everything up to the local commit: no push, no PR. In cmd: `set ADD_DEALER_DRY_RUN=1`, then `claude`. Before the skill is on `main`, `git switch -c dealers/<id> <remote>/main` leaves the skill folder behind, so try it from a branch that has it.
