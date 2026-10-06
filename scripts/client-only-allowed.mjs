// Components that render only in the browser (`dynamic(..., { ssr: false })`), each
// with its reason, and per app the prerendered pages where it leaves a client-rendered
// boundary, with how many. Only a widget with nothing to read belongs here, never
// content. apps/dck/__tests__/ssr-guard.test.ts allows next/dynamic and React.lazy
// in these files only, and scripts/assert-static-html.mjs allows exactly these
// boundaries.
/** @type {Record<string, Record<string, Record<string, number>>>} source file -> app -> HTML file -> boundaries */
export const CLIENT_ONLY_ALLOWED = {
  // A Leaflet map per location card; the addresses beside it are in the HTML.
  "packages/shared/src/components/contact/contact-locations.tsx": {
    dck: { "servis.html": 2, "produzetak-garancije.html": 2 },
    stridon: { "sr/servis.html": 1, "en/servis.html": 1 },
  },
  // The dealer map; the dealer list beside it is in the HTML.
  "packages/shared/src/components/where-to-buy/where-to-buy-content.tsx": {
    dck: { "gde-kupiti.html": 1 },
    "sg-tools": { "gde-kupiti.html": 1 },
  },
  // The media lightbox mounts only once opened, so no page carries its boundary.
  "packages/shared/src/components/products/product-gallery.tsx": {},
};
