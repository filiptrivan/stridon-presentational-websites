import type { TrustBadge } from "@brand/shared/components/cta";
import {
  BadgePercent,
  BookOpen,
  Factory,
  Globe,
  Layers,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

export const FEATURES = [
  {
    title: "Zvanični uvoz",
    desc: "Originalni proizvodi sa punom garancijom i tehničkom podrškom, direktno od proizvođača.",
    icon: ShieldCheck,
  },
  {
    title: "Preko 30 brendova",
    desc: "DeWalt, Bosch, Stanley, Knipex, Wera i još desetine svetskih brendova na jednom mestu.",
    icon: Layers,
  },
  {
    title: "Veleprodaja i B2B",
    desc: "Veleprodajne cene, posebni uslovi i podrška za dilere širom Srbije.",
    icon: BadgePercent,
  },
  {
    title: "Brza isporuka",
    desc: "Isporuka za 1 do 5 radnih dana, uz besplatnu dostavu preko 15.000 RSD.",
    icon: Truck,
  },
];

// Dealer-facing, deliberately different from the FEATURES row above them.
export const CTA_TRUST_BADGES: TrustBadge[] = [
  { icon: Globe, text: "B2B portal" },
  { icon: Factory, text: "Sopstveni brendovi" },
  { icon: BookOpen, text: "Katalozi" },
  { icon: Wrench, text: "Servis u Beogradu" },
];

export const STATS = [
  { value: "10.630+", label: "Veleprodajnih kupaca" },
  { value: "120+", label: "Dilera u Srbiji" },
  { value: "30+", label: "Zastupanih brendova" },
  { value: "2", label: "Lokacije u Beogradu" },
];
