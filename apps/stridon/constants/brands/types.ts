export type BilingualText = {
  sr: string;
  en: string;
};

export type BrandParagraph = {
  title: BilingualText;
  body: BilingualText;
};

export type BrandCatalog = {
  name: string;
  pdfUrl: string;
};

export type Brand = {
  slug: string;
  name: string;
  logoSrc: string;
  description: string;
  heroDescription: BilingualText;
  paragraphs: BrandParagraph[];
  catalogs: BrandCatalog[];
  color: string;
  storeUrl: string;
};
