import type { ContactLocation } from "@brand/shared/types/contact";

/**
 * An array because the shared ContactLocations takes a list; one centre today.
 * The badge is the one translated field, so it is filled in on the page rather
 * than here - a module constant has no locale to read it with.
 */
export const SERVICE_CENTERS: Omit<ContactLocation, "badge">[] = [
  {
    name: "SG Servis",
    address: "Vojislava Ilića 141b, 11000 Beograd",
    phone: "065/337-8812",
    email: "sgservis22@gmail.com",
    coords: { lat: 44.785937, lng: 20.500664 },
  },
];

/**
 * The brands the old stridon.rs service page lists, plus Stanley, by PACMS slug.
 * Name and logo are read from the CMS like everywhere else. A row links to our
 * brand page only when the site shows that brand (`lib/brands.ts`), so the
 * link follows the CMS with no edit here.
 */
export const SERVICED_BRAND_SLUGS: readonly string[] = [
  "dewalt",
  "stanley",
  "bosch",
  "makita",
  "metabo",
  "festool",
  "senco",
  "rubi",
];
