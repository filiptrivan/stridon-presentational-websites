import type { Dealer } from "@brand/shared/types/dealers";

export const DEALERS: Dealer[] = [
  {
    id: "prodavnica-alata",
    name: "Prodavnica Alata",
    address: "Vojislava Ilića 141g",
    city: "Beograd",
    phone: "011/4520-171",
    email: "office@prodavnicaalata.rs",
    website: "https://www.prodavnicaalata.rs/",
    logoSrc: "/companies/svgs/prodavnicaalata.svg",
    category: "online",
    coordinates: { lat: 44.7724, lng: 20.4989 },
  },
  {
    id: "stridon-group",
    name: "Stridon Group D.O.O.",
    address: "Vojislava Ilića 141g",
    city: "Beograd",
    phone: "011/4520-171",
    email: "office@stridon.rs",
    website: "https://www.stridon.rs/",
    logoSrc: "/companies/svgs/stridon.webp",
    category: "dealer",
    coordinates: { lat: 44.7724, lng: 20.4989 },
  },
];

export const UNIQUE_DEALER_NAMES = [
  ...new Set(DEALERS.map((d) => d.name)),
].sort((a, b) => a.localeCompare(b, "sr"));
