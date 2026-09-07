import { BRANDS, type Brand } from "@/constants/brands";

export interface Catalog {
  slug: string;
  name: string;
  description: string;
  /** Slug of the brand in `BRANDS` this catalog belongs to. */
  brandSlug: string;
  /** The PDF itself. Still the Google Drive share links the old site used. */
  fileUrl: string;
}

// Seeded from the old stridon.rs /katalozi page. Same story as BRANDS: once
// PACMS returns catalogs per manufacturer, this constant is what the fetch
// replaces - `getCatalogsByBrand()` keeps the shape the page renders.
export const CATALOGS: Catalog[] = [
  {
    slug: "dewalt-najprodavanije-2023",
    name: "Dewalt najprodavanije 2023",
    description: "Ovaj katalog predstavlja najnovije proizvode i alate koje je Dewalt ponudio tokom 2023. godine. Otkrijte širok spektar Dewalt proizvoda koji su postali prva opcija za profesionalce i entuzijaste širom sveta.",
    brandSlug: "dewalt",
    fileUrl: "https://drive.google.com/file/d/1RuMzUGAO4sBoTsBYby_-qGIo5jlFirfP/view?usp=share",
  },
  {
    slug: "dewalt-ograniceno-izdanje",
    name: "Dewalt ograničeno izdanje",
    description: "U ovoj ekskluzivnoj paleti proizvoda otkrićete alate i opremu koje ne samo da ispunjavaju, već i prevazilaze najviše standarde industrije. Dewaltova ograničena izdanja namenjena su onima koji zahtevaju najbolje.",
    brandSlug: "dewalt",
    fileUrl: "https://drive.google.com/file/d/13y1RuBHKXtsudGYMzIi67ym4w5rb3jew/view?usp=share",
  },
  {
    slug: "bosch-diy-merni-alati",
    name: "Bosch DIY merni alati",
    description: "Upoznajte se sa najnovijim cenovnikom Bosch DIY mernih alata za jun 2023. Ovaj sveobuhvatni cenovnik donosi najaktuelnije informacije o raspoloživim mernim alatima za kućne majstore i entuzijaste.",
    brandSlug: "bosch",
    fileUrl: "https://drive.google.com/file/d/1BK8KkkGrq2n9J9x3M0ZysdQ24MdhjAqe/view?usp=share",
  },
  {
    slug: "bosch-pribor",
    name: "Bosch pribor",
    description: "Otkrijte najnovije ponude u našem cenovniku Bosch pribora za mesec jul 2023. Pregledajte bogat izbor vrhunskog Bosch pribora koji će unaprediti vaše alate i olakšati vaše projekte.",
    brandSlug: "bosch",
    fileUrl: "https://drive.google.com/file/d/1oVevfXbBrPfboKAJIQA62reSEowTyio7/view?usp=share",
  },
  {
    slug: "bosch-dremel",
    name: "Bosch Dremel",
    description: "Istražite najnoviji cenovnik Dremel alata i pribora za jun 2023. U našem cenovniku možete pronaći bogat izbor visokokvalitetnih Dremel alata i pribora koji će ispuniti sve vaše kreativne potrebe.",
    brandSlug: "bosch",
    fileUrl: "https://drive.google.com/file/d/1xdVeZDXHNFhN3AwYE6XSW5dzVtcB_hSG/view?usp=share",
  },
  {
    slug: "bosch-expert",
    name: "Bosch EXPERT",
    description: "Upoznajte se sa našim 'EXPERT Mini katalogom pribora'! U ovom posebnom izdanju, predstavljamo vam široku paletu visokokvalitetnog pribora koji će zadovoljiti sve vaše potrebe.",
    brandSlug: "bosch",
    fileUrl: "https://drive.google.com/file/d/1rpkCB0d9SXnuQ3Pg1WXzV3yUKCLhICSz/view?usp=share",
  },
  {
    slug: "bosch-plavi",
    name: "Bosch Plavi",
    description: "Pregledajte naš neobavezno preporučeni cenovnik Plavih alata za jul 2023. Ovaj cenovnik donosi vam širok izbor vrhunskih alata koji su sinonim za kvalitet i pouzdanost.",
    brandSlug: "bosch",
    fileUrl: "https://drive.google.com/file/d/1lEwdsuzYNCMiq997mi2cS2jvPXfc6p88/view?usp=share",
  },
  {
    slug: "bosch-vp-cenovnik",
    name: "Bosch VP cenovnik",
    description: "Pregledajte naš neobavezno preporučeni VP cenovnik PRO Mernih alata za jun 2023. U ovom cenovniku vam donosimo širok asortiman vrhunskih PRO Mernih alata koji su dizajnirani za profesionalce i najzahtevnije projekte.",
    brandSlug: "bosch",
    fileUrl: "https://drive.google.com/file/d/1966qI7dLpBlcsJkuEoaoxc9XzvShqH-H/view?usp=share",
  },
  {
    slug: "stanley-katalog",
    name: "Stanley katalog",
    description: "Stanley katalog predstavlja neiscrpan izvor alata i opreme koji je namenjen kako profesionalnim majstorima, tako i entuzijastima koji cene kvalitetne proizvode. Stanley, prepoznatljiv brend sa dugom tradicijom.",
    brandSlug: "stanley",
    fileUrl: "https://drive.google.com/file/d/1B7teaotZAfVehBOZt-ENZvG3kRFScO9i/view?usp=drive_link",
  },
  {
    slug: "gtv-katalog",
    name: "GTV katalog",
    description: "Pregledajte najnoviji GTV katalog za jun 2023. U ovom katalogu vam donosimo širok asortiman proizvoda i alata za vaše projekte i zadatke.",
    brandSlug: "gtv",
    fileUrl: "https://drive.google.com/file/d/1O7cEdZPw2CyvNTsxmfR7ZpL9GAXlpJ5k/view?usp=share",
  },
  {
    slug: "hogert-elektricarski-alati",
    name: "Hogert električarski alati",
    description: "Upoznajte se sa našim cenovnikom Hogert električarskih alata za jun 2023. Ovaj cenovnik vam donosi širok asortiman visokokvalitetnih električarskih alata za sve vaše električarske potrebe.",
    brandSlug: "hogert",
    fileUrl: "https://drive.google.com/file/d/1hIUpfarX9a1t8VKnGRGQabIm0u2eNwdh/view?usp=share",
  },
  {
    slug: "hogert-htz",
    name: "Hogert HTZ",
    description: "Otkrijte najnovije ponude u našem cenovniku Hogert HTZ opreme za jun 2023. Pregledajte bogat izbor HTZ opreme koja će vam pomoći da obavite poslove sa sigurnošću i efikasnošću.",
    brandSlug: "hogert",
    fileUrl: "https://drive.google.com/file/d/16VbxheVuQsX2_aXxc61DBd4Gn0NqcgKZ/view?usp=share",
  },
  {
    slug: "hogert-odeca-katalog",
    name: "Hogert odeća katalog",
    description: "Pregledajte najnoviji Hogert katalog odeće za jun 2023. U ovom katalogu vam donosimo širok asortiman radne odeće koja će vam pružiti zaštitu i udobnost tokom radnih aktivnosti.",
    brandSlug: "hogert",
    fileUrl: "https://drive.google.com/file/d/1CX8oW1BicRW6SdUNhOAxamVy_Y1dnUCw/view?usp=share",
  },
  {
    slug: "hogert-rucni-alati",
    name: "Hogert ručni alati",
    description: "Otkrijte naš katalog Hogert ručnih alata za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih Hogert ručnih alata koji su dizajnirani za profesionalce i najzahtevnije projekte.",
    brandSlug: "hogert",
    fileUrl: "https://drive.google.com/file/d/1hFN3PuIF2n-LS86D3cGeI0sIlmXoMUTe/view?usp=share",
  },
  {
    slug: "karcher-profesionalni-program-katalog",
    name: "Karcher profesionalni program katalog",
    description: "Pregledajte naš katalog Karcher profesionalnih mašina za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih Karcher profesionalnih mašina koje će zadovoljiti sve vaše zahtevne potrebe.",
    brandSlug: "karcher",
    fileUrl: "https://drive.google.com/file/d/1rCZ63RGygIn4IeTTar4sLetDzc7UUoaJ/view?usp=share",
  },
  {
    slug: "karcher-zuti-program-katalog",
    name: "Karcher žuti program katalog",
    description: "Otkrijte naš katalog Karcher žutog programa za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih Karcher proizvoda koji će vas opremiti za raznovrsne zadatke.",
    brandSlug: "karcher",
    fileUrl: "https://drive.google.com/file/d/14ERZxuCZexyQZ0rNtbBUXGXKjzZm_x5Q/view?usp=share",
  },
  {
    slug: "knipex-katalog",
    name: "Knipex katalog",
    description: "Pregledajte naš katalog Knipex alata za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih Knipex alata koji su dizajnirani za profesionalce i najzahtevnije projekte.",
    brandSlug: "knipex",
    fileUrl: "https://drive.google.com/file/d/1YgRP6jOCM6D4apCU-mRM_3mNn2yWiTpN/view?usp=share",
  },
  {
    slug: "kwb-akku-top-pribor-za-aku-alate",
    name: "KWB AKKU TOP pribor za aku alate",
    description: "Otkrijte naš katalog KWB AKKU TOP pribora za aku alate za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih KWB AKKU TOP pribora koji će olakšati vaš rad sa aku alatima.",
    brandSlug: "kwb",
    fileUrl: "https://drive.google.com/file/d/14yFw6dV6jnzqwOksY9_AECaI6wX3K8te/view?usp=share",
  },
  {
    slug: "kwb-dodaci-za-masine-katalog",
    name: "KWB dodaci za mašine katalog",
    description: "Pregledajte naš katalog KWB dodataka za mašine za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih KWB dodataka za mašine koji će unaprediti vaše performanse.",
    brandSlug: "kwb",
    fileUrl: "https://drive.google.com/file/d/1CpjLO7fBAU_twmPZy5KfHNJk27BG0MhV/view?usp=share",
  },
  {
    slug: "kwb-pribor",
    name: "KWB pribor",
    description: "Otkrijte naš katalog KWB pribora za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih KWB pribora koji će vam biti verni partneri na radnom mestu.",
    brandSlug: "kwb",
    fileUrl: "https://drive.google.com/file/d/1E06fPvQOqKfLGxCzWH-nh_GQYfK2XtOz/view?usp=share",
  },
  {
    slug: "max-katalog",
    name: "MAX katalog",
    description: "Pregledajte naš katalog MAX alata za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih MAX alata koji su pouzdani saveznici u vašim projektima.",
    brandSlug: "max",
    fileUrl: "https://drive.google.com/file/d/1k3AzwfcE_RlB8xJiO1Tp1nZQwrnEyZje/view?usp=share",
  },
  {
    slug: "mtx-sparta-katalog",
    name: "MTX, Sparta katalog",
    description: "Pregledajte naš katalog MTX i Sparta alata za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih MTX i Sparta alata koji su dizajnirani za različite potrebe.",
    brandSlug: "mtx",
    fileUrl: "https://drive.google.com/file/d/1wASvbffFJGKsAIN9fb1R48XCrtJmYXkM/view?usp=share",
  },
  {
    slug: "rems-akcija-2023",
    name: "Rems akcija 2023",
    description: "Pregledajte naš katalog Rems akcija za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih Rems alata i opreme za vaše radne zadatke.",
    brandSlug: "rems",
    fileUrl: "https://drive.google.com/file/d/1S_H99PFic4pdtzFZOw2lSC0URAo6YFcV/view?usp=share",
  },
  {
    slug: "rubi-akcija-2023",
    name: "Rubi akcija 2023",
    description: "Pregledajte naš katalog Rubi za ovu sezonu na engleskom jeziku. U ovom katalogu vam donosimo širok asortiman vrhunskih Rubi alata koji će zadovoljiti potrebe profesionalnih majstora.",
    brandSlug: "rubi",
    fileUrl: "https://drive.google.com/file/d/1Pu0Sd3ZYpC0pF6NHKWoyE0qMG8Upuxv7/view?usp=share",
  },
  {
    slug: "wera-katalog",
    name: "Wera katalog",
    description: "Pregledajte naš katalog Wera alata za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih Wera alata koji su poznati po svojoj kvaliteti i inovacijama.",
    brandSlug: "wera",
    fileUrl: "https://drive.google.com/file/d/140HnM3JRm2k_F4iF_j46tbchAST-S45O/view?usp=share",
  },
  {
    slug: "wiha-katalog",
    name: "Wiha katalog",
    description: "Otkrijte naš katalog Wiha alata za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih Wiha alata koji su dizajnirani za preciznost i pouzdanost.",
    brandSlug: "wiha",
    fileUrl: "https://drive.google.com/file/d/1s2s4TmSn_7inwljmfF0mznbdVXWMGEDJ/view?usp=share",
  },
  {
    slug: "wiha-merni-alati",
    name: "Wiha merni alati",
    description: "Pregledajte naš katalog Wiha mernih alata za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih Wiha mernih alata koji će vam pomoći u tačnom merenju.",
    brandSlug: "wiha",
    fileUrl: "https://drive.google.com/file/d/196RbKP5DyiWkJnqvOx1ML10Gby4M2CiG/view?usp=share",
  },
  {
    slug: "wiha-xxl-iii-kofer",
    name: "Wiha XXL III kofer",
    description: "Otkrijte naš katalog Wiha XXL III kofera za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih Wiha alata koji su smešteni u praktičnom koferu.",
    brandSlug: "wiha",
    fileUrl: "https://drive.google.com/file/d/1gfqq3qQRqocaSAXVwRm-3s9lGDpyDNbn/view?usp=share",
  },
  {
    slug: "wolfcraft-katalog",
    name: "Wolfcraft katalog",
    description: "Pregledajte naš katalog Wolfcraft alata za ovu sezonu. U ovom katalogu vam donosimo širok asortiman vrhunskih Wolfcraft alata koji će vam biti verni saradnici u vašim projektima.",
    brandSlug: "wolfcraft",
    fileUrl: "https://drive.google.com/file/d/1SU0y0Lr9TvJqvX0t20R44H6HxHLiWaZJ/view?usp=share",
  },
];

export interface BrandCatalogs {
  brand: Brand;
  catalogs: Catalog[];
}

// Grouped in BRANDS order (roster order = prominence), brands without a
// catalog left out. The brand pages deep-link here via /katalozi#<slug>.
export function getCatalogsByBrand(): BrandCatalogs[] {
  return BRANDS.map((brand) => ({
    brand,
    catalogs: CATALOGS.filter((catalog) => catalog.brandSlug === brand.slug),
  })).filter((group) => group.catalogs.length > 0);
}

// Four brands have no catalog yet (Senco, Black+Decker, Sparta, SG Tools),
// so their brand page drops the catalog button instead of linking nowhere.
export function hasCatalogs(brandSlug: string): boolean {
  return CATALOGS.some((catalog) => catalog.brandSlug === brandSlug);
}
