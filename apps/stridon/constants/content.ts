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
import type { LucideIcon } from "lucide-react";

/**
 * Icons and figures only: the copy that goes with each of these lives under
 * `Home` in `messages/`, keyed by the `key` below.
 *
 * These are module constants, evaluated once when the module loads, so there is
 * no request and no locale here to read a translation with. The page that
 * renders them has both, and pairs the two up.
 */
export const FEATURES: readonly { key: string; icon: LucideIcon }[] = [
  { key: "import", icon: ShieldCheck },
  { key: "brands", icon: Layers },
  { key: "wholesale", icon: BadgePercent },
  { key: "delivery", icon: Truck },
];

// Dealer-facing, deliberately different from the FEATURES row above them.
export const CTA_TRUST_BADGES: readonly { key: string; icon: LucideIcon }[] = [
  { key: "portal", icon: Globe },
  { key: "ownBrands", icon: Factory },
  { key: "catalogs", icon: BookOpen },
  { key: "service", icon: Wrench },
];

/**
 * Order only. Both the figure and its label are translated: Serbian groups
 * thousands with a dot ("10.630+") and English with a comma, so the number is
 * not the locale-independent half it looks like.
 */
export const STAT_KEYS = ["customers", "dealers", "brands", "locations"] as const;
