import type { ContactLocation } from "@brand/shared/types/contact";

export type ServiceCenter = ContactLocation;

/** An array because the shared ContactLocations takes a list; one centre today. */
export const SERVICE_CENTERS: ServiceCenter[] = [
  {
    name: "SG Servis",
    badge: "Naš servisni partner",
    address: "Vojislava Ilića 141b, 11000 Beograd",
    phone: "065/337-8812",
    email: "sgservis22@gmail.com",
    coords: { lat: 44.785937, lng: 20.500664 },
  },
];

/**
 * The brands the old stridon.rs service page lists, plus Stanley, by PACMS slug.
 * Name and logo are read from the CMS like everywhere else. A row links to our
 * brand page only when the slug is also in `BRAND_SLUGS`; Festool is the one
 * here that is serviced without being listed, so it is the one card with no
 * link. Nothing needs editing here to change that - add a slug there and the
 * link appears.
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
