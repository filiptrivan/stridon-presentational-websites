import BrandLogo from "@/components/brand-logo";
import LocationCards from "@/components/location-cards";
import PageHeader from "@/components/page-header";
import { SERVICE_CENTER, SERVICED_BRANDS } from "@/constants/service-centers";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Servis",
  description:
    "Servis električnih, akumulatorskih i ručnih alata van garantnog roka u Beogradu. SG Servis, Vojislava Ilića 141b.",
  canonicalUrl: "/servis",
});

const ServisPage = () => {
  return (
    <div>
      <PageHeader
        title="Servis alata van garancije u Beogradu"
        lede="Servisiramo i održavamo električne, akumulatorske i ručne alate, za profesionalnu i za kućnu upotrebu."
      />

      <section className="border-b border-border">
        <Wrapper className="py-14 lg:py-20">
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              Samo neki od brendova koje servisiramo
            </h2>
          </Container>

          <Container delay={0.5}>
            <div className="mt-12 grid grid-cols-2 border-l border-t border-border md:grid-cols-3 lg:grid-cols-4">
              {SERVICED_BRANDS.map((brand) =>
                brand.slug ? (
                  <Link
                    key={brand.name}
                    href={`/brendovi/${brand.slug}`}
                    className="border-b border-r border-border transition-opacity duration-300 hover:opacity-85"
                  >
                    <BrandLogo brand={brand} />
                  </Link>
                ) : (
                  <div
                    key={brand.name}
                    className="border-b border-r border-border"
                  >
                    <BrandLogo brand={brand} />
                  </div>
                ),
              )}
            </div>
          </Container>
        </Wrapper>
      </section>

      <section className="border-b border-border">
        <Wrapper className="py-14 lg:py-20">
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              Servis alata pod garancijom
            </h2>
          </Container>

          <Container delay={0.5}>
            <div className="mt-10 grid border-t border-border md:grid-cols-2">
              <div className="border-b border-border py-8 md:border-r md:pr-10">
                <h3 className="font-heading text-xl font-semibold tracking-tight">
                  Alat je u garantnom roku
                </h3>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                  Ako je tvoj alat u garantnom roku i pokriva ga garancija
                  proizvođača, uputićemo te na ovlašćeni servis brenda kome
                  mašina pripada. Javi nam se, naći ćemo ti najbliži.
                </p>
              </div>

              <div className="border-b border-border py-8 md:pl-10">
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
      </section>

      <section className="border-b border-border">
        <Wrapper className="py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Container>
              <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                SG Servis - naš pouzdani partner
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
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
                  9:00 do 15:00, nedeljom je neradan dan. Svrati u to vreme ili
                  se javi telefonom, tim SG Servisa će te rado dočekati i
                  pomoći oko svakog pitanja ili problema sa tvojim alatom.
                </p>
              </div>
            </Container>

            <Container delay={0.5}>
              <div className="lg:sticky lg:top-24">
                <LocationCards locations={[SERVICE_CENTER]} />
              </div>
            </Container>
          </div>
        </Wrapper>
      </section>
    </div>
  );
};

export default ServisPage;
