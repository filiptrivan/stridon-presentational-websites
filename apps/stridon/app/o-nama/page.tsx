import AboutTimeline from "@/components/about-timeline";
import Clients from "@/components/clients";
import OwnBrand from "@/components/own-brand";
import PageHeader from "@/components/page-header";
import PartnerQuotes from "@/components/partner-quotes";
import { OWN_BRANDS } from "@/constants/about";
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
      <PageHeader
        title="Uvoz, distribucija i servis alata od 30 godina"
        lede="Stridon Group je porodična firma iz Beograda. Uvozimo i distribuiramo profesionalni alat, stojimo iza sopstvenih brendova i držimo servis u svojim rukama."
      />

      <AboutTimeline />
      <OwnBrand brand={OWN_BRANDS[0]} />
      <OwnBrand brand={OWN_BRANDS[1]} />
      <PartnerQuotes />
      <Clients />
    </div>
  );
};

export default ONamaPage;
