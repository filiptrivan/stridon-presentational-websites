export { cn } from "@brand/ui/lib/utils";

/**
 * Converts a Serbian local phone number (e.g. "011/4520-171") to a tel: URI.
 * Strips the leading 0 and any separators (/ and -), then prepends +381.
 */
export function formatTelHref(number: string): string {
  return `tel:+381${number.replace(/^0/, "").replace(/[\/-]/g, "")}`;
}

export function parsePageParam(strana: string | undefined): number {
  return Math.max(1, parseInt(strana ?? "1", 10) || 1);
}
