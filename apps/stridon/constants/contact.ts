import { CONTACT_EMAIL } from "@/constants";
import type { ContactLocation } from "@brand/shared/types/contact";

export interface OpeningHours {
  days: string;
  hours: string;
}

// Nothing renders these two right now: `/kontakt` is the shared contact page,
// which is the form only. Kept because this is the real store data off the old
// site, already in the shape the shared ContactLocations card takes.
export const LOCATIONS: ContactLocation[] = [
  {
    name: "Vojislava Ilića",
    badge: "Veleprodaja, maloprodaja i uprava",
    address: "Vojislava Ilića 141g, 11000 Beograd",
    phone: "011/2886-509",
    email: CONTACT_EMAIL,
    coords: { lat: 44.785938, lng: 20.50069 },
  },
  {
    name: "Altina",
    badge: "Veleprodaja i maloprodaja",
    address: "Ugrinovačka 212, 11080 Zemun",
    phone: "011/210-0230",
    email: CONTACT_EMAIL,
    coords: { lat: 44.847689, lng: 20.369133 },
  },
];

export const WORKING_HOURS: OpeningHours[] = [
  { days: "Ponedeljak - petak", hours: "8:00 - 18:00" },
  { days: "Subota", hours: "9:00 - 15:00" },
  { days: "Nedelja", hours: "Neradan dan" },
];
