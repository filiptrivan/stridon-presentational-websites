import B2bForm from "@/components/b2b-form";
import { B2B_PORTAL_URL } from "@/constants/links";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { Button } from "@brand/ui/button";
import { ExternalLink } from "lucide-react";

export const metadata = createPageMetadata({
  title: "B2B",
  description:
    "Zatraži pristup Stridon B2B platformi: veleprodajne cene, stanje lagera i poručivanje online, za firme koje prodaju alat.",
  canonicalUrl: "/b2b",
});

// Shared page header like the rest of the monorepo, portal login for existing
// partners, then the access request form. Both sections are centred to match
// /kontakt, which is the other "fill this in and we get back to you" page on
// the site - same shape, same axis.
const B2bPage = () => {
  return (
    <div>
      <HeroHeader
        title="B2B platforma"
        description="Prijavi se na portal ako već imaš nalog kod nas, ili zatraži pristup ako nam se tek pridružuješ."
      />

      <Section className="py-12 lg:py-16">
        <Wrapper>
          <Container className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              Već imaš B2B nalog?
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Portal koriste firme koje već imaju otvoren nalog kod nas.
            </p>

            <Button asChild size="lg" className="mt-7">
              <a
                href={B2B_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Prijavi se na portal
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </Container>
        </Wrapper>
      </Section>

      <Section className="py-14 lg:py-20">
        <Wrapper>
          <Container className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              Zatraži pristup B2B platformi
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Popuni formular i naš tim će te kontaktirati u najkraćem mogućem
              roku.
            </p>
          </Container>

          {/* The form is already `max-w-3xl w-full`, same as the shared contact
              page; it only needed a parent that centres it. */}
          <Container delay={0.3} className="mt-8 flex justify-center">
            <B2bForm />
          </Container>
        </Wrapper>
      </Section>
    </div>
  );
};

export default B2bPage;
