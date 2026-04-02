import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { Prose } from "@brand/ui/prose";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Uslovi korišćenja",
  description:
    "Uslovi korišćenja sajta DCK — pravila i uslovi za korišćenje sajta dcksrbija.rs.",
  canonicalUrl: "/uslovi-koriscenja",
});

const TermsPage = () => {
  return (
    <div>
      <HeroHeader
        title="Uslovi korišćenja"
        description="Pročitaj uslove pod kojima koristiš naš sajt."
      />
      <Section>
        <Wrapper>
          <Container>
            <Prose>
              <h2>Opšte odredbe</h2>
              <p>
                Ovi uslovi korišćenja regulišu upotrebu internet sajta{" "}
                <strong>dcksrbija.rs</strong>, čiji je vlasnik i operater kompanija{" "}
                <strong>STRIDON GROUP DOO</strong>, sa sedištem u Republici
                Srbiji. Pristupanjem i korišćenjem ovog sajta prihvataš ove
                uslove u celosti. Ukoliko se ne slažeš sa bilo kojim delom
                uslova, molimo te da ne koristiš sajt.
              </p>

              <h2>Korišćenje sajta</h2>
              <p>
                Sajt dcksrbija.rs je informativnog i marketinškog karaktera. Služi
                za prikaz proizvoda brenda DCK, uključujući opise,
                specifikacije i fotografije. Na ovom sajtu{" "}
                <strong>nije moguća kupovina</strong> — svi proizvodi se kupuju
                isključivo putem sajta{" "}
                <a
                  href="https://www.prodavnicaalata.rs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  prodavnicaalata.rs
                </a>
                .
              </p>
              <p>
                Sajt koristiš na sopstvenu odgovornost. Obavezuješ se da ćeš ga
                koristiti isključivo u zakonite svrhe i na način koji ne
                narušava prava drugih korisnika.
              </p>

              <h2>Intelektualna svojina</h2>
              <p>
                Sav sadržaj na sajtu dcksrbija.rs — uključujući ali ne
                ograničavajući se na tekstove, fotografije, grafiku, logotipe,
                ikone, audio i video materijale, kao i dizajn i strukturu sajta
                — zaštićen je autorskim pravima i predstavlja intelektualnu
                svojinu kompanije STRIDON GROUP DOO.
              </p>
              <p>
                Bez prethodne pisane saglasnosti nije dozvoljeno kopiranje,
                reprodukcija, distribucija, javno prikazivanje niti bilo koji
                drugi oblik korišćenja sadržaja sa ovog sajta.
              </p>

              <h2>Linkovi ka spoljnim sajtovima</h2>
              <p>
                Ovaj sajt može sadržati linkove ka drugim sajtovima, uključujući{" "}
                <a
                  href="https://www.prodavnicaalata.rs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  prodavnicaalata.rs
                </a>{" "}
                (za kupovinu proizvoda) i drugim spoljnim resursima. Ovi linkovi
                su obezbeđeni radi tvoje pogodnosti. STRIDON GROUP DOO ne snosi
                odgovornost za sadržaj, politiku privatnosti ili prakse drugih
                sajtova.
              </p>

              <h2>Ograničenje odgovornosti</h2>
              <p>
                Informacije na sajtu dcksrbija.rs su pružene &quot;takve kakve
                jesu&quot;, bez bilo kakvih garancija, izričitih ili
                podrazumevanih. Trudimo se da sve informacije budu tačne i
                ažurne, ali ne garantujemo potpunost, tačnost ili pouzdanost
                sadržaja.
              </p>
              <p>
                Specifikacije, opisi i cene proizvoda prikazanih na sajtu su
                informativnog karaktera i mogu se razlikovati od stvarnog stanja.
                Za tačne i ažurne informacije o proizvodima, uključujući cene i
                dostupnost, proveri sajt{" "}
                <a
                  href="https://www.prodavnicaalata.rs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  prodavnicaalata.rs
                </a>
                .
              </p>
              <p>
                STRIDON GROUP DOO ne snosi odgovornost za bilo kakvu štetu koja
                može nastati korišćenjem ili nemogućnošću korišćenja ovog sajta.
              </p>

              <h2>Privatnost</h2>
              <p>
                Tvoja privatnost nam je važna. Sve informacije o prikupljanju i
                obradi ličnih podataka možeš pronaći u našoj{" "}
                <Link href="/politika-privatnosti">Politici privatnosti</Link>.
              </p>

              <h2>Izmene uslova</h2>
              <p>
                STRIDON GROUP DOO zadržava pravo da izmeni ove uslove
                korišćenja u bilo kom trenutku, bez prethodnog obaveštenja.
                Izmenjeni uslovi stupaju na snagu momentom objavljivanja na ovoj
                stranici. Nastavkom korišćenja sajta nakon objave izmena
                prihvataš nove uslove.
              </p>
              <p>
                Preporučujemo ti da povremeno ponovo pročitaš ovu stranicu kako
                bi bio/bila u toku sa eventualnim promenama.
              </p>

              <h2>Merodavno pravo</h2>
              <p>
                Na ove uslove korišćenja primenjuje se pravo Republike Srbije.
                Za sve sporove koji mogu nastati u vezi sa korišćenjem sajta
                dcksrbija.rs nadležan je sud u Republici Srbiji.
              </p>

              <h2>Kontakt</h2>
              <p>
                Za sva pitanja u vezi sa ovim uslovima korišćenja, možeš nas
                kontaktirati putem e-maila na{" "}
                <a href="mailto:contact@dcksrbija.rs">contact@dcksrbija.rs</a> ili
                putem naše{" "}
                <Link href="/kontakt">stranice za kontakt</Link>.
              </p>
            </Prose>
          </Container>
        </Wrapper>
      </Section>
    </div>
  );
};

export default TermsPage;
