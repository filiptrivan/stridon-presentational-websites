export type BilingualLabel = { sr: string; en: string };

export type Stat = {
  value: string;
  label: BilingualLabel;
};

export type Testimonial = {
  image: string;
  company: string;
  name: string;
  quote: string;
};

export type AboutSection = {
  year: BilingualLabel;
  title: BilingualLabel;
  body: BilingualLabel;
};

export const STATS: Stat[] = [
  { value: "10.630+", label: { sr: "Veleprodajnih kupaca", en: "Wholesale customers" } },
  { value: "120+", label: { sr: "Dilera širom Srbije", en: "Dealers throughout Serbia" } },
  { value: "100%", label: { sr: "Zadovoljstvo uslugom", en: "Satisfaction with service" } },
  { value: "30+", label: { sr: "Brendova koje zastupamo", en: "Brands we represent" } },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    image: "/testimonials/enterijerjankovic.png",
    company: "ENTERIJER JANKOVIC",
    name: "Jelena Simić",
    quote:
      "Vrlo dobro iskustvo u radu sa firmom Stridon Group. Odlični u komunikaciji, drže se rokova, uvek imaju dobar profesionalni savet i alat na lageru!",
  },
  {
    image: "/testimonials/galens.png",
    company: "Galens",
    name: "Miodrag Pećanac",
    quote:
      "Koliki god da projekat počinjete, Stridon uvek ima dovoljno alata za vas. Isporuka sutradan, alati kvalitetni, a želja da se kupcu istinski pomogne - nemerljiva!",
  },
  {
    image: "/testimonials/termotim.png",
    company: "TERMO TIM",
    name: "Goran Sobić",
    quote:
      "Jednostavna i brza svakodnevna saradnja. Ljudi koji su uvek spremni da izađu u susret potrebama kupaca.",
  },
  {
    image: "/testimonials/mbmrad2.png",
    company: "MBM RAD",
    name: "Goran Šotra",
    quote:
      "Saveti profesionalnih prodavaca Stridona doveli su do skraćenja rada naše firme na pojedinim delovima projekata i do 50%!",
  },
  {
    image: "/testimonials/hidroina2.png",
    company: "HIDRO INA",
    name: "Zoran Aćimović",
    quote:
      "Firma koja uvek zna šta našoj firmi treba. Neprocenjivi prijateljski saveti i rešenja koja samo veliki profesionalci u svom poslu znaju. Sve preporuke za Stridon!",
  },
  {
    image: "/testimonials/ingradnjaa.png",
    company: "IN GRADNJA",
    name: "Miloš Veselinović",
    quote:
      "Veliki profesionalci i dobri ljudi, uvek spremni da ispune zahteve i rokove. Sve preporuke za bilo koju vrstu saradnje.",
  },
  {
    image: "/testimonials/silmaxlogo.png",
    company: "SILMAX doo",
    name: "Sladijan Ilić",
    quote:
      "Odličan lager alata i poznavanje potreba kupaca. Takođe, veliki broj brendova koje Stridon uvozi, čini ih nezaobilaznim svakodnevnim dobavljačem!",
  },
  {
    image: "/testimonials/coligoars2.png",
    company: "COLLIGO ARS",
    name: "Dragan Ćeranić",
    quote:
      "Verni saradnik na svim našim projektima. U dugogodišnjoj saradnji nas ni jednom nisu izneverili. Preporuke za firmu Stridon!",
  },
];

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    year: { sr: "2009", en: "2009" },
    title: { sr: "Osnivanje", en: "Foundation" },
    body: {
      sr: "Naša firma Stridon Group doo je osnovana 2009. godine u Beogradu sa sedištem u ulici Borivoja Stevanovića, a maloprodajnim objektom na adresi Vojislava Ilića 141g. Nakon par godina uspeli smo da otvorimo još jedan prodajni objekat na drugoj strani Beograda — Ugrinovačka 212 (Altina), kako bismo omogućili kupcima u svim delovima Beograda stabilno i povoljno snabdevanje alatom.",
      en: "Stridon Group doo was founded in 2009 in Belgrade, with headquarters on Borivoja Stevanovića street and a retail location at Vojislava Ilića 141g. A few years later, we opened a second store on the other side of Belgrade — Ugrinovačka 212 (Altina) — to provide customers across all parts of Belgrade with reliable and affordable access to tools.",
    },
  },
  {
    year: { sr: "Veleprodaja", en: "Wholesale" },
    title: { sr: "Veleprodaja i maloprodaja", en: "Wholesale and retail" },
    body: {
      sr: "Mi smo firma koja se bavi trgovinom na veliko i malo, kao i internet prodajom što nas čini jedinstvenim u svetu alata u Srbiji. Prodajemo brendove ručnog i električnog alata, pribora, zaštitne opreme, baštenskog alata, usisivača i još toliko toga! Ovlašćeni smo uvoznici i distributeri ogromnog broja svetskih i domaćih brendova.",
      en: "We are a company engaged in wholesale, retail, and online sales, which makes us unique in the Serbian tool market. We carry brands of hand and power tools, accessories, protective equipment, garden tools, vacuums, and much more. We are authorized importers and distributors of a large number of global and domestic brands.",
    },
  },
  {
    year: { sr: "Online", en: "Online" },
    title: { sr: "Internet prodavnica", en: "Online store" },
    body: {
      sr: "Na našoj internet prodavnici možete pronaći preko 60.000 artikala i najveća smo online prodavnica alata u Srbiji. Bilo da imate građevinsku firmu, ili da ste trgovac alatima, ili samo DIY entuzijasta, mi smo pravi dobavljač alata za vas! Naša firma je najbolji distributer Bosch alata 9 godina u nizu, a od ove godine smo i najbolji distributer DeWalt, Stanley i Black+Decker alata u Srbiji!",
      en: "Our online store offers over 60,000 items, making us the largest online tool retailer in Serbia. Whether you run a construction company, trade in tools, or are a DIY enthusiast, we are the right supplier for you. Our company has been the best Bosch tools distributor for 9 consecutive years, and this year we also became the best distributor of DeWalt, Stanley and Black+Decker tools in Serbia!",
    },
  },
];

export const SERVICE_BRANDS = [
  "DeWalt",
  "Bosch",
  "Makita",
  "Metabo",
  "Festool",
  "Rubi",
  "Senco",
];
