import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { Prose } from "@brand/ui/prose";

export const metadata = createPageMetadata({
  title: "Politika privatnosti",
  description:
    "Politika privatnosti DCK - kako prikupljamo, koristimo i štitimo tvoje podatke na sajtu dcksrbija.rs.",
  canonicalUrl: "/politika-privatnosti",
});

const PrivacyPolicyPage = () => {
  return (
    <div>
      <HeroHeader
        title="Politika privatnosti"
        description="Tvoji podaci su nam važni. Ovde možeš pročitati kako ih prikupljamo, koristimo i štitimo."
      />
      <Section>
        <Wrapper>
          <Container>
            <Prose>
              <h2>Podaci o rukovaocu</h2>
              <p>
                Sajt <strong>dcksrbija.rs</strong> je u vlasništvu kompanije{" "}
                <strong>STRIDON GROUP DOO</strong>, sa sedištem u Republici
                Srbiji. Kao rukovalac podataka, odgovorni smo za zaštitu tvojih
                ličnih podataka u skladu sa Zakonom o zaštiti podataka o
                ličnosti Republike Srbije.
              </p>
              <ul>
                <li>
                  <strong>Naziv firme:</strong> STRIDON GROUP DOO
                </li>
                <li>
                  <strong>Sajt:</strong> dcksrbija.rs
                </li>
                <li>
                  <strong>E-mail:</strong> contact@dcksrbija.rs
                </li>
              </ul>

              <h2>Obaveštenje o zaštiti podataka</h2>
              <p>
                Posvećeni smo zaštiti privatnosti svakog posetioca našeg sajta.
                Ovom politikom privatnosti objašnjavamo koje podatke
                prikupljamo, u koje svrhe ih koristimo i kako ih štitimo. Sajt
                dcksrbija.rs je informativnog karaktera - služi za prikaz
                proizvoda brenda DCK, bez mogućnosti kupovine. Kupovina se
                obavlja isključivo na sajtu{" "}
                <a
                  href="https://www.prodavnicaalata.rs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  prodavnicaalata.rs
                </a>
                .
              </p>

              <h2>Vrsta podataka i svrha prikupljanja</h2>
              <p>
                Na ovom sajtu ne prikupljamo podatke kroz proces kupovine jer se
                ovde ne obavljaju transakcije. Podatke prikupljamo isključivo
                ukoliko nas kontaktiraš putem kontakt forme ili e-maila.
              </p>
              <p>Podaci koje možemo prikupiti uključuju:</p>
              <ul>
                <li>Ime i prezime</li>
                <li>E-mail adresu</li>
                <li>Broj telefona (ukoliko ga ostaviš)</li>
                <li>Sadržaj poruke</li>
              </ul>
              <p>Ove podatke koristimo isključivo za:</p>
              <ul>
                <li>Odgovaranje na tvoj upit ili poruku</li>
                <li>Pružanje traženih informacija o našim proizvodima</li>
              </ul>

              <h2>Korisnici podataka</h2>
              <p>
                Tvojim podacima pristupaju isključivo ovlašćeni zaposleni
                kompanije STRIDON GROUP DOO, u cilju obrade tvog upita. Tvoje
                podatke ne delimo sa trećim licima, osim ukoliko je to neophodno
                za ispunjenje zakonskih obaveza.
              </p>

              <h2>Zaštita podataka</h2>
              <p>
                Primenjujemo odgovarajuće tehničke i organizacione mere zaštite
                podataka, uključujući:
              </p>
              <ul>
                <li>Zaštitu servera savremenim sigurnosnim protokolima</li>
                <li>Antivirusnu zaštitu i redovne bezbednosne provere</li>
                <li>Ograničen pristup podacima samo ovlašćenim zaposlenima</li>
              </ul>

              <h2>Tvoja prava</h2>
              <p>
                U skladu sa Zakonom o zaštiti podataka o ličnosti, imaš pravo
                da:
              </p>
              <ul>
                <li>Zatražiš uvid u podatke koje imamo o tebi</li>
                <li>Zatražiš ispravku netačnih podataka</li>
                <li>Zatražiš brisanje tvojih podataka</li>
                <li>Ograničiš obradu tvojih podataka</li>
                <li>Podneseš prigovor na obradu podataka</li>
              </ul>
              <p>
                Za ostvarivanje bilo kog od navedenih prava, obrati nam se na{" "}
                <a href="mailto:contact@dcksrbija.rs">contact@dcksrbija.rs</a>.
              </p>

              <h2>Nadležni organ</h2>
              <p>
                Ukoliko smatraš da je obrada tvojih podataka izvršena suprotno
                odredbama Zakona, imaš pravo da podneseš pritužbu Povereniku za
                informacije od javnog značaja i zaštitu podataka o ličnosti
                Republike Srbije (
                <a
                  href="https://www.poverenik.rs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.poverenik.rs
                </a>
                ).
              </p>

              <h2>Politika kolačića</h2>
              <p>
                Sajt dcksrbija.rs koristi kolačiće (cookies) kako bi obezbedio
                pravilno funkcionisanje i poboljšao korisničko iskustvo.
                Kolačići koje koristimo spadaju u sledeće kategorije:
              </p>
              <ul>
                <li>
                  <strong>Neophodni kolačići</strong> - omogućavaju osnovne
                  funkcionalnosti sajta i ne mogu se isključiti.
                </li>
                <li>
                  <strong>Analitički kolačići</strong> - pomažu nam da razumemo
                  kako posetioci koriste sajt, kako bismo poboljšali sadržaj i
                  korisničko iskustvo.
                </li>
                <li>
                  <strong>Marketing kolačići</strong> - koriste se za
                  prikazivanje relevantnog sadržaja i oglasa.
                </li>
              </ul>
              <p>
                Korišćenjem sajta pristaneš na upotrebu kolačića u skladu sa
                ovom politikom.
              </p>

              <h2>Autorska prava</h2>
              <p>
                Sav sadržaj objavljen na sajtu dcksrbija.rs, uključujući
                tekstove, fotografije, grafiku, logotipe i dizajn, zaštićen je
                autorskim pravima i u vlasništvu je kompanije STRIDON GROUP DOO.
                Reprodukcija, distribucija ili bilo koji oblik korišćenja
                sadržaja bez prethodne pisane saglasnosti je zabranjena.
              </p>

              <h2>Izmene politike privatnosti</h2>
              <p>
                Zadržavamo pravo da ažuriramo ovu politiku privatnosti u bilo
                kom trenutku. Sve izmene stupaju na snagu momentom objavljivanja
                na ovoj stranici. Preporučujemo ti da povremeno ponovo pročitaš
                ovu stranicu kako bi bio/bila u toku sa eventualnim promenama.
              </p>
            </Prose>
          </Container>
        </Wrapper>
      </Section>
    </div>
  );
};

export default PrivacyPolicyPage;
