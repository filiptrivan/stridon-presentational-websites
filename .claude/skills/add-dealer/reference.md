# add-dealer: background

## Two sources, and why

Measured on 2026-09-30 and 2026-10-01 against the dealers already on the map.

**OpenStreetMap** (Nominatim, plus Photon and reverse geocoding as checks)
- Matched the house number for 18 of 20 dealers, median 191 ms, no key. The two misses (`Zemunska 267A`, `Kneza Višeslava 31u`) are numbers that do not exist in the official RGZ address register either.
- OSM Serbia imported 99.75 % of the RGZ register, so OSM is effectively the official address data. Its weakness is businesses: a shop with an unofficial number (93G, 31u) is invisible to it.

**Google Maps** (one search per dealer in a browser, `lib/google.mjs`)
- Compared on 25 dealers: 16 agree with the current pin within 22 m. Google was right where OSM could not help: Uradimo Sami (the current pin is 1.19 km off, on another building numbered 31), Gvožđara Matica 10 (only Google knows it), Iskra servis (Google on building 10b, OSM on the small building 10, 37 m apart).
- Google was wrong or useless for: Fish & Food (still lists the old location next to the new one), Od Igle Do Lokomotive (no address, 128 km off), Alati i Oprema and Triar (unknown).
- It is searched like a person would, not through the Places API: no key, no billing account. Google's API terms forbid showing API results on a non-Google map, so the browser route was chosen; using Google coordinates on this map is a deliberate decision recorded here (2026-10-01).

Neither source is right every time, so neither decides alone.

## Grading (`scripts/lib/pin.mjs`, `decide()`)

| Verdict | When | What happens |
|---|---|---|
| green | OSM and Google both found the shop and are within 10 m; OSM's reverse check is not in another settlement | OSM point is written, PR goes to Filip |
| yellow | they are more than 10 m apart, or only one knows the shop, or the Google check could not run | the requester picks the point on the map image, PR goes to Filip |
| red | neither knows the shop | the requester sends the exact location (Google or OSM link, or coordinates), then it is yellow |

Run on the 22 dck entries (2026-10-01): 9 green, 12 yellow, 1 red (Triar). Yellow includes real disagreements (Uradimo Sami 1.19 km, Elektro 025 359 m, Fish & Food where Google keeps the old shop) and cases a person settles at a glance (Tim Komerc 42 m, Alati DMS 39 m, Izbor 20 m, Zim 13 m). OSM's own findings (rural settlement, number spelled differently, another dealer within 50 m, a shop mapped under the dealer's name) are shown as notes. The map image (3x3 OSM tiles, zoom 18; red = OSM, blue = Google, orange = sent by the requester) is always drawn and Claude must look at it.

Google names are matched by whole words, so "Triar" does not match the veterinary clinic "TRIARVET" that Google returns for that address.

Cost per dealer: 3 to 5 Nominatim requests, 0 to 1 Photon, 9 map tiles, one Google Maps page; about 10 to 40 seconds; no keys, no money.

## Setup on the requester's machine

`setup-google.mjs` installs `playwright-core` (about 13 MB) into `~/.add-dealer`, outside the repo, and drives the installed Edge (Windows) or Chrome; Chromium is downloaded only if neither exists. Nothing is added to the repo's dependencies. Node 22.18 or newer is required (the scripts import the dealer `.ts` files directly).

## Placement and format (from the existing entries and their commits)

- `category: "dealer"` for any physical shop (with `website` when it also sells online); `"online"` only for a webshop without a retail location, pinned on the registered office.
- New shops go at the end of the dealer block (before `...SERVICE_DEALERS` on dck), so the first 6 non-service entries shown on product pages stay the same. Anything that would change those 6 is refused unless `--allow-top6-change` is passed after Filip decides.
- Field order `id, name, address, city, phone, email, website, logoSrc, category, coordinates`; empty fields are omitted; `address` without a postal code; `website` as `https://host/`; `id` is ASCII kebab-case (`đ` becomes `d`, `&` becomes `and`). No `logoSrc`: new entries cannot reach the only place that renders logos.
- The same dealer on both sites gets an identical block (logos excepted).
- Commit subject `feat(dealers): add <Name> to both sites` (or `to dck` / `to sg-tools`); the body says which source the pin came from, how far the other source was, and who chose.

## Tests

```
node --test ".claude/skills/add-dealer/scripts/test/*.test.mjs"
```

Offline: text normalisation, PNG round trip, text insertion into copies of both dealer files (CRLF kept, re-import equals the plan), the OSM grading, the 10 m Google rule, Google name matching, and a validation pass over the current dealer data. `ADD_DEALER_DRY_RUN=1` runs the whole skill without pushing or opening a PR.

## Known limits

- The Google search reads the public Maps page; if Google changes that page or shows a captcha, the check reports `google_unavailable` and the pin falls back to yellow (the requester confirms).
- Overpass (OSM building outlines) was unreliable in testing (429/504), so "is the pin on a building" is judged from the image.
- Overture Maps (Meta, Microsoft, Amazon) was tried as a third source and knew none of the three small shops without official numbers.
