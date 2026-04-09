import WarrantyForm from "@/components/warranty/warranty-form";
import { SERVICE_CENTERS } from "@/constants/service-centers";
import ContactLocations from "@brand/shared/components/contact/contact-locations";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { createPageMetadata } from "@brand/shared/lib/metadata";

export const metadata = createPageMetadata({
  title: "Registracija garancije",
  description:
    "Registruj garanciju za svoj DCK alat — brzo, jednostavno i potpuno besplatno.",
  canonicalUrl: "/registracija-garancije",
});

const WarrantyRegistrationPage = () => {
  return (
    <div>
      <HeroHeader
        title="Registracija garancije"
        description="Registruj garanciju za svoj DCK alat — popuni formular ispod i osiguraj svoju garanciju brzo i jednostavno."
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

export default WarrantyRegistrationPage;
