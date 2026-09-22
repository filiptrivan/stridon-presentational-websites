import { CONTACT_EMAIL } from "@/constants";
import { SITE_URL } from "@/constants/links";

/**
 * The statutory identification data, as the business register holds it.
 *
 * Facts rather than copy, which is why they are here and not in `messages/`:
 * an address or a PIB written into both catalogs is two strings that can drift,
 * and a wrong tax number on the English page is the kind of error nobody reads
 * for. The one field that has a language is the activity name, which lives in
 * `Legal.identification.activity` beside its official English wording - the
 * code itself, 4615, is the same in both.
 */
export const COMPANY_DETAILS = {
  legalName: "STRIDON GROUP DOO",
  address: "Vojislava Ilića 141g",
  activityCode: "4615",
  registrationNumber: "20588012",
  taxNumber: "106376570",
  /** The register lists the site with its trailing slash. */
  website: `${SITE_URL}/`,
  phone: "+381-69-8058-374",
  email: CONTACT_EMAIL,
} as const;
