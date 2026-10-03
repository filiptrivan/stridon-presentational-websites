# add-dealer: decisions and background

What counts as an "expected" change, one that merges with no review, is `classifyChange()` in `scripts/lib/dealers-io.mjs`; this file does not repeat it.

## Decisions (Filip, PR #20)

2026-10-01:

1. **The pin sits on the shop's own building**, not just the right block. The printed address can still be the official one: Iskra servis prints "Mije Kovačevića 10" as on its website, and the pin goes on the building the shop is actually in.
2. **Where the pin comes from.**
   - Physical shop: the requester (sales, Aleksa) sends the shop's Google Maps link. OpenStreetMap only checks that the point is on the stated street and in the stated settlement. If it is not, Claude asks the requester which is right, because the pin and the printed address must describe the same place.
   - Online dealer: the pin is the registered office, from OpenStreetMap.
3. **No Google scraping**, no browser. A short `maps.app.goo.gl` link is resolved by reading the HTTP redirect only (the `Location` header), never the page.
4. **An expected change goes live with no review from Filip**; every other change waits for him.
5. **How GitHub enforces it:** the required `dealer-change` check (`.github/workflows/dealer-change.yml`, which runs `scripts/classify-pr.mjs`), `CODEOWNERS` (`* @filiptrivan`, the two `dealers.ts` files without an owner) and auto-merge.
6. **The requester has write access.** The skill pushes a `dealers/<id>` branch to the repo and turns on auto-merge; `ADD_DEALER_DRY_RUN` is for trying the skill out.
7. **No preview before deploy.** The sites are not a critical system: the requester checks the pin on the live page and, if it is off, runs `move` with a better link.

2026-10-03:

