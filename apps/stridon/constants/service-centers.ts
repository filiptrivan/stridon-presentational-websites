import type { StridonLocation } from "@/constants/contact";

export type ServiceCenter = StridonLocation;

/** An array because `LocationCards` takes a list; there is only one centre today. */
export const SERVICE_CENTERS: ServiceCenter[] = [
  {
    id: "sg-servis",
    name: "SG Servis",
    role: "Naš servisni partner",
    address: "Vojislava Ilića 141b",
    city: "11000 Beograd",
    phone: "065/337-8812",
    phoneHref: "+381653378812",
    email: "sgservis22@gmail.com",
    coords: { lat: 44.785937, lng: 20.500664 },
  },
];

export const SERVICE_CENTER = SERVICE_CENTERS[0];

export interface ServicedBrand {
  name: string;
  /** Our own brand page, where the brand is one we distribute. */
  slug: string | null;
  /** Tile in `public/brands/`; null falls back to the wordmark cell. */
  logo: string | null;
}

/** The brands the old stridon.rs service page lists, plus Stanley. */
export const SERVICED_BRANDS: ServicedBrand[] = [
  { name: "DeWalt", slug: "dewalt", logo: "/brands/dewalt.svg" },
  { name: "Stanley", slug: "stanley", logo: "/brands/stanley.svg" },
  { name: "Bosch", slug: "bosch", logo: "/brands/bosch.svg" },
  { name: "Makita", slug: null, logo: "/brands/makita.svg" },
  { name: "Metabo", slug: null, logo: "/brands/metabo.svg" },
  { name: "Festool", slug: null, logo: "/brands/festool.svg" },
  { name: "Senco", slug: "senco", logo: "/brands/senco.svg" },
  { name: "Rubi", slug: "rubi", logo: "/brands/rubi.svg" },
];
