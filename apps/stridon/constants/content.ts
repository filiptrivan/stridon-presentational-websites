export type Stat = {
  value: string;
  label: string;
};

export type Testimonial = {
  image: string;
  company: string;
  name: string;
  quote: string;
};

export type AboutSection = {
  year: string;
  title: string;
  body: string;
};

export const STATS: Stat[] = [
  { value: "60.000+", label: "Artikala u ponudi" },
  { value: "19", label: "Brendova koje zastupamo" },
  { value: "98%", label: "Zadovoljstvo uslugom" },
  { value: "2009.", label: "Godina osnivanja" },
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
    name: "Sladimir Ilić",
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
    year: "2009",
    title: "Osnivanje",
    body: "Naša firma Stridon Group doo je osnovana 2009. godine u Beogradu sa sedištem u ulici Borivoja Stevanovića, a maloprodajnim objektom na adresi Vojislava Ilića 141g. Nakon par godina uspeli smo da otvorimo još jedan prodajni objekat na drugoj strani Beograda — Ugrinovačka 212 (Altina), kako bismo omogućili kupcima u svim delovima Beograda stabilno i povoljno snabdevanje alatom.",
  },
  {
    year: "Veleprodaja",
    title: "Veleprodaja i maloprodaja",
    body: "Mi smo firma koja se bavi trgovinom na veliko i malo, kao i internet prodajom što nas čini jedinstvenim u svetu alata u Srbiji. Prodajemo brendove ručnog i električnog alata, pribora, zaštitne opreme, baštenskog alata, usisivača i još toliko toga! Ovlašćeni smo uvoznici i distributeri ogromnog broja svetskih i domaćih brendova.",
  },
  {
    year: "Online",
    title: "Internet prodavnica",
    body: "Na našoj internet prodavnici možete pronaći preko 60.000 artikala i najveća smo online prodavnica alata u Srbiji. Bilo da imate građevinsku firmu, ili da ste trgovac alatima, ili samo DIY entuzijasta, mi smo pravi dobavljač alata za vas! Naša firma je najbolji distributer Bosch alata 9 godina u nizu, a od ove godine smo i najbolji distributer DeWalt, Stanley i Black+Decker alata u Srbiji!",
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