8. **A dealer on only one site counts as expected.** The skill always asks which site; a dealer listed on both sites moves on both.
9. **Coordinates when a phone link has none:** the requester may send them. They reach `dealers.ts` only through the script; Claude never types, rounds or fixes them.
10. **One placement rule for every new dealer, online or a shop: the end of the list**, before the service centres. The six dealers on product pages never change through the skill; putting a shop into the six, with a logo, stays Filip's manual edit.
11. **Permission prompts:** narrow allow rules in `.claude/settings.json` for exactly the commands the skill runs: committing the two `dealers.ts` files, pushing a `dealers/…` branch, `gh pr create` and `gh pr merge --auto`. Nothing broader, because that file applies to every session in this repo. The skill also creates the branch with `git switch -c dealers/<id> origin/main`, so that command got the same kind of rule (added by Luka, not on Filip's list). The rules are a convenience, not a gate: the gate is the dealer-change check, CODEOWNERS and the ruleset.

## Setup

**Filip, once this PR is on `main`.** PRs use the base branch's CODEOWNERS and the dealer-change script from the base commit, so both apply from the first PR after the merge.
1. Settings → General: "Allow auto-merge" and "Automatically delete head branches" (`gh pr merge --auto` ignores `--delete-branch`).
2. Once `dealer-change` has run on a PR (GitHub offers a check for a ruleset after it has run in the last seven days), Ruleset on `main`: add `dealer-change` to the required checks, keep `strict` off, and pin it to the GitHub Actions app, so a commit status set with a personal token cannot stand in for it. Make sure Repository admin is a bypass actor: with `* @filiptrivan` every PR of Filip's own needs a code-owner review he cannot give himself.
3. Invite Aleksa with write access.

The skill's `allowed-tools` cover only the turn that starts it; after that the allow rules in `.claude/settings.json` (decision 11) cover its git and gh steps, once the requester has accepted Claude Code's workspace trust dialog for the repo. A clone whose remote is not `origin` gets a prompt for the branch and the push, which the skill tells the requester is safe to allow; `allowed-tools` use the same forms as the rules.

**Aleksa, on Claude Code on the web** (Filip's direction in Slack, 2026-10-01; docs: https://code.claude.com/docs/en/claude-code-on-the-web):
- His own Pro, Max or Team plan; the repo connected (the Claude GitHub App may need installing on Filip's account to push to it).
- The environment's network access set to Custom, with the default list kept, plus `nominatim.openstreetmap.org`, `maps.app.goo.gl` and `goo.gl`. The default trusted list has no OSM or Google Maps hosts. Each environment has its own list, so this is once per person.
- `git push` works only on the session's own branch, so the skill uses that branch and does one dealer per session. Whether the proxy allows `gh pr merge --auto` is not documented: the skill falls back to the "Enable auto-merge" button.
- Locally instead: Node 22 or newer, git, `gh auth login`, a clone of the repo, then `claude` in it.

## What the research found (2026-10-02, official docs first)

- A required check whose workflow is filtered out (paths) stays "Expected" and blocks the merge, so `dealer-change` runs on every PR and passes at once when no dealer file changed.
- With 0 required approvals and code-owner review on, a PR touching only ownerless files needs no review. A CODEOWNERS line with a path and no owner makes that path ownerless; the last match wins; exact paths, since a bare `dealers.ts` would also exempt `packages/shared/src/types/dealers.ts`.
- `require_extra_approval_for_unattributed_changes` in the ruleset concerns Copilot pull requests and has no effect with 0 required approvals.
- `gh pr merge --auto` merges at once when the PR is already mergeable; right after `gh pr create` the required checks are pending, so auto-merge is enabled normally.
- Short Google links: every `maps.app.goo.gl` link tested answered 302 without a browser, but only those shared from a computer carried the place's `!3d!4d`; links shared from the phone app carry only a place id. `@lat,lng` is the map centre, not the place. `goo.gl/maps/...` links made by Google apps keep working; `share.google/...` answers with an HTML page. Reading one redirect from a link a person shared is not page scraping.
- Limits of the gate: anyone with write access can post a check run or edit a workflow on a branch, so the gate stops mistakes, not a malicious collaborator. Workflow and skill edits are code-owned, so they need Filip.

## The dealer-change check

The skill (so the requester is told what happens next) and the check (`scripts/classify-pr.mjs`) call the same `classifyChange()`. The check takes the script from the base commit and reads the PR's dealer files with `git show`, so no PR code runs. The files are parsed as text: one `key: "string",` per line, the one-line `coordinates`, `// comments`, `...SPREAD,`; any other shape is an error, so an unusual edit is never classified as routine.

## The pin check (`scripts/lib/osm.mjs`)

Nominatim, within its usage policy (https://operations.osmfoundation.org/policies/nominatim/): identifying User-Agent, at most one request per second kept across runs, results cached for a day, one dealer at a time. OSM Serbia carries 99.75 % of the official RGZ address register, so a house-level hit is the official address point.

1. Reverse-geocode the pin. The settlement must match `--place` by name, ignoring "Opština X" and "Gradska opština X" (OSM puts a village's municipality in `city`, so a pin in Bačko Gradište would otherwise pass as Bečej); `--municipality` only helps find an address, it never makes a settlement match. A wrong settlement ends the check there; if the pin is on the stated street, the settlement at the pin comes back as `suggestedPlace` (a shop in Borča, Veternik or Ostružnica whose address says "Beograd" or "Novi Sad"). If the road at the pin is the stated street, done (one request).
2. Otherwise the pin may be on a corner or behind a yard: it passes if the stated address point is within 75 m, or the street's centre line within 50 m. The street's segments are looked up only in a box of about 400 m around the pin: a long street has more segments than Nominatim returns.
3. Otherwise the pin and the address do not describe the same place, and the requester decides.

Checked on 2026-10-02 against all 20 dealers on the map (their current pins, set by hand): all pass. Google's place for Elektro 025 (Petra Drapšina 9) fails against its printed address Dimitrija Tucovića 105 (the street is 398 m away), and Glavna 65 in Bačko Gradište fails against "Glavna 65, Bečej".

Test on 120 shops in Belgrade and Novi Sad (2026-10-02; 95 from OpenStreetMap with placed pins, 5 real Google Maps listings, 20 extra pins 150-300 m off): every pin of another shop (400 m to 15 km away) was refused, every pin on the shop's building passed once the settlement was right, all real Google pins passed, and 60 shops added in a row kept both sites building and rendering. The OSM check cannot tell two buildings on the same street apart; that is what the requester's link is for. Median 1.2 s and 1.4 Nominatim requests per dealer. Chains (Doming, Uradi sam, Woby Haus) get a second id with the street (`name_taken` and `suggestedId`).

## Placement and format

- `category: "dealer"` for any physical shop (with `website` when it also sells online); `"online"` only for a webshop without a retail location.
- Every new dealer goes at the end of the list (before `...SERVICE_DEALERS` on dck).
- Field order `id, name, address, city, phone, email, website, logoSrc, category, coordinates`; empty fields are omitted; `address` without a postal code; `website` as `https://host/` (an http:// site is written as https:// with a warning to check the link); `id` is ASCII kebab-case (`đ` becomes `d`, `&` becomes `and`), and a second shop of a chain gets the street or settlement appended (`doming-zrenjaninski-put`). No `logoSrc`: new entries cannot reach the only place that renders logos.
- `add` and `move` write the text, parse both files again with the same parser the dealer-change check uses, compare them entry by entry with what was intended and restore the originals on any mismatch or when the change would be `invalid`.

## Trying it out

`ADD_DEALER_DRY_RUN=1` runs everything up to the local commit: no push, no PR. In cmd: `set ADD_DEALER_DRY_RUN=1`, then `claude`.
