import { pathFor } from "@/lib/nav";
import type { Locale } from "@brand/i18n/config";

/**
 * The legal pages are documents, not UI: their bodies live in `messages/` as
 * one HTML string each and render through `Prose`, the same way a CMS brand
 * description does. Breaking a page of statutory prose into forty ICU keys
 * would make it unreadable in both languages and impossible to check against
 * the text a lawyer approved.
 *
 * The only thing a body cannot spell for itself is an internal link, because
 * `/politikaprivatnosti` is `/en/privacy-policy` in the other locale. Those
 * two are left as tokens and filled in here. The bodies are ours, not user
 * input, so this is the same trust boundary the CMS copy already sits on.
 */
export function fillLegalLinks(html: string, locale: Locale): string {
  return html
    .replaceAll("__PRIVACY__", pathFor("/politikaprivatnosti", locale))
    .replaceAll("__CONTACT__", pathFor("/kontakt", locale));
}
