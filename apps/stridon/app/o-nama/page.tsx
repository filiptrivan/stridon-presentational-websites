import OwnBrand from "@/components/own-brand";
import {
  ABOUT_MILESTONES,
  CLIENT_LOGOS,
  OWN_BRANDS,
  PARTNER_QUOTES,
} from "@/constants/about";
import Companies from "@brand/shared/components/companies";
import CompanyValues from "@brand/shared/components/company-values";
import HeroHeader from "@brand/shared/components/hero-header";
import Testimonials from "@brand/shared/components/testimonials";
import { createPageMetadata } from "@brand/shared/lib/metadata";

export const metadata = createPageMetadata({
  title: "O nama",
  description:
    "Stridon Group je zvanični uvoznik i distributer profesionalnog alata u Srbiji, sa sopstvenim brendovima SG TOOLS i DCK, servisom i mrežom od preko 120 dilera.",
  canonicalUrl: "/o-nama",
});

const ONamaPage = () => {
  return (
    <div>
      <HeroHeader
        title="Uvoz, distribucija i servis alata od 30 godina"
        description="Stridon Group je porodična firma iz Beograda. Uvozimo i distribuiramo profesionalni alat, stojimo iza sopstvenih brendova i držimo servis u svojim rukama."
      />

      <CompanyValues
        milestones={ABOUT_MILESTONES}
        title="Kako je nastao Stridon Group"
      />
      <OwnBrand brand={OWN_BRANDS[0]} />
      <OwnBrand brand={OWN_BRANDS[1]} />
      <Testimonials
        items={PARTNER_QUOTES}
        title="Šta naši saradnici kažu o nama"
      />
      <Companies companies={CLIENT_LOGOS} title="Ko su naši klijenti" />
    </div>
  );
};

export default ONamaPage;
