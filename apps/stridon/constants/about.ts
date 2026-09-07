export interface OwnBrand {
  name: string;
  /** Section heading used on the homepage and on /o-nama. */
  heading: string;
  /** Photo used on the homepage sections instead of the logo panel. */
  image: { src: string; alt: string };
  paragraphs: string[];
  href: string;
  linkLabel: string;
}

export interface PartnerQuote {
  company: string;
  logo: string;
  quote: string;
}

export interface ClientLogo {
  src: string;
  alt: string;
}

export interface Milestone {
  date: string;
  title: string;
  description: string;
  image: { src: string; alt: string; contain?: boolean };
}

// The company timeline, same story the sg-tools site tells (it is the same
// family business). Kept verbatim from apps/sg-tools/constants/content.ts.
export const ABOUT_MILESTONES: Milestone[] = [
  {
    date: "1996.",
    title: "Prva tezga na Novobeogradskom buvljaku",
    description:
      "Naša priča počinje na jednoj tezgi Novobeogradskog buvljaka, gde su prodati prvi komadi alata i napravljene prve neraskidive veze sa kupcima.",
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
    image: {
      src: "/about/vojislava-ilica.webp",
      alt: "Radnja u ulici Vojislava Ilića",
    },
  },
  {
    date: "2014.",
    title: "Pokretanje prodavnicaalata.rs",
    description:
      "Ulaskom u online prodaju povezali smo iskustvo iz radnje sa širim tržištem i dodatno proširili kontakt sa kupcima širom Srbije.",
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
    image: {
      src: "/about/altina.webp",
      alt: "Radnja na Altini",
    },
  },
  {
    date: "2023.",
    title: "Pokretanje brenda SG TOOLS",
    description:
      "SG TOOLS je nastao kao prirodan nastavak tog puta, sa ciljem da ponudi alat koji je pouzdan, funkcionalan i cenovno pristupačan.",
    image: {
      src: "/about/dck-trade-show-booth.webp",
      alt: "DCK štand na sajmu alata",
    },
  },
];

export const OWN_BRANDS: OwnBrand[] = [
  {
    name: "SG TOOLS",
    heading: "SG Tools - naš sopstveni brend",
    paragraphs: [
      "Pored svetskih proizvođača koje uvozimo i distribuiramo, Stridon Group stoji i iza sopstvene linije alata. SG TOOLS je nastao iz porodičnog posla sa alatom dugog 30 godina.",
      "Iza svakog SG TOOLS proizvoda stoji ista garancija, tehnička podrška i servis kao i kod uvoznih brendova, samo bez posrednika između proizvodnje i police.",
    ],
    image: { src: "/about/altina.webp", alt: "Radnja na Altini" },
    href: "https://www.sgtools.rs",
    linkLabel: "Poseti sgtools.rs",
  },
  {
    name: "DCK",
    heading: "DCK alati",
    paragraphs: [
      "DCK je profesionalni brend kompanije Dongcheng, sa skoro tri decenije iskustva, sopstvenom proizvodnjom i distribucijom u preko sto zemalja sveta.",
      "Kod nas je DCK dostupan sa punom podrškom: brushless akumulatorski program, tri godine garancije i servis u Srbiji. Ceo asortiman i tehnički detalji su na posebnom sajtu brenda.",
    ],
    image: {
      src: "/about/dck-trade-show-booth.webp",
      alt: "DCK štand na sajmu alata",
    },
    href: "https://www.dcksrbija.rs",
    linkLabel: "Poseti dcksrbija.rs",
  },
];

// Verbatim from the old stridon.rs homepage.
export const PARTNER_QUOTES: PartnerQuote[] = [
  {
    company: "IN GRADNJA",
    logo: "/companies/svgs/ingradnja.svg",
    quote:
      "Veliki profesionalci i dobri ljudi, uvek spremni da ispune zahteve i rokove. Sve preporuke za bilo koju vrstu saradnje.",
  },
  {
    company: "Enterijer Janković",
    logo: "/companies/svgs/enterijerjankovic.svg",
    quote:
      "Vrlo dobro iskustvo u radu sa firmom Stridon Group. Odlični u komunikaciji, drže se rokova, uvek imaju dobar profesionalni savet i alat na lageru!",
  },
  {
    company: "Hidro Ina",
    logo: "/companies/svgs/hidroina.svg",
    quote:
      "Firma koja uvek zna šta našoj firmi treba. Neprocenjivi prijateljski saveti i rešenja koja samo veliki profesionalci u svom poslu znaju. Sve preporuke za Stridon!",
  },
  {
    company: "Termo Tim",
    logo: "/companies/svgs/termotim.svg",
    quote:
      "Jednostavna i brza svakodnevna saradnja. Ljudi koji su uvek spremni da izađu u susret potrebama kupaca.",
  },
  {
    company: "SILMAX doo",
    logo: "/companies/svgs/silmaxlogo.svg",
    quote:
      "Odličan lager alata i poznavanje potreba kupaca. Takođe, veliki broj brendova koje Stridon uvozi, čini ih nezaobilaznim svakodnevnim dobavljačem!",
  },
  {
    company: "MBM RAD",
    logo: "/companies/svgs/mbmrad.svg",
    quote:
      "Saveti profesionalnih prodavaca Stridona doveli su do skraćenja rada naše firme na pojedinim delovima projekata i do 50%!",
  },
  {
    company: "Galens",
    logo: "/companies/svgs/galens.svg",
    quote:
      "Koliki god da projekat počinjete, Stridon uvek ima dovoljno alata za vas. Isporuka sutradan, alati kvalitetni, a želja da se kupcu istinski pomogne je nemerljiva!",
  },
  {
    company: "COLLIGO ARS",
    logo: "/companies/svgs/coligoars.svg",
    quote:
      "Verni saradnik na svim našim projektima. U dugogodišnjoj saradnji nas ni jednom nisu izneverili. Preporuke za firmu Stridon!",
  },
];

export const CLIENT_LOGOS: ClientLogo[] = [
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
