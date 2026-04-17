import WarrantyForm from "@/components/warranty/warranty-form";
import { SERVICE_CENTERS } from "@/constants/service-centers";
import ContactLocations from "@brand/shared/components/contact/contact-locations";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { createPageMetadata } from "@brand/shared/lib/metadata";

export const metadata = createPageMetadata({
  title: "Produžetak garancije",
  description:
    "Produži garanciju na svoj DCK alat - brzo, jednostavno i potpuno besplatno.",
  canonicalUrl: "/produzetak-garancije",
});

const WarrantyExtensionPage = () => {
  return (
    <div>
      <HeroHeader
        title="Produžetak garancije"
        description="Produži garanciju u roku od 4 nedelje od datuma kupovine i ostvari pravo na 3 godine garancije - i za hobi i za profesionalne korisnike. Bez produžetka garancija traje 2 godine za kućnu upotrebu, odnosno godinu dana za profesionalnu."
      />
      <Section>
        <Wrapper>
          <Container>
            <WarrantyForm />
          </Container>
        </Wrapper>
      </Section>
      <ContactLocations
        title="Ovlašćeni servisi"
        description="Ukoliko ti je potreban servis, pronađi najbliži ovlašćeni servisni centar"
        locations={SERVICE_CENTERS}
      />
    </div>
  );
};

export default WarrantyExtensionPage;
