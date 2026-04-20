import type { TrustBadge } from "@brand/shared/components/cta";
import type { FeatureItem } from "@brand/shared/components/features";
import {
  Clock,
  Gauge,
  Globe,
  GraduationCap,
  Layers,
  MapPin,
  Rocket,
  ShieldCheck,
  Speech,
  Store,
  Users,
  Wrench,
} from "lucide-react";

export const CTA_TRUST_BADGES: TrustBadge[] = [
  { icon: Clock, text: "30+ godina u alatima" },
  { icon: MapPin, text: "120+ dilera u Srbiji" },
  { icon: Users, text: "Podrška za partnere" },
  { icon: Layers, text: "Širok asortiman" },
];

export const FEATURES: FeatureItem[] = [
  {
    title: "Građen znanjem",
    desc: "Iza naših proizvoda stoje godine slušanja majstora.",
    icon: GraduationCap,
  },
  {
    title: "Kvalitet bez kompromisa",
    desc: "Pouzdani alati profesionalnog kvaliteta.",
    icon: ShieldCheck,
  },
  {
    title: "Širok asortiman",
    desc: "Preko 300 ručnih alata i pribora za sve tipove radova.",
    icon: Layers,
  },
  {
    title: "Performanse > cena",
    desc: "Performanse koje daleko prevazilaze cenovni rang.",
    icon: Gauge,
  },
];

export const STATS = [
  { value: "10630+", label: "Veleprodajnih kupaca" },
  { value: "120+", label: "Dilera širom Srbije" },
  { value: "30+", label: "Godina u alatima" },
];

export const ABOUT_MILESTONES = [
  {
    date: "1996.",
    title: "Prva tezga na Novobeogradskom buvljaku",
    description:
      "Naša priča počinje na jednoj tezgi Novobeogradskog buvljaka, gde su prodati prvi komadi alata i napravljene prve neraskidive veze sa kupcima.",
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    image: {
      src: "/about/buvljak.jpg",
      alt: "Tezga sa alatima na Novobeogradskom buvljaku",
    },
  },
  {
    date: "2009.",
    title: "Otvaranje radnje u Vojislava Ilića",
    description:
      "Otvaranjem prve radnje gradili smo iskustvo iz neposrednog kontakta sa kupcima i njihovim svakodnevnim potrebama.",
    icon: Store,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    image: {
      src: "/about/vojislava-ilica.jpeg",
      alt: "Radnja u ulici Vojislava Ilića",
    },
  },
  {
    date: "2014.",
    title: "Pokretanje prodavnicaalata.rs",
    description:
      "Ulaskom u online prodaju povezali smo iskustvo iz radnje sa širim tržištem i dodatno proširili kontakt sa kupcima širom Srbije.",
    icon: Globe,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    image: {
      src: "/about/prodavnicaalata.svg",
      alt: "Logo prodavnicaalata.rs",
      contain: true,
    },
  },
  {
    date: "2015.",
    title: "Otvaranje lokacije na Altini",
    description:
      "Širenjem poslovanja nastavili smo da učimo iz prakse i da još bolje razumemo šta tržište zaista traži od alata.",
    icon: Speech,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    image: {
      src: "/about/altina.jpeg",
      alt: "Radnja na Altini",
    },
  },
  {
    date: "2023.",
    title: "Pokretanje brenda SG TOOLS",
    description:
      "SG TOOLS je nastao kao prirodan nastavak tog puta, sa ciljem da ponudi alat koji je pouzdan, funkcionalan i cenovno pristupačan.",
    icon: Rocket,
    color: "text-rose-400",
    bg: "bg-rose-500/15",
    border: "border-rose-500/30",
    image: {
      src: "/sg-tools-logo.svg",
      alt: "SG TOOLS logo",
      contain: true,
    },
  },
];

export const COMPANY_BENEFITS = [
  {
    title: "Ergonomija na prvom mestu",
    description:
      "Alat mora prirodno ležati u ruci, pružati siguran hvat i omogućiti dugotrajan rad bez zamora.",
  },
  {
    title: "Pouzdan u radu",
    description:
      "Fokus je na funkcionalnim rešenjima koja imaju smisla u radionici, na terenu i na gradilištu.",
  },
  {
    title: "Balans cene i kvaliteta",
    description:
      "Cilj nam je da ponudimo alat koji traje i radi pouzdano, bez nepotrebnog preplaćivanja.",
  },
  {
    title: "Građen na vašim sugestijama",
    description:
      "Iza svakog proizvoda stoje godine slušanja majstora, instalatera i servisera koji tačno znaju šta od alata očekuju.",
  },
];

export const ABOUT_PARAGRAPHS = [
  "Naša priča počinje mnogo pre nego što je SG TOOLS dobio ime. Počela je 1996. godine, na tezgi Novobeogradskog buvljaka - iz bliskog kontakta sa kupcima i iz razumevanja šta ljudima zaista treba od alata. Od samog početka, alat za nas nije bio samo roba. Bio je sredstvo rada, poverenja i dugoročnog odnosa. Kroz godine smo učili direktno od vas - od majstora, hobista, instalatera i servisera koji tačno znaju šta od alata očekuju. Vaše sugestije nismo posmatrali kao komentare, već kao smernice.",
  "Materijale biramo promišljeno, sa naglaskom na trajnost i otpornost u realnim uslovima rada. Ergonomija za nas nije dodatak, već polazna tačka - alat mora prirodno ležati u ruci, pružati siguran hvat i omogućiti dugotrajan rad bez nepotrebnog zamora. Dizajn je uvek u službi funkcije, bez suvišnih detalja. Od izbora sirovina do završne obrade, ništa nije prepušteno slučaju. SG TOOLS je zajednički uspeh koji nastavljamo da gradimo zajedno sa našim kupcima - profesionalni kvalitet po cenama koje imaju smisla.",
];

export const HOME_ABOUT_PARAGRAPH =
  "SG TOOLS je brend koji je nastao prirodno, kao sledeći korak našeg porodičnog posla sa alatima. Nakon godina rada sa različitim proizvođačima, svakodnevnog kontakta sa kupcima i praćenja šta se zaista traži na tržištu, odlučili smo da razvijemo sopstveni brend. Cilj nam je bio jasan: da ponudimo alat koji je pouzdan, funkcionalan i cenovno pristupačan.";
