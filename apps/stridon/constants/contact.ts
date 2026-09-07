import { CONTACT_EMAIL } from "@/constants";

export interface StridonLocation {
  id: string;
  /** Short label - the way people actually refer to the location. */
  name: string;
  /** What happens there, one line. */
  role: string;
  address: string;
  city: string;
  /** Display form, exactly as printed on the old site. */
  phone: string;
  /** E.164 form for the tel: link. */
  phoneHref: string;
  email: string;
  coords: { lat: number; lng: number };
}

export interface OpeningHours {
  days: string;
  hours: string;
}

// Nothing renders these two right now: `/kontakt` went back to the shared
// contact page. Kept because this is the real store data off the old site.
export const LOCATIONS: StridonLocation[] = [
  {
    id: "vojislava-ilica",
    name: "Vojislava Ilića",
    role: "Veleprodaja, maloprodaja i uprava",
    address: "Vojislava Ilića 141g",
    city: "11000 Beograd",
    phone: "011/2886-509",
    phoneHref: "+381112886509",
    email: CONTACT_EMAIL,
    coords: { lat: 44.785938, lng: 20.50069 },
  },
  {
    id: "altina",
    name: "Altina",
    role: "Veleprodaja i maloprodaja",
    address: "Ugrinovačka 212",
    city: "11080 Zemun",
    phone: "011/210-0230",
    phoneHref: "+381112100230",
    email: CONTACT_EMAIL,
    coords: { lat: 44.847689, lng: 20.369133 },
  },
];

export const WORKING_HOURS: OpeningHours[] = [
  { days: "Ponedeljak - petak", hours: "8:00 - 18:00" },
  { days: "Subota", hours: "9:00 - 15:00" },
  { days: "Nedelja", hours: "Neradan dan" },
];
