export { cn } from "@brand/ui/lib/utils";

/**
 * Converts a phone number as written for a human into a dialable tel: URI.
 *
 * Two shapes actually reach this, and the earlier version handled only one:
 * the Serbian local form ("011/4520-171", "065/337-8812") and an already
 * international one ("+381-21-410000", which is how dck spells its service
 * centres). Prepending +381 to the latter produced "tel:+381+38121410000",
 * which does not dial - visible today in the dealer list, where the service
 * centres are mapped into DEALERS.
 *
 * Separators are never dialable in either shape, so they go first; a number
 * that already carries a country code is then left alone.
 */
export function formatTelHref(number: string): string {
  const compact = number.replace(/[\s/-]/g, "");
  return compact.startsWith("+")
    ? `tel:${compact}`
    : `tel:+381${compact.replace(/^0/, "")}`;
}

// Abuse guard, not a ceiling: at 12 per page it clears 1.2M products, so a
// clamped page is past the last one and redirects to page 1 like any other.
// Unclamped, a page above 178,956,971 overflows PACMS's int32 `first`: a 400
// there, a 500 here. Same value as pa-storefront's MAX_ADDRESSABLE_PAGE.
const MAX_PAGE = 100_000;

export function parsePageParam(strana: string | undefined): number {
  return Math.min(MAX_PAGE, Math.max(1, parseInt(strana ?? "1", 10) || 1));
}
