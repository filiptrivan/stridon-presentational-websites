import type { CompanyLogo } from "@brand/shared/components/companies";
import { Globe, Rocket, Speech, Store, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Messages } from "next-intl";

/**
 * Structure only. Every string a reader sees - the milestone titles, the
 * company blurbs, the partner quotes - lives under `About` and `OwnBrands` in
 * `messages/`, keyed by `key` here. What stays is what does not change with the
 * language: the year, the icon, the accent colours the shared `Milestone` type
 * requires, and the photo.
 */
export interface MilestoneDef {
  key: keyof Messages["About"]["milestones"];
  date: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  image: { src: string; contain?: boolean };
}

// The company timeline, same story the sg-tools site tells (it is the same
// family business). Icons and accent colours kept verbatim from
// apps/sg-tools/constants/content.ts, because the shared CompanyTimeline needs
// them and all three sites should render this section identically.
export const ABOUT_MILESTONES: readonly MilestoneDef[] = [
  {
    key: "flea",
    date: "1996.",
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    image: { src: "/about/buvljak.jpg" },
  },
  {
    key: "store",
    date: "2009.",
    icon: Store,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    image: { src: "/about/vojislava-ilica.webp" },
  },
  {
    key: "online",
    date: "2014.",
    icon: Globe,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    image: { src: "/about/prodavnicaalata.svg", contain: true },
  },
  {
    key: "altina",
    date: "2015.",
    icon: Speech,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    image: { src: "/about/altina.webp" },
  },
  {
    key: "sgTools",
    date: "2023.",
    icon: Rocket,
    color: "text-rose-400",
    bg: "bg-rose-500/15",
    border: "border-rose-500/30",
    image: { src: "/about/dck-trade-show-booth.webp" },
  },
];

export interface OwnBrandDef {
  key: keyof Messages["OwnBrands"];
  name: string;
  image: { src: string };
  href: string;
}

export const OWN_BRANDS: readonly OwnBrandDef[] = [
  {
    key: "sgTools",
    name: "SG TOOLS",
    image: { src: "/about/altina.webp" },
    href: "https://www.sgtools.rs",
  },
  {
    key: "dck",
    name: "DCK",
    image: { src: "/about/dck-trade-show-booth.webp" },
    href: "https://www.dcksrbija.rs",
  },
];

/**
 * Verbatim from the old stridon.rs homepage. The company names are names, so
 * they are here; the quotes are under `About.quotes`.
 */
export const PARTNER_QUOTES: readonly {
  key: keyof Messages["About"]["quotes"];
  personName: string;
}[] = [
  { key: "inGradnja", personName: "IN GRADNJA" },
  { key: "enterijerJankovic", personName: "Enterijer Janković" },
  { key: "hidroIna", personName: "Hidro Ina" },
  { key: "termoTim", personName: "Termo Tim" },
  { key: "silmax", personName: "SILMAX doo" },
  { key: "mbmRad", personName: "MBM RAD" },
  { key: "galens", personName: "Galens" },
  { key: "colligoArs", personName: "COLLIGO ARS" },
];

// Alt text is the company's own name, which reads the same in both languages.
export const CLIENT_LOGOS: CompanyLogo[] = [
  { src: "/companies/svgs/galens.svg", alt: "Galens" },
  { src: "/companies/svgs/enterijerjankovic.svg", alt: "Enterijer Janković" },
  { src: "/companies/svgs/coligoars.svg", alt: "Colligo Ars" },
  { src: "/companies/svgs/hidroina.svg", alt: "Hidro Ina" },
  { src: "/companies/svgs/ingradnja.svg", alt: "In Gradnja" },
  { src: "/companies/svgs/lokring.svg", alt: "Lokring" },
  { src: "/companies/svgs/kokreator.svg", alt: "Kokreator" },
  { src: "/companies/svgs/mbmrad.svg", alt: "MBM Rad" },
  { src: "/companies/svgs/termotim.svg", alt: "Termo Tim" },
  { src: "/companies/svgs/nobili.svg", alt: "Nobili" },
  { src: "/companies/svgs/vitorog.svg", alt: "Vitorog" },
  { src: "/companies/svgs/silmaxlogo.svg", alt: "SILMAX" },
];
