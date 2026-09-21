import BrandLogo from "@/components/brand-logo";
import { BRAND_SLUGS } from "@/constants/brands";
import { SERVICE_CENTERS, SERVICED_BRAND_SLUGS } from "@/constants/service-centers";
import Container from "@brand/shared/components/container";
import ContactLocations from "@brand/shared/components/contact/contact-locations";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { getBrandCards } from "@brand/shared/lib/api";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Servis",
  description:
    "Servis električnih, akumulatorskih i ručnih alata van garantnog roka u Beogradu. SG Servis, Vojislava Ilića 141b.",
  canonicalUrl: "/servis",
});

const ServisPage = async () => {
  // Same cached entry the homepage brand wall and /katalozi read, so the names
  // and logos here cost no extra request. Only the brands we also distribute
  // get a link - Makita, Metabo and Festool are serviced, not imported.
  const cards = await getBrandCards();
  const bySlug = new Map(cards.map((card) => [card.slug, card]));
  const servicedBrands = SERVICED_BRAND_SLUGS.map((slug) => bySlug.get(slug))
    .filter((card) => card !== undefined)
    .map((card) => ({
      ...card,
      href: BRAND_SLUGS.includes(card.slug as (typeof BRAND_SLUGS)[number])
        ? `/brendovi/${card.slug}`
        : null,
    }));

  return (
    <div>
      <HeroHeader
        title="Servis alata van garancije u Beogradu"
        description="Servisiramo i održavamo električne, akumulatorske i ručne alate, za profesionalnu i za kućnu upotrebu."
      />

      <Section className="py-14 lg:py-20">
        <Wrapper>
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              Samo neki od brendova koje servisiramo
            </h2>
          </Container>

          <Container delay={0.5}>
            {/* Same card as the homepage brand wall and /brendovi: separated,
                rounded, hairline border. The three serviced-only brands get the
                identical card without the hover, since they link nowhere. */}
            <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {servicedBrands.map((brand) =>
                brand.href ? (
                  <Link
                    key={brand.slug}
                    href={brand.href}
                    className="overflow-hidden rounded-lg border border-border/60 bg-background transition-colors duration-300 hover:border-primary lg:rounded-xl"
                  >
                    <BrandLogo name={brand.name} logo={brand.imageUrl ?? null} />
                  </Link>
                ) : (
                  <div
                    key={brand.slug}
                    className="overflow-hidden rounded-lg border border-border/60 bg-background lg:rounded-xl"
                  >
                    <BrandLogo name={brand.name} logo={brand.imageUrl ?? null} />
                  </div>
                ),
              )}
            </div>
          </Container>
        </Wrapper>
      </Section>

      <Section className="py-14 lg:py-20">
        <Wrapper>
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              Servis alata pod garancijom
            </h2>
          </Container>

          <Container delay={0.5}>
            {/* Dashed like every other rule on the site, including the vertical
                one, so the block does not introduce a second line style. */}
            <div className="mt-10 grid border-t border-dashed border-border/70 md:grid-cols-2">
              <div className="border-b border-dashed border-border/70 py-8 md:border-r md:pr-10">
                <h3 className="font-heading text-xl font-semibold tracking-tight">
                  Alat je u garantnom roku
                </h3>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                  Ako je tvoj alat u garantnom roku i pokriva ga garancija
                  proizvođača, uputićemo te na ovlašćeni servis brenda kome
                  mašina pripada. Javi nam se, naći ćemo ti najbliži.
                </p>
              </div>

              <div className="border-b border-dashed border-border/70 py-8 md:pl-10">
                <h3 className="font-heading text-xl font-semibold tracking-tight">
                  Alat je van garantnog roka
                </h3>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                  Sve ostalo preuzima SG Servis: redovno održavanje, popravka i
                  dijagnostika kvara. Donesi alat na adresu servisa ili se prvo
                  javi telefonom da proveriš šta ti treba.
                </p>
              </div>
            </div>
          </Container>
        </Wrapper>
      </Section>

      <Section className="py-14 lg:py-20">
        <Wrapper>
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              SG Servis - naš pouzdani partner
            </h2>

            <div className="mt-5 max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                SG Servis je naš dugogodišnji saradnik za servisiranje
                električnih alata. Ekipa stručnjaka je specijalizovana za
                održavanje i popravku širokog spektra brendova, od redovnog
                servisa i popravke do dijagnostike kvara.
              </p>
              <p>
                Serviseri imaju bogato iskustvo sa najpoznatijim proizvođačima
                električnog alata, pa model i složenost kvara nisu prepreka. U
                ugradnju idu isključivo kvalitetni zamenski delovi, da bi alat
                ostao pouzdan i posle popravke.
              </p>
              <p>
                Radno vreme je od 8:00 do 16:00 svakog radnog dana, subotom od
                9:00 do 15:00, nedeljom je neradan dan. Svrati u to vreme ili se
                javi telefonom, tim SG Servisa će te rado dočekati i pomoći oko
                svakog pitanja ili problema sa tvojim alatom.
              </p>
            </div>
          </Container>
        </Wrapper>
      </Section>

      {/* Divider on, unlike dck, which passes `showDivider={false}` because
          there the card sits straight under the hero. Here it closes a page of
          sections and needs the same dashed rule as every other one. No
          `pt-0!` either - Section keeps its own padding so the map does not
          hug the line above it. */}
      <ContactLocations locations={SERVICE_CENTERS} />
    </div>
  );
};

export default ServisPage;
