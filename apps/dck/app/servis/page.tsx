import { SERVICE_CENTERS } from "@/constants/service-centers";
import ContactLocations from "@brand/shared/components/contact/contact-locations";
import HeroHeader from "@brand/shared/components/hero-header";
import { createPageMetadata } from "@brand/shared/lib/metadata";

export const metadata = createPageMetadata({
  title: "Servis",
  description:
    "Pronađi ovlašćeni servisni centar za DCK alate u Srbiji - Novi Sad i Beograd.",
  canonicalUrl: "/servis",
});

const ServisPage = () => {
  return (
    <div>
      <HeroHeader
        title="Ovlašćeni servisi"
        description="Pronađi najbliži ovlašćeni servisni centar za popravku i održavanje DCK alata u Srbiji."
      />
      <ContactLocations
        locations={SERVICE_CENTERS}
        sectionClassName="pt-0!"
        showDivider={false}
      />
    </div>
  );
};

export default ServisPage;
