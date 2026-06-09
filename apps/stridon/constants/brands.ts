export type BilingualText = {
  sr: string;
  en: string;
};

export type BrandParagraph = {
  title: BilingualText;
  body: BilingualText;
};

export type BrandCatalog = {
  name: string;
  pdfUrl: string;
};

export type Brand = {
  slug: string;
  name: string;
  logoSrc: string;
  description: string;
  heroDescription: BilingualText;
  paragraphs: BrandParagraph[];
  catalogs: BrandCatalog[];
  color: string;
  storeUrl: string;
};

export const BRANDS: Brand[] = [
  {
    slug: "dewalt",
    name: "DeWalt",
    logoSrc: "/logos/dewalt-logo.svg",
    description: "DeWalt alati su jedni od najkvalitetnijih alata dana\u0161njice. Koriste se u svim industrijama i nema prete\u0161kog posla za DeWalt profesionalne ma\u0161ine.",
    heroDescription: { sr: "DeWALT alati - Uvoznik za Srbiju", en: "DeWalt Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Kompaniju DeWalt je 1924. godine osnovao Raymond E. DeWalt u Leoli, Pensilvanija, poznat kao izumitelj radijalne testere. Njegov pronalazak imao je veliki uticaj na dalji razvoj elektri\u010dnih alata za obradu drveta.\n\nPoslovanje se brzo \u0161irilo, a kompanija je reorganizovana i ponovo registrovana 1947. kao DeWalt Inc. Godine 1949. preuzeo ju je American Machine & Foundry Co, koja ju je potom prodala kompaniji Black & Decker 1960. godine.\n\nBlack & Decker je 1989. godine prodao deo koji se bavio proizvodnjom radijalnih testera dvojici rukovodilaca, zadr\u017eavaju\u0107i fokus na drugim vrstama alata za profesionalce.\n\nU 1992. godini, Black & Decker je pokrenuo proces rebrendiranja svojih profesionalnih i naprednih alata pod imenom DeWalt alati. Ovaj potez je zna\u010dajno uticao na tr\u017ei\u0161te, jer je stvorio sna\u017ean brend fokusiran isklju\u010divo na alat za profesionalnu upotrebu.\n\nDeWalt je 1994. godine preuzeo nema\u010dkog proizvo\u0111a\u010da ELU i integrisao njegovu tehnologiju u svoj asortiman. Do 2001. godine, DeWalt je proizvodio i prodavao vi\u0161e od 200 modela stru\u010dnih alata i 800 dodataka.\n\nDeWalt je ubrzo postao prepoznatljiv me\u0111u komercijalnim izvo\u0111a\u010dima radova, naro\u010dito u gra\u0111evinskoj industriji. Godine 2004, Black & Decker je kupio konkurentskog proizvo\u0111a\u010da alata Porter-Cable i spojio ga sa DeWalt-om u D\u017eeksonu, Tenesi.\n\nU 2011. godini DeWalt je zapo\u010deo proizvodnju ru\u010dnih alata za izvo\u0111a\u010de, kao \u0161to su skalpeli, kle\u0161ta, podesivi klju\u010devi, metarski alati, testere i \u010deki\u0107i, koji su danas deo standardne opreme svakog majstora.\n\nDve godine kasnije, dodali su i alate za mehani\u010dare, uklju\u010duju\u0107i klju\u010deve, \u010degrtaljke i nastavke.\n\nU decembru 2013, DeWalt je najavio da \u0107e odre\u0111eni deo proizvoda sastavljati u Sjedinjenim Ameri\u010dkim Dr\u017eavama, koriste\u0107i komponente iz Brazila, Kine, \u010ce\u0161ke, Italije, Meksika, Velike Britanije i SAD.\n\nDo 2015. godine, kompanija je imala sedam proizvodnih pogona u SAD-u, \u0161to je oja\u010dalo poziciju DeWalt brenda kao ameri\u010dkog proizvo\u0111a\u010da alata.",
          en: "DeWalt was founded in 1924 by Raymond E. DeWalt in Leola, Pennsylvania, known as the inventor of the radial arm saw. His invention had a major impact on the development of electric woodworking tools.\n\nThe business expanded rapidly, and the company was reorganized and re-registered in 1947 as DeWalt Inc. In 1949, it was acquired by American Machine & Foundry Co, which later sold it to Black & Decker in 1960.\n\nIn 1989, Black & Decker sold the part of the business responsible for manufacturing radial saws to two company executives, while retaining a focus on other types of professional-grade tools.\n\nIn 1992, Black & Decker launched a rebranding initiative, introducing its professional and high-performance tools under the name DeWalt tools. This move significantly influenced the market by creating a strong brand focused on tools for professional use.\n\nIn 1994, DeWalt acquired the German manufacturer ELU and integrated its technology into its product lineup. By 2001, DeWalt was producing and selling over 200 models of professional tools and 800 accessories.\n\nDeWalt quickly became a favorite among commercial contractors, especially in the construction industry. In 2004, Black & Decker acquired rival tool manufacturer Porter-Cable and merged it with DeWalt in Jackson, Tennessee.\n\nIn 2011, DeWalt began producing hand tools for contractors, including utility knives, pliers, adjustable wrenches, measuring tools, saws, and hammers, all essential tools on a modern jobsite.\n\nTwo years later, they expanded into automotive tools, such as wrenches, ratchets, and sockets.\n\nIn December 2013, DeWalt announced that certain products would be assembled in the United States, using components sourced from Brazil, China, the Czech Republic, Italy, Mexico, the UK, and the US.\n\nBy 2015, the company operated seven manufacturing facilities in the U.S., reinforcing DeWalt's image as an American tool brand.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "U aprilu 2016. godine, DeWalt je predstavio pametni telefon zasnovan na Android sistemu, razvijen posebno za radnike u gra\u0111evinskoj industriji. Ovaj ure\u0111aj je otporan na udarce i ekstremne uslove, \u0161to ga \u010dini savr\u0161enim za rad na gradili\u0161tima.\n\nSeptembra 2016. predstavljen je hibridni akumulator FlexVolt, koji mo\u017ee raditi na 60 V (54 V nominalno) i 2 Ah, ili na 20 V (18 V nominalno) i 6 Ah, u zavisnosti od vrste baterijskog alata.\n\nOko maja 2017. godine, DeWalt je po\u010deo da uklju\u010duje Bluetooth tehnologiju ToolConnect u svoje bu\u0161ilice i odvija\u010de. ToolConnect omogu\u0107ava korisnicima da preko mobilne aplikacije upravljaju svojim elektri\u010dnim alatima, prate njihov status i pode\u0161avaju funkcije.\n\nNeki modeli imaju ugra\u0111enu podr\u0161ku za ToolConnect, dok se kod drugih funkcionalnost mo\u017ee dodati naknadno pomo\u0107u dodatnog \u010dipa.\n\nU maju 2018. lansirana je linija be\u017ei\u010dnih kosilica na 20 V i 40 V, koja se brzo pozicionirala kao deo DeWalt linije alata za odr\u017eavanje dvori\u0161ta.\n\nU septembru 2022. godine, DeWalt je predstavio POWERSTACK tehnologiju baterija, postav\u0161i prvi proizvo\u0111a\u010d koji koristi litijum-jonske \u0107elije u obliku vre\u0107ice za bolje performanse i kompaktniji dizajn.",
          en: "In April 2016, DeWalt introduced a rugged Android-based smartphone, specially designed for the construction workforce. The device is built to survive a two-meter drop and operate in temperatures ranging from \u221220\u00b0C to 60\u00b0C, making it ideal for construction sites.\n\nIn September 2016, the company introduced the FlexVolt hybrid battery, capable of operating at 60V (54V nominal) and 2Ah, or at 20V (18V nominal) and 6Ah, depending on the cordless tool in use.\n\nAround May 2017, DeWalt began integrating Bluetooth-enabled ToolConnect technology into its drills and drivers. ToolConnect allows users to monitor, track, and configure their power tools through a mobile app.\n\nSome models include built-in support for ToolConnect, while others can be upgraded with an add-on chip.\n\nIn May 2018, DeWalt launched a line of cordless lawn mowers running on 20V and 40V, quickly gaining traction in the outdoor tools market.\n\nIn September 2022, DeWalt introduced POWERSTACK battery technology, becoming the first tool manufacturer to use pouch-style lithium-ion battery cells, which offer increased performance and a compact form.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "Ova kompanija je poznata po \u0161irokom asortimanu elektri\u010dnih i ru\u010dnih alata, namenjenih gra\u0111evinskom, proizvodnom i stolarskom sektoru, kao i korisnicima koji se bave radovima u ku\u0107nim uslovima.\n\nDeWalt alati za profesionalce uklju\u010duju bu\u0161ilice, testere, brusilice, aku alate, kosilice, kao i bogat izbor dodatne opreme. Tako\u0111e, tu su i precizni ru\u010dni alati DeWalt poput kle\u0161ta, skalpela i \u010deki\u0107a.\n\nBlack & Decker je ranije bio poznat po lak\u0161im alatima i ku\u0107nim ure\u0111ajima, \u0161to nije odgovaralo zahtevima profesionalaca u gra\u0111evinarstvu. Pred kraj 1980-ih, Michael Hammes je predlo\u017eio strategiju nalik onoj koju je Honda koristila za ulazak na tr\u017ei\u0161te luksuznih automobila.\n\nKao rezultat toga, Black & Decker je odlu\u010dio da iskoristi manje poznato ime DeWalt za povratak na tr\u017ei\u0161te profesionalnih alata.\n\nNakon akvizicije 1960. godine, DeWalt je proizvodio razli\u010dite stacionarne elektri\u010dne alate. U 1992. godini lansirani su i ru\u010dni alati pod brendom DeWalt, koji su ranije bili deo linija Black & Decker Professional i Kodiak.\n\nTe linije su uskoro uga\u0161ene, a DeWalt je postao primarni brend profesionalnih alata. Istra\u017eivanja su pokazala da je \u010dak 70% korisnika u industriji prepoznalo naziv DeWalt kao sinonim za pouzdanost i kvalitet.",
          en: "DeWalt is known for a wide range of power and hand tools, designed for the construction, manufacturing, and woodworking sectors, as well as for advanced DIY users.\n\nTheir product lineup includes DeWalt power tools like drills, saws, grinders, and cordless equipment, in addition to high-quality DeWalt hand tools such as pliers, utility knives, and hammers.\n\nPreviously, Black & Decker was best known for lighter tools and household appliances, which didn\u2019t meet the demands of professional tradespeople. In the late 1980s, Michael Hammes proposed a strategy similar to Honda\u2019s luxury car brand approach.\n\nAs a result, Black & Decker used the lesser-known DeWalt name to re-enter the professional power tools market.\n\nAfter the 1960 acquisition, DeWalt produced various stationary electric tools. In 1992, the company introduced a new line of handheld tools under the DeWalt brand, which previously belonged to Black & Decker's \u201cProfessional\u201d and \u201cKodiak\u201d series.\n\nThese older lines were soon discontinued, and DeWalt emerged as the primary brand for professional-grade tools. Industry research showed that 70% of tradespeople recognized the DeWalt name as a symbol of reliability and performance.",
        },
      },
      {
        title: { sr: "Sponzorstva", en: "Sponsorships" },
        body: {
          sr: "Od jula 2021. godine, DeWalt je zvani\u010dni dobavlja\u010d alata i opreme za McLaren Formula 1 tim, \u0161to dodatno potvr\u0111uje njihovu posve\u0107enost preciznosti i vrhunskim performansama.\n\nTako\u0111e, DeWalt je 2022. godine potpisao ugovor o sponzorstvu sa fudbalskim klubom AFC Bournemouth, \u010dime je jo\u0161 jednom demonstrirao svoju prisutnost i van industrije alata, u svetu profesionalnog sporta.",
          en: "Since July 2021, DeWalt has been the official tool and equipment supplier for the McLaren Formula 1 team, further emphasizing the brand\u2019s commitment to precision and high-performance standards.\n\nIn 2022, DeWalt also signed a sponsorship deal with the English football club AFC Bournemouth, expanding its presence beyond the tools industry into the world of professional sports.",
        },
      },
    ],
    catalogs: [
      { name: "Dewalt najprodavanije 2023", pdfUrl: "https://drive.google.com/file/d/1RuMzUGAO4sBoTsBYby_-qGIo5jlFirfP/view?usp=share" },
      { name: "Dewalt ograni\u010deno izdanje", pdfUrl: "https://drive.google.com/file/d/13y1RuBHKXtsudGYMzIi67ym4w5rb3jew/view?usp=share" },
    ],
    color: "#ECFF44",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/dewalt/",
  },
  {
    slug: "bosch",
    name: "Bosch",
    logoSrc: "/logos/bosch-logo.svg",
    description: "Bosch je jedna od najve\u0107ih svetskih firmi koja se bavi proizvodnjom elektri\u010dnih i ru\u010dnih alata. Bosch Professional predstavlja sinonim za kvalitet.",
    heroDescription: { sr: "Bosch alati - Uvoznik za Srbiju", en: "Bosch Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Kompanija Bosch zapo\u010dela je svoje poslovanje 15. novembra 1886. godine, kao radionica za preciznu mehaniku i elektroin\u017eenjering u \u0160tutgartu-Zapad. Ve\u0107 naredne godine, Bosch je razvio niskonaponski magneto za gasne motore, \u010dime je zapo\u010deo svoj put inovacija u auto-industriji.\n\nOd 1897. godine, Bosch ugra\u0111uje magneto sisteme paljenja u motorna vozila, postaju\u0107i vode\u0107i dobavlja\u010d sistema za paljenje. Godine 1902, glavni in\u017eenjer Gotlob Honold je predstavio visokovoltni magneto sistem paljenja sa sve\u0107icom, klju\u010dni izum za razvoj automobilske industrije.\n\nGodine 1901. otvara se prvi proizvodni pogon u \u0160tutgartu. Kompanija Bosch ubrzano raste: do 1906. proizvedeno je 100.000 magneto sistema, a uvedeno je i osmo\u010dasovno radno vreme. Ve\u0107 1910. godine otvara se novi pogon u Feuerbach-u, gde se 1914. pokre\u0107e proizvodnja \u010duvenog \u201cBosch svetla\u201d \u2013 generatora i farova.\n\n\u0160irenje upotrebe motornih vozila nakon 1900. uzrokuje brzi rast \u2013 sa 45 zaposlenih 1901. do preko 1.000 do 1908. godine. Globalna ekspanzija Bosch brenda po\u010dinje 1898. u Londonu, a ubrzo se \u0161iri i na Pariz, Be\u010d, Budimpe\u0161tu i sve kontinente.\n\nU 1920-im, Bosch pro\u0161iruje svoju ponudu: elektri\u010dne sirene (1921), brisa\u010de vetrobrana (1926) i pokaziva\u010de pravca (1927). Te godine uvodi i sisteme ubrizgavanja goriva za dizel motore. Kao deo diverzifikacije, 1932. kupuje sektor gasne opreme kompanije Junkers & Co. Te iste godine razvija svoju prvu elektri\u010dnu bu\u0161ilicu i prvi auto-radio. Godine 1933. Bosch predstavlja prvi elektri\u010dni ku\u0107ni fri\u017eider.\n\nTokom 2000-ih, Bosch lansira elektro-hidrauli\u010dne ko\u010dnice, piezo-ubrizgavanje, digitalni auto-radio sa CD-om i litijum-jonski akumulatorski odvija\u010d (2003).\n\nKompanija je 2005. i 2008. dobila Nema\u010dku nagradu za budu\u0107nost. Najve\u0107a pojedina\u010dna investicija stigla je 2021. otvaranjem fabrike poluprovodnika u vrednosti od 1,2 milijarde dolara.",
          en: "The company Bosch began operations on November 15, 1886, as a workshop for precision mechanics and electrical engineering in West Stuttgart.\n\nJust a year later, Bosch developed a low-voltage magneto for gas engines, marking the start of its innovation journey in the automotive industry.\n\nFrom 1897, Bosch started installing magneto ignition systems in motor vehicles, becoming a leading supplier of ignition systems.\n\nIn 1902, chief engineer Gottlob Honold introduced the high-voltage magneto ignition system with a spark plug \u2014 a crucial invention for the advancement of the automotive sector.\n\nIn 1901, Bosch opened its first manufacturing plant in Stuttgart.\n\nThe company rapidly expanded: by 1906, it had produced its 100,000th magneto and introduced the eight-hour workday.\n\nIn 1910, a new plant was opened in Feuerbach, where the famous Bosch light, a generator and headlight system \u2014 entered production in 1914 after its 1913 debut.\n\nThe growing use of motor vehicles after 1900 led to a rapid increase in demand.\n\nBosch grew from 45 employees in 1901 to over 1,000 by 1908.\n\nGlobal expansion began in 1898 with an office in London, followed by Paris, Vienna, and Budapest, and soon extended across all continents.\n\nIn the 1920s, Bosch expanded its product line with electric horns (1921), windshield wipers (1926), and turn signals (1927).\n\nThat same year, it introduced diesel fuel injection systems.\n\nIn 1932, as part of its diversification strategy, Bosch acquired the gas equipment sector from Junkers & Co.\n\nThat year, it also launched its first electric drill and introduced its first car radio.\n\nIn 1933, Bosch unveiled the first electric household refrigerator.\n\nIn the 2000s, Bosch rolled out innovations such as electro-hydraulic brakes, piezo injection for diesel engines, digital car radios with CD players, and the lithium-ion cordless screwdriver (2003).\n\nThe company received the German Future Prize from the German President in both 2005 and 2008.\n\nIn 2021, Bosch made its largest single investment with a $1.2 billion semiconductor factory.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Bosch tehnologije su sinonim za inovaciju. Godine 2009. izdvojeno je 3,6 milijardi evra za istra\u017eivanje i razvoj, a kompanija prijavljuje oko 3.900 patenata godi\u0161nje. Fokus je na unapre\u0111enju energetske efikasnosti, obnovljivim izvorima energije i biomedicinskoj tehnologiji.\n\nPodru\u017enica Bosch Healthcare Solutions GmbH nudi medicinske ure\u0111aje i usluge. Tokom 2020. lansiran je brzi test na COVID-19.\n\nBosch je izme\u0111u 2022. i 2026. ulo\u017eio \u010dak 3 milijarde evra u razvoj \u010dipova, s naglaskom na 40 i 200-nanometarske \u010dipove za automobilske aplikacije. Time dodatno u\u010dvr\u0161\u0107uje poziciju lidera u automobilskoj i elektronskoj industriji.",
          en: "Bosch technologies are synonymous with innovation.\n\nIn 2009, the company allocated \u20ac3.6 billion to research and development, filing around 3,900 patents annually.\n\nBosch focuses on improving energy efficiency, utilizing renewable energy sources, and exploring fields such as biomedical technology.\n\nIts subsidiary, Bosch Healthcare Solutions GmbH, offers medical devices and services.\n\nIn 2020, the company launched a rapid COVID-19 test.\n\nBetween 2022 and 2026, Bosch is investing \u20ac3 billion in chip production and R&D, with an emphasis on 40 and 200-nanometer chips for automotive applications.\n\nThis further solidifies its leadership in automotive and electronic industries.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "Bosch proizvodi pokrivaju vi\u0161e industrija. U automobilskoj industriji, Bosch nudi sisteme za ubrizgavanje goriva, ko\u010dione sisteme i naprednu auto-elektroniku. U sektoru potro\u0161a\u010dkih proizvoda, poznat je po Bosch elektri\u010dnim alatima, ku\u0107nim aparatima i e-bicikl motorima.\n\nU industrijskoj tehnologiji, Bosch razvija sisteme za automatizaciju i pakovanje, dok u sektoru energetike i infrastrukture nudi re\u0161enja za grejanje, toplu vodu, sigurnosne sisteme i komunikacione ure\u0111aje.\n\nTako\u0111e, kompanija proizvodi senzore, ure\u0111aje za pametne ku\u0107e i medicinske instrumente. Bosch je aktivan i u oblasti softverskih re\u0161enja, posebno za autonomnu vo\u017enju i pametne automobile.\n\nPo prihodima, Bosch je vode\u0107i svetski proizvo\u0111a\u010d automobilskih komponenti.",
          en: "Bosch products span multiple industries.\n\nIn the automotive sector, Bosch supplies fuel injection systems, brake systems, and advanced car electronics.\n\nIn the consumer goods sector, it is renowned for its Bosch power tools, home appliances, and electric bicycle motors.\n\nIn industrial technology, Bosch develops automation and packaging systems.\n\nIn the energy and building technology sector, it offers heating systems, hot water solutions, security systems, and communication devices.\n\nThe company also manufactures sensors, smart home devices, and medical instruments.\n\nBosch is actively involved in software solutions, especially for autonomous driving and smart vehicles.\n\nBy revenue, Bosch is the world\u2019s leading supplier of automotive components.",
        },
      },
      {
        title: { sr: "Globalno prisustvo", en: "Global presence" },
        body: {
          sr: "Bosch grupa ima vi\u0161e od 468 filijala i regionalnih predstavni\u0161tava u preko 60 zemalja. Njene aktivnosti u oblasti proizvodnje, razvoja i prodaje pokrivaju \u010ditav svet. Vi\u0161e od 90.000 istra\u017eiva\u010da i in\u017eenjera radi na 125 lokacija \u0161irom sveta, \u0161to Bosch \u010dini jednim od najinovativnijih brendova dana\u0161njice.",
          en: "The Bosch Group operates over 468 subsidiaries and regional offices in more than 60 countries.\n\nIts manufacturing, engineering, and sales activities span the globe.\n\nOver 90,000 researchers and engineers work across 125 locations worldwide \u2014 positioning Bosch as one of today\u2019s most innovative global brands.",
        },
      },
    ],
    catalogs: [
      { name: "Bosch DIY merni alati", pdfUrl: "https://drive.google.com/file/d/1BK8KkkGrq2n9J9x3M0ZysdQ24MdhjAqe/view?usp=share" },
      { name: "Bosch pribor", pdfUrl: "https://drive.google.com/file/d/1oVevfXbBrPfboKAJIQA62reSEowTyio7/view?usp=share" },
      { name: "Bosch Dremel", pdfUrl: "https://drive.google.com/file/d/1xdVeZDXHNFhN3AwYE6XSW5dzVtcB_hSG/view?usp=share" },
      { name: "Bosch EXPERT", pdfUrl: "https://drive.google.com/file/d/1rpkCB0d9SXnuQ3Pg1WXzV3yUKCLhICSz/view?usp=share" },
      { name: "Bosch Plavi", pdfUrl: "https://drive.google.com/file/d/1lEwdsuzYNCMiq997mi2cS2jvPXfc6p88/view?usp=share" },
      { name: "Bosch VP cenovnik", pdfUrl: "https://drive.google.com/file/d/1966qI7dLpBlcsJkuEoaoxc9XzvShqH-H/view?usp=share" },
    ],
    color: "#2967FF",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/bosch/",
  },
  {
    slug: "stanley",
    name: "Stanley",
    logoSrc: "/logos/stanley-logo.svg",
    description: "Stanley alati su sinonim za izdr\u017eljivost i preciznost. Stanley pru\u017ea \u0161irok izbor visokokvalitetnih alata za profesionalce i entuzijaste.",
    heroDescription: { sr: "Stanley alati - Uvoznik za Srbiju", en: "Stanley Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Brend Stanley Tools ima duboko ukorenjenu tradiciju u industriji ru\u010dnih alata.\n\nKompaniju The Stanley Works osnovao je Frederik Trent Stenli 1843. godine u Nju Britenu, Konektikat, kao proizvo\u0111a\u010da vijaka i okova za vrata.\n\nDrugu kompaniju, The Stanley Rule and Level, osnovao je 1857. godine njegov ro\u0111ak Henri Stenli, tako\u0111e u Nju Britenu.\n\nGodine 1920, ove dve firme su se spojile, a sektor za ru\u010dne alate nastavio je da posluje pod okriljem The Stanley Works.\n\nOvaj spoj bio je klju\u010dan za razvoj Stanley ru\u010dnih alata, koji su kasnije postali sinonim za pouzdanost i preciznost u zanatskoj i gra\u0111evinskoj industriji.\n\nOko 1937. godine, Stanley je napravio strate\u0161ki korak ka evropskom tr\u017ei\u0161tu preuzimanjem britanske kompanije J. A. Chapman, renomiranog proizvo\u0111a\u010da stolarskih alata iz \u0160efilda.\n\nOvo preuzimanje pro\u0161irilo je globalno prisustvo brenda Stanley i dodatno u\u010dvrstilo njegovu reputaciju.\n\nU martu 2010. godine, Stanley Works se spojio sa Black & Decker, \u010dime je nastala globalna korporacija Stanley Black & Decker.\n\nDanas, Stanley Hand Tools funkcioni\u0161e kao va\u017ean deo ove grupacije, ostaju\u0107i veran svojim korenima dok se razvija u skladu sa savremenim zahtevima korisnika alata.",
          en: "The Stanley Tools brand has a long-standing tradition in the hand tool industry.\n\nThe Stanley Works was founded by Frederick Trent Stanley in 1843 in New Britain, Connecticut, originally as a manufacturer of door bolts and hardware.\n\nAnother company, The Stanley Rule and Level, was founded by his cousin, Henry Stanley, in 1857, also in New Britain.\n\nIn 1920, the two companies merged, and the hand tool division continued to operate under The Stanley Works.\n\nThis merger laid the foundation for the development of Stanley hand tools, which would later become a symbol of reliability and precision in the carpentry and construction industries.\n\nAround 1937, Stanley acquired the British company J. A. Chapman, a well-known manufacturer of woodworking tools from Sheffield.\n\nThis acquisition helped Stanley expand into the UK market and solidify its global presence.\n\nIn March 2010, Stanley Works merged with Black & Decker to form the global corporation Stanley Black & Decker.\n\nToday, Stanley Hand Tools continues to evolve as a key brand within this group, staying true to its roots while meeting the needs of modern tool users.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Stanley je poznat po brojnim inovacijama koje su unapredile kvalitet i efikasnost alata.\n\nMe\u0111u najpoznatijim inovacijama nalaze se Bailey blanja, Surform alat, PowerLock metar, skalpel i vi\u0161enamenski alat Stanley #1 Odd Jobs.\n\nPosebno se isti\u010de serija Stanley FatMax, koja je poznata po robusnim i izdr\u017eljivim alatima dizajniranim za te\u0161ke radne uslove.\n\nOvi alati su omiljeni me\u0111u profesionalnim korisnicima zbog svoje pouzdanosti i snage.",
          en: "Stanley is known for many innovations that have improved tool performance and efficiency.\n\nSome of the most famous innovations include the Bailey plane, Surform tool, PowerLock tape measure, utility knife, and the versatile Stanley #1 Odd Jobs tool.\n\nThe Stanley FatMax line stands out for its heavy-duty tools designed to endure the toughest working conditions.\n\nThese tools are highly favored by professionals for their durability and reliability.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "Stanley nudi \u0161irok asortiman ru\u010dnih alata za razli\u010dite primene, od stolarije do obrade metala i merenja.\n\nMe\u0111u najpoznatijim proizvodima nalaze se blanjalice, testere, lenjiri, ugaonici, dleta, odvija\u010di, kao i razni drugi alati za li\u010dnu i profesionalnu upotrebu.\n\nZa obradu drveta, Stanley nudi precizne testere, dleta i metre koji omogu\u0107avaju kontrolisano se\u010denje i oblikovanje materijala.\n\nNjihovi metri i libele, kao \u0161to su modeli iz FatMax serije, omogu\u0107avaju ta\u010dna merenja u zahtevnim uslovima rada.\n\nU oblasti obrade metala, Stanley proizvodi efikasne makaze, turpije i druge alate koji osiguravaju preciznu zavr\u0161nu obradu.\n\nStanley alati su prepoznati kao kvalitetno re\u0161enje za profesionalce i hobiste \u0161irom sveta.",
          en: "Stanley offers a broad range of hand tools for various applications, including woodworking, metalworking, and measurement.\n\nSome of the most recognized products include hand planes, saws, rulers, squares, chisels, screwdrivers, and a variety of other tools for both personal and commercial use.\n\nFor woodworking, Stanley provides precise saws, chisels, and measuring tools that ensure controlled cuts and accurate shaping.\n\nTheir tape measures and levels, especially those in the FatMax line, deliver accurate readings even in challenging work environments.\n\nIn the metalworking category, Stanley manufactures efficient shears, files, and other finishing tools that enable precise results.\n\nStanley tools are a trusted choice for professionals and hobbyists around the globe.",
        },
      },
    ],
    catalogs: [
      { name: "Stanley katalog", pdfUrl: "https://drive.google.com/file/d/1B7teaotZAfVehBOZt-ENZvG3kRFScO9i/view?usp=drive_link" },
    ],
    color: "#ECFF44",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/stanley/",
  },
  {
    slug: "rems",
    name: "REMS",
    logoSrc: "/logos/rems-logo.png",
    description: "REMS je prepoznatljiva marka koja se specijalizuje za proizvodnju ma\u0161ina i alata za cevare u sektorima sanitarije i grejanja.",
    heroDescription: { sr: "REMS - Uvoznik za Srbiju", en: "REMS - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Kompanija REMS je osnovana 1909. godine sa jasnim ciljem, razvijati vrhunske alate za rad sa cevima, prvenstveno za potrebe instalatera u sektorima sanitarije i grejanja. Na po\u010detku su to bili ru\u010dni alati za cevi, dok je kasnije REMS pro\u0161irio ponudu na ma\u0161ine i elektri\u010dne alate za cevarske radove. Zahtev osniva\u010da Christiana F\u00f6lla da REMS alati uvek moraju biti superiorni postao je temelj poslovanja firme. Vi\u0161e od jednog veka kasnije, REMS je prepoznat kao vode\u0107i proizvo\u0111a\u010d profesionalnih alata i ma\u0161ina za rad sa cevima, kako na doma\u0107em, tako i na svetskom tr\u017ei\u0161tu.",
          en: "Since its foundation in 1909, REMS has been developing high-quality tools for working with pipes, primarily for professional plumbers and heating system installers. The company started with manual pipe tools and later expanded its offer to include machines and power tools for pipe processing. The founder, Christian F\u00f6hl, set a clear standard: REMS tools must always be superior. Today, REMS stands as a global leader in manufacturing machines and tools for pipework.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "REMS se isti\u010de svojim inovativnim pristupom razvoju alata. Njihovi in\u017eenjeri osmi\u0161ljavaju re\u0161enja koja instalaterima olak\u0161avaju svakodnevni rad - bilo da se radi o ru\u010dnim alatima, elektro-ma\u0161inama ili naprednim re\u0161enjima za savijanje i spajanje cevi. U REMS-u se svakom izazovu pristupa kroz prizmu prakti\u010dnog iskustva, uz stalnu saradnju sa stru\u010dnjacima iz razli\u010ditih oblasti industrije.\n\nREMS alati su poznati po inovacijama, kvalitetu izrade i tehni\u010dkom savr\u0161enstvu. Njihova tehnologija odgovara najvi\u0161im standardima, \u0161to potvr\u0111uju brojni nacionalni i me\u0111unarodni patenti. Zahvaljuju\u0107i tome, REMS zadr\u017eava vode\u0107u poziciju na tr\u017ei\u0161tu cevarskih alata i nastavlja da bude sinonim za kvalitet i pouzdanost.",
          en: "REMS engineers continuously bring forward revolutionary ideas that simplify daily tasks for professionals. With a strong focus on practical application and industry needs, they develop innovative tools for the toughest demands on the job site. The company's dedication to excellence is supported by constant technical advancement and collaboration with experts across different sectors.\n\nThanks to cutting-edge technology and strict quality control, REMS tools have become globally recognized. Their innovative solutions are protected by numerous national and international patents, confirming their status as a pioneer in the field of pipe tools and machines.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "REMS nudi kompletan asortiman alata i ma\u0161ina za obradu cevi, namenjenih profesionalcima u instalaterskoj industriji. Njihovi proizvodi obuhvataju ma\u0161ine za navojno rezanje i valjanje, kao i elektro-hidrauli\u010dne alate za obradu navoja. Tu su i razli\u010diti alati za se\u010denje cevi, od ru\u010dnih reza\u010da, preko elektri\u010dnih i pneumatskih testera, pa sve do baterijskih ure\u0111aja za kru\u017eno se\u010denje.\n\nZa dodatnu obradu cevi, REMS nudi re\u0161enja za fazetiranje i uklanjanje ivica, kao i \u0161irok spektar alata za monta\u017eu, uklju\u010duju\u0107i \u0161vedske i pumpne klju\u010deve, akumulatorske bu\u0161ilice, kao i ure\u0111aje za ispitivanje pritiska, kako elektri\u010dne tako i ru\u010dne.\n\nU oblasti zavarivanja i lemljenja, REMS je razvio efikasna re\u0161enja kao \u0161to su elektri\u010dne kle\u0161ta za lemljenje, turbo plamenici i kvalitetni materijali za lemljenje. Za potrebe savijanja cevi, dostupni su kako ru\u010dni tako i hidrauli\u010dni savija\u010di, koji omogu\u0107avaju precizan i lak rad na terenu.\n\nPored toga, REMS se isti\u010de i alatima za rad sa radijalnim i aksijalnim spajanjima, uklju\u010duju\u0107i akumulatorske i elektro-hidrauli\u010dne prese, kao i ekspanzione alate. Za potrebe odr\u017eavanja, REMS nudi opremu za inspekciju i \u010di\u0161\u0107enje cevi, poput inspekcijskih kamera, ma\u0161ina za \u010di\u0161\u0107enje i alata za zavarivanje plasti\u010dnih cevi.",
          en: "REMS offers an extensive range of tools and machines for every aspect of pipe processing and installation work. Their product lineup includes thread cutting machines, rolling tools, electric and hydraulic threading machines, and pipe cutters, from manual tools to electric reciprocating saws and battery-powered circular pipe saws.\n\nThe company also provides solutions for beveling and deburring, as well as a wide variety of installation tools such as Swedish wrenches, pump pliers, cordless drills, and pressure testing units \u2013 both manual and electric.\n\nIn the field of soldering and welding, REMS supplies electric soldering tongs, turbo torches, and high-quality soldering materials. For pipe bending, they offer both manual and hydraulic benders, allowing precise and reliable work even under challenging conditions.\n\nREMS is also specialized in tools for radial and axial press fittings, including cordless and electro-hydraulic press machines and various expansion tools. For maintenance and inspection, the company provides pipe inspection cameras, cleaning machines, and tools for welding plastic pipes.",
        },
      },
    ],
    catalogs: [
      { name: "Rems akcija 2023", pdfUrl: "https://drive.google.com/file/d/1S_H99PFic4pdtzFZOw2lSC0URAo6YFcV/view?usp=share" },
    ],
    color: "#ECFF44",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/rems/",
  },
  {
    slug: "wiha",
    name: "Wiha",
    logoSrc: "/logos/wiha-logo.svg",
    description: "Wiha je renomirana nema\u010dka marka koja se specijalizuje za proizvodnju kvalitetnih ru\u010dnih alata sa vi\u0161e od 3.500 razli\u010ditih proizvoda.",
    heroDescription: { sr: "Wiha alati - Uvoznik za Srbiju", en: "Wiha Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Kompanija Wiha osnovana je 1939. godine u Vupertalu, od strane Vilija Hana. Ova oblast, Bergi\u0161es Land, bila je poznata kao centar industrije alata, jer je obuhvatala zna\u010dajne rudarske resurse i brojnu industrijsku proizvodnju alata, kao \u0161to su kova\u010dnice du\u017e reka. Sam naziv kompanije poti\u010de od prvih slova imena njenog osniva\u010da, Vilija Hana.\n\nNakon \u010detiri godine, sedi\u0161te kompanije je preme\u0161teno u \u0160onah, gde se i danas nalazi.\n\nPo\u010detno su proizvodili samo pri\u010dvr\u0161\u0107iva\u010de, ali je 1947. godine zapo\u010deta proizvodnja \u0161rafcigera. U narednim decenijama, Wiha je nastavila \u0161irenje svog asortimana, uvode\u0107i nove proizvode, uklju\u010duju\u0107i imbus klju\u010deve i se\u010diva.\n\nGodine 1966. kupili su pogon u Men\u0161vajleru/\u0160varcvald, gde se danas proizvode se\u010diva i imbus klju\u010devi. Wiha je tako\u0111e nastavila \u0161irenje i otvaranjem filijala u Sjedinjenim Ameri\u010dkim Dr\u017eavama (1985), kao i u Francuskoj, \u0160paniji, Velikoj Britaniji, Danskoj, Poljskoj, Kini, Vijetnamu, Tajlandu, Kanadi i azijsko-pacifi\u010dkom regionu.",
          en: "Wiha was founded in 1939 in Wuppertal by Willi Hahn. The Bergisches Land region, known as the early center of tool industry, had significant metal resources and numerous forges along its rivers. The name Wiha comes from the first letters of the founder\u2019s name, Willi Hahn.\n\nFour years later, the company moved its headquarters to Sch\u00f6nenbach, where it remains today.\n\nInitially, Wiha produced only fasteners, but in 1947, the production of screwdrivers began. Over the years, additional key product lines, including hex keys and blades, were introduced.\n\nIn 1966, Wiha acquired a facility in M\u00f6nschweiler/Black Forest, where today they manufacture blades and hex keys. In 1985, Wiha opened a branch in the United States (now Willi Hahn Corp.) and expanded further to France, Spain, the UK, Denmark, Poland, China, Vietnam, Thailand, Canada, and the Asia-Pacific region.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Wiha stalno investira u inovativne tehnologije koje unapre\u0111uju funkcionalnost i kvalitet alata. Kroz razvoj proizvoda kao \u0161to su ru\u010dke sa vi\u0161ekomponentnim slojevima i precizno kalibrisani moment klju\u010devi, Wiha alati pru\u017eaju vrhunske performanse.\n\nKompanija se oslanja na iskustva i povratne informacije stru\u010dnjaka kako bi stalno unapre\u0111ivala svoje proizvode. Kao jedan od lidera na tr\u017ei\u0161tu alata, Wiha je prepoznata po svom posve\u0107enju kvalitetu, inovacijama i korisni\u010dkom iskustvu.\n\nWiha alati, zahvaljuju\u0107i svojoj visokoj pouzdanosti i tehnologiji, postali su klju\u010dni u industrijama \u0161irom sveta, osiguravaju\u0107i svojim korisnicima dugoro\u010dnu vrednost i efikasnost.",
          en: "Wiha continuously invests in innovative technologies that enhance the usability and functionality of its tools. From multi-component handles to precision-calibrated torque wrenches, each Wiha tool is designed to meet the highest industry standards.\n\nThe company relies on feedback from experts to constantly improve its products, offering reliable solutions. Wiha is recognized as a brand focused on quality, user adaptability, and technological advancement.\n\nWith its focus on high-performance and innovative solutions, Wiha tools are used globally, ensuring efficiency and reliability for users.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "Wiha nudi \u0161irok asortiman alata, sa vi\u0161e od 3.500 razli\u010ditih proizvoda, uklju\u010duju\u0107i \u0161rafcigere, alate za merenje obrtnog momenta, imbus klju\u010deve, bitove, kle\u0161ta, \u010deki\u0107e i merni alat. Sa globalnom prisutno\u0161\u0107u i visokom kvalitetom, Wiha alati su prepoznati u industriji.\n\nOva porodi\u010dna kompanija zapo\u0161ljava oko 750 ljudi \u0161irom sveta, a proizvodi Wiha su sinonim za inovativnu proizvodnju i dugoro\u010dne standarde u alatnoj industriji.",
          en: "Wiha offers an extensive range of tools, with over 3,500 different products, including screwdrivers, torque measurement tools, hex keys, bits, pliers, hammers, and measuring instruments. With a global presence and a commitment to quality, Wiha tools have become synonymous with innovative manufacturing and long-term standards in the tool industry.\n\nThe family-owned company employs around 750 people worldwide, and Wiha products are known for their precision and durability.",
        },
      },
      {
        title: { sr: "Priznanja i sponzorstva", en: "Awards and sponsorships" },
        body: {
          sr: "Wiha je vi\u0161e puta nagra\u0111ena za dizajn svojih proizvoda, tehni\u010dke inovacije i dru\u0161tvenu odgovornost. Kompanija je osvojila brojne presti\u017ene nagrade, uklju\u010duju\u0107i oko 20 iF nagrada, od kojih je jedna zlatna nagrada za Wiha dr\u017ea\u010d bitova sa magazinom, kao i desetine Red Dot nagrada, uklju\u010duju\u0107i presti\u017enu Red Dot Best of the Best nagradu.\n\nPored toga, Wiha je od 2010. godine glavni sponzor regionalnog ko\u0161arka\u0161kog tima Wiha Panthers Schwenningen, \u010dime pokazuje svoju posve\u0107enost dru\u0161tvenoj odgovornosti i promociji sportskih aktivnosti.",
          en: "Wiha has received numerous accolades for product design, technological innovations, and corporate social responsibility, including nearly 20 iF Awards, one of which is a gold award for the Wiha bit holder with magazine, and about 10 Red Dot Awards, including the prestigious Red Dot Best of the Best.\n\nSince 2010, Wiha has been the main sponsor of the regional basketball team Wiha Panthers Schwenningen, demonstrating its commitment to social responsibility and promoting sports activities.",
        },
      },
    ],
    catalogs: [
      { name: "Wiha katalog", pdfUrl: "https://drive.google.com/file/d/1s2s4TmSn_7inwljmfF0mznbdVXWMGEDJ/view?usp=share" },
      { name: "Wiha merni alati", pdfUrl: "https://drive.google.com/file/d/196RbKP5DyiWkJnqvOx1ML10Gby4M2CiG/view?usp=share" },
      { name: "Wiha XXL III kofer", pdfUrl: "https://drive.google.com/file/d/1gfqq3qQRqocaSAXVwRm-3s9lGDpyDNbn/view?usp=share" },
    ],
    color: "#C8C8C8",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/wiha/",
  },
  {
    slug: "knipex",
    name: "Knipex",
    logoSrc: "/logos/knipex-logo.svg",
    description: "Knipex je vode\u0107i proizvo\u0111a\u010d visokokvalitetnih ru\u010dnih alata specijalizovanih za rad sa cevima, \u017eicama i sli\u010dnim materijalima.",
    heroDescription: { sr: "Knipex alati - Uvoznik za Srbiju", en: "Knipex Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Knipex je ve\u0107 \u010detiri generacije nezavisno, porodi\u010dno preduze\u0107e sa sedi\u0161tem u Kronenbergu, Vupertal, u srcu nema\u010dke industrije alata. Poznat po vrhunskim kle\u0161tima i specijalizovanim ru\u010dnim alatima, Knipex proizvodi sve osnovne artikle, uklju\u010duju\u0107i kvalitetna kle\u0161ta i profesionalne alate, isklju\u010divo u Nema\u010dkoj. Pojedini dodatni alati, poput pinceta i ko\u017enih torbi za alat sa Knipex brendom, dolaze od pa\u017eljivo odabranih eksternih dobavlja\u010da.\n\nKompanija je osnovana 1882. godine kao mala kova\u010dnica koju je pokrenuo Karl Gustav Pu\u010d u podrumu svoje porodi\u010dne ku\u0107e. Po\u010deli su sa samo jednim radnikom i dva pripravnika, a ve\u0107 tada se fokusirali na proizvodnju kle\u0161ta za tesare i potkiva\u010de. Ta kle\u0161ta su se u po\u010detku izra\u0111ivala ru\u010dno, ali je ubrzo usledila modernizacija uz upotrebu \u010deki\u0107a za kovanje. Na vrhuncu pod vo\u0111stvom Karla Pu\u010da, proizvodilo se \u010dak 7.000 pari kle\u0161ta nedeljno.\n\nKnipex je 1942. zvani\u010dno za\u0161titio svoj brend, a nova generacija porodice Pu\u010d nastavila je razvoj. Godine 1954, tre\u0107a generacija, Karl Pu\u010d, preuzima vo\u0111enje firme i uvodi automatizaciju, inovacije i patente u proizvodni proces. Od 1996. godine, firmu vodi Ralf Pu\u010d, praunuk osniva\u010da, koji je pro\u0161irio prisustvo Knipex alata na vi\u0161e od deset zemalja \u0161irom sveta. Danas se vi\u0161e od 60% proizvodnje izvozi, \u0161to govori o globalnom ugledu koji Knipex u\u017eiva kao lider u proizvodnji kle\u0161ta i alata za elektri\u010dare, vodoinstalatere i druge zanatlije.",
          en: "Knipex is a fourth-generation, family-owned and independent company based in Cronenberg, Wuppertal, located in the heart of Germany\u2019s tool manufacturing region. Renowned for its high-quality pliers and specialized hand tools, Knipex produces all core items, including premium pliers and professional tools, exclusively in Germany. Certain additional tools, such as tweezers and branded leather tool bags, are sourced from carefully selected external suppliers.\n\nThe company was founded in 1882 as a small forge by Carl Gustav Putsch in the basement of his family home. It began with just one worker and two apprentices, focusing from the start on manufacturing pliers for carpenters and farriers. These pliers were initially made by hand, but modernization quickly followed with the introduction of power hammers. At its peak under Carl Putsch\u2019s leadership, the company was producing as many as 7,000 pairs of pliers per week.\n\nKnipex officially registered its brand in 1942, and the next generation of the Putsch family continued the company\u2019s growth. In 1954, the third generation, led by Karl Putsch, took over the business, introducing automation, innovation, and patents into the manufacturing process. Since 1996, the company has been headed by Ralf Putsch, great-grandson of the founder, who has expanded the Knipex presence to more than ten countries worldwide. Today, over 60% of production is exported, demonstrating the brand\u2019s global reputation as a leading manufacturer of pliers and tools for electricians, plumbers, and professional craftsmen.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Knipex se izdvaja kao brend koji neprekidno pomera granice u razvoju ru\u010dnih alata. Njihovi alati, posebno Cobra kle\u0161ta sa sistemom za brzo pode\u0161avanje jednom rukom, predstavljaju spoj funkcionalnosti i preciznosti. Cobolt seka\u010di su jo\u0161 jedan primer inovacije, kompaktni, ali izuzetno mo\u0107ni alati za se\u010denje zavrtnjeva i tvrdih materijala. Kle\u0161ta-klju\u010devi kombinuju funkcije vilju\u0161kastog klju\u010da i standardnih kle\u0161ta, nude\u0107i korisnicima alat visoke preciznosti i izdr\u017eljivosti.\n\nOva tehnolo\u0161ka re\u0161enja \u010dine Knipex alatima sinonimom za profesionalne performanse u svim granama industrije, naro\u010dito u elektroinstalacijama, odr\u017eavanju, monta\u017ei solarnih sistema i drugim specijalizovanim poslovima.",
          en: "Knipex stands out as a brand that continuously pushes the boundaries in hand tool development. Their tools, especially the Cobra pliers with one-handed quick adjustment, represent a perfect blend of functionality and precision. The Cobolt cutters are another innovation, compact yet extremely powerful tools capable of cutting bolts and tough materials. Pliers wrenches combine the functionality of an adjustable wrench and standard pliers, offering users a high-precision, durable solution.\n\nThese advanced designs make Knipex tools synonymous with professional performance across all industries, especially in electrical installations, maintenance, solar system assembly, and other specialized technical fields.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "Knipex katalog sadr\u017ei oko 100 razli\u010ditih modela kle\u0161ta, sa vi\u0161e od 900 varijacija u du\u017eini, obliku dr\u0161ke i zavr\u0161noj obradi. U ponudi su bo\u010dni seka\u010di, kle\u0161ta za elektri\u010dare, vodoinstalaterska kle\u0161ta, kao i visoko specijalizovani alati za elektroniku i precizne poslove. Alati za elektri\u010dare uklju\u010duju re\u0161enja za se\u010denje kablova, skidanje izolacije i krimpovanje \u017eica, sve uz maksimalnu ergonomiju i sigurnost.\n\nVe\u0107ina modela dostupna je i u varijantama sa izolovanim dr\u0161kama, koje \u0161tite od elektri\u010dnog napona do 1.000 V, \u0161to ih \u010dini neophodnim izborom za sve profesionalce u elektroindustriji. Sistem ozna\u010davanja alata koristi decimalnu \u0161ifru koja sadr\u017ei informacije o tipu kle\u0161ta, obliku vilica i veli\u010dini alata, \u0161to korisnicima olak\u0161ava izbor pravog modela.\n\nKnipex se oslanja na sopstvenu proizvodnju, sa internim procesima koji obuhvataju sve faze, od kovanja, bu\u0161enja, glodanja i bru\u0161enja do laserske obrade, \u010dime se osigurava vrhunski kvalitet svakog komada.",
          en: "The Knipex catalog features around 100 different plier models, with over 900 variations in size, handle design, and finish. The range includes side cutters, electrician\u2019s pliers, water pump pliers, and highly specialized tools for electronics and precision work. Electrician\u2019s tools include cable cutters, wire strippers, and crimping tools, engineered for maximum ergonomics and safety.\n\nMost models are available in insulated versions, tested to withstand electrical voltage up to 1,000 V, making them an essential choice for professionals in the electrical industry. The tool classification system uses a decimal code that provides information about the type of pliers, jaw design, and size, helping users easily identify the right model.\n\nKnipex relies entirely on in-house production, with internal processes covering all stages, from forging, drilling, and milling to grinding and laser processing, ensuring top-level quality in every product.",
        },
      },
      {
        title: { sr: "Knipex muzej", en: "Knipex museum" },
        body: {
          sr: "U sedi\u0161tu firme u Vupertalu nalazi se Knipex muzej, posve\u0107en istoriji ru\u010dnih alata i razvoja alata kroz vreme. Na dva sprata, posetioci mogu videti alate, ma\u0161ine, rekonstruisana radna mesta i predmete iz svakodnevnog \u017eivota koji oslikavaju bogatu tradiciju nema\u010dke alatni\u010darske industrije.\n\nMuzej je otvoren za javnost jednom godi\u0161nje tokom manifestacije Wuppertal-24h-live, dok su grupne posete mogu\u0107e uz prethodnu najavu tokom cele godine.",
          en: "The Knipex Museum, located at the company\u2019s headquarters in Wuppertal, is dedicated to the history and evolution of hand tools over time. Spread over two floors, visitors can explore tools, machines, reconstructed workstations, and everyday items that illustrate the rich tradition of German toolmaking.\n\nThe museum is open to the public once a year during the Wuppertal-24h-live event, while group tours can be arranged by appointment throughout the year.",
        },
      },
    ],
    catalogs: [
      { name: "Knipex katalog", pdfUrl: "https://drive.google.com/file/d/1YgRP6jOCM6D4apCU-mRM_3mNn2yWiTpN/view?usp=share" },
    ],
    color: "#FF0000",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/knipex/",
  },
  {
    slug: "gtv",
    name: "GTV",
    logoSrc: "/logos/gtv-logo.png",
    description: "GTV je poznata poljska marka koja se isti\u010de svojom ponudom visokokvalitetnih proizvoda za opremanje enterijera i razne projekte.",
    heroDescription: { sr: "GTV - Uvoznik za Srbiju", en: "GTV - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Od male poljske firme, GTV je izrastao u me\u0111unarodno prepoznatog proizvo\u0111a\u010da name\u0161tajske galanterije i LED rasvete. Kompanija je poznata po brzoj operativnosti, inovativnosti i prilagodljivosti potrebama tr\u017ei\u0161ta. GTV ve\u0107 decenijama uspe\u0161no odgovara na dinami\u010dno promenljive zahteve kupaca i pa\u017eljivo prati globalne trendove u oblasti enterijera, okova i LED osvetljenja.\n\nTokom 2022. godine, GTV je pro\u0161irio svoje poslovanje kupovinom pogona specijalizovanog za proizvodnju ramova za krevete, okvira, dovratnika, mehanizama i dodataka za tapacirani name\u0161taj. Ovaj proizvodni centar u \u0160\u010ditnu predstavlja strate\u0161ki korak ka ja\u010danju prisustva u komplementarnim segmentima tr\u017ei\u0161ta name\u0161taja. Ovim potezom GTV dodatno diversifikuje svoju ponudu i omogu\u0107ava kupcima \u0161iri izbor proizvoda za savremeno opremanje prostora.\n\nVrednosti kao \u0161to su po\u0161tenje, otvorenost, profesionalizam i podr\u0161ka \u010dine temelj organizacione kulture kompanije GTV, \u0161to dodatno u\u010dvr\u0161\u0107uje poverenje kupaca i partnera \u0161irom Evrope i sveta.",
          en: "From a small Polish company, GTV has grown into an internationally recognized manufacturer of furniture fittings and LED lighting. The company is known for its fast operations, innovation, and ability to adapt to market demands. For decades, GTV has successfully responded to rapidly changing customer needs while closely monitoring global trends in interior design, hardware solutions, and LED technologies.\n\nIn 2022, GTV expanded its business by acquiring a production facility specialized in manufacturing bed frames, door frames, casings, mechanisms, and accessories for upholstered furniture. Located in Szczytno, this production center represents a strategic move to strengthen GTV\u2019s presence in complementary segments of the furniture market. This investment allows GTV to diversify its offering and provide customers with a broader range of products for modern space solutions.\n\nCore values such as honesty, transparency, professionalism, and support form the foundation of GTV\u2019s organizational culture, further reinforcing the trust of customers and partners across Europe and around the world.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "GTV konstantno ula\u017ee u savremene tehnologije i vrhunske materijale, kako bi njihovi okovi za name\u0161taj i LED rasveta zadovoljili najvi\u0161e standarde kvaliteta i estetike. Njihovi proizvodi se oslanjaju na inovacije koje prate najnovije trendove u dizajnu enterijera i pametnim re\u0161enjima za ure\u0111enje doma i poslovnog prostora.\n\nKao istinski preduzetnici, stru\u010dnjaci u GTV-u neprestano u\u010de i razvijaju nove ve\u0161tine, a svoju stru\u010dnost primenjuju kroz stvaranje proizvoda koji zadovoljavaju i trenutne i budu\u0107e potrebe tr\u017ei\u0161ta. Zahvaljuju\u0107i naprednim re\u0161enjima kao \u0161to su cloud computing, ve\u0161ta\u010dka inteligencija i automatizovani alati, GTV razvija pametne sisteme koji unapre\u0111uju korisni\u010dko iskustvo.\n\nKroz optimizaciju logisti\u010dkih procesa, GTV osigurava visoku dostupnost celokupnog asortimana, od LED traka do okova za ormare, kliznih sistema i dodataka za kuhinje i dnevne sobe.",
          en: "GTV continuously invests in cutting-edge technologies and high-quality materials to ensure their furniture fittings and LED lighting meet the highest standards of quality and design. Their products are built on innovations that follow the latest trends in interior aesthetics and smart solutions for both residential and commercial spaces.\n\nAs true entrepreneurs, the experts at GTV constantly learn, develop new skills, and apply their knowledge to create products that meet both current and future market demands. By leveraging advanced technologies such as cloud computing, artificial intelligence, and automation tools, GTV delivers intelligent systems that enhance the overall user experience.\n\nThrough the optimization of logistics processes, GTV guarantees high availability of its full product range, from LED strips and profiles to cabinet hinges, sliding systems, and kitchen accessories.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "GTV nudi jedan od najkompletnijih asortimana name\u0161tajske galanterije i LED rasvete na tr\u017ei\u0161tu. Njihova ponuda uklju\u010duje okove za name\u0161taj, kliza\u010de, \u0161arke, podizne mehanizme, ru\u010dke, dugmad, LED trake, aluminijumske profile i dodatke za osvetljenje. Ovi proizvodi omogu\u0107avaju savr\u0161enu zavr\u0161nu obradu, tihi rad fioka i vrata, kao i maksimalnu funkcionalnost u ograni\u010denom prostoru.\n\nInovativna re\u0161enja za u\u0161tedu prostora i ergonomiju doprinose modernom dizajnu enterijera, a brojni GTV proizvodi zadovoljavaju potrebe kako profesionalnih stolara, tako i hobista koji \u017eele kvalitetne i estetski privla\u010dne elemente za svoj name\u0161taj.\n\nPortfelj kompanije broji vi\u0161e od 12.000 proizvoda, uklju\u010duju\u0107i LED rasvetu, fitinge, dodatke za kuhinje, okove za garderobere i jo\u0161 mnogo toga. Ova raznovrsnost omogu\u0107ava kupcima da prona\u0111u sve potrebne komponente za projekat na jednom mestu, \u0161tede\u0107i vreme, trud i novac.\n\nSlogan \u201eKreiramo bolji svakodnevni \u017eivot za ljude\u201c oslikava njihovu posve\u0107enost stvaranju proizvoda koji ne samo da izgledaju moderno, ve\u0107 i \u010dine \u017eivot lak\u0161im i funkcionalnijim.",
          en: "GTV offers one of the most comprehensive assortments of furniture fittings and LED lighting solutions available on the market. Their extensive portfolio includes cabinet hardware, drawer slides, hinges, lift systems, handles, knobs, LED strips, aluminum profiles, and various lighting accessories. These products provide perfect finishing touches, quiet drawer and door movement, and optimal functionality in limited spaces.\n\nInnovative space-saving and ergonomic solutions contribute to modern interior design. Many GTV products are designed to meet the expectations of both professional carpenters and hobbyists who value high-quality and visually appealing components for their furniture.\n\nThe company\u2019s catalog includes more than 12,000 products, covering everything from lighting and fittings to kitchen accessories and wardrobe systems. This extensive offering allows customers to find everything they need for their projects in one place, saving time, effort, and resources.\n\nThe motto \u201cCreating a better everyday life for people\u201d reflects GTV\u2019s strong commitment to developing products that not only look great but also make everyday living simpler and more functional.",
        },
      },
      {
        title: { sr: "Podr\u0161ka", en: "Customer support" },
        body: {
          sr: "Zadovoljan kupac je glavni prioritet kompanije GTV. Zato nude sveobuhvatnu korisni\u010dku podr\u0161ku tokom cele saradnje, od izbora name\u0161tajskih okova do instalacije LED rasvete. Tim stru\u010dnjaka pru\u017ea pomo\u0107 u odabiru optimalnog re\u0161enja, brzo procesira porud\u017ebine i organizuje efikasnu isporuku.\n\nGTV podr\u017eava svoje B2B partnere kroz pouzdanu platformu, tehni\u010dku dokumentaciju, vizualizacije i marketin\u0161ke materijale. Njihovi savetnici su eksperti u oblasti name\u0161tajske galanterije i LED osvetljenja, a govore vi\u0161e jezika, kako bi komunikacija sa kupcima iz razli\u010ditih zemalja bila \u0161to jednostavnija.\n\nPoslovni partneri mogu ra\u010dunati na personalizovanu marketin\u0161ku podr\u0161ku, savete o asortimanu i znanje o tr\u017ei\u0161nim trendovima. GTV ne samo da prodaje proizvode, oni grade dugoro\u010dne odnose sa svojim klijentima i doprinose uspehu svakog projekta.",
          en: "Customer satisfaction is GTV\u2019s top priority. That\u2019s why they provide full customer support throughout the entire purchasing process, from selecting the right furniture fittings to installing LED lighting. Their team of experienced specialists offers assistance in choosing the best solutions, processes orders promptly, and ensures efficient delivery logistics.\n\nGTV supports its B2B partners with a reliable online platform, technical documentation, 3D visualizations, and a wide array of marketing materials. Their advisors are experts in the fields of furniture fittings and LED lighting and are fluent in multiple languages to ensure smooth communication with international clients.\n\nEvery business partner can count on personalized marketing support, product range consulting, and valuable insights into market trends. GTV doesn\u2019t just sell products, they build long-term relationships and contribute to the success of every project.",
        },
      },
    ],
    catalogs: [
      { name: "GTV katalog", pdfUrl: "https://drive.google.com/file/d/1O7cEdZPw2CyvNTsxmfR7ZpL9GAXlpJ5k/view?usp=share" },
    ],
    color: "#845EC2",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/gtv/",
  },
  {
    slug: "max",
    name: "MAX",
    logoSrc: "/logos/max-logo.svg",
    description: "MAX je poznata marka koja se specijalizuje za proizvodnju vrhunskih alata i ma\u0161ina, uklju\u010duju\u0107i pneumatske alate i klamerice.",
    heroDescription: { sr: "MAX alati - Uvoznik za Srbiju", en: "MAX Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Kompanija MAX je osnovana 1942. godine pod nazivom Yamada Air Industry Co., Ltd., a 1945. godine je zapo\u010dela proizvodnju poslovne i kancelarijske opreme.\n\nTokom 1964. godine, spajanjem proizvodnog i prodajnog sektora, formirana je kompanija MAX CO., LTD.\n\nOd tada, MAX se razvijao u prepoznatljivog proizvo\u0111a\u010da industrijske opreme i alata za gra\u0111evinsku industriju.\n\nKompanija se kotirala na Tokijskoj berzi 1970. godine, a glavno sedi\u0161te je 1981. preme\u0161teno u Tokio.\n\nTokom 1990-ih i 2000-ih godina, MAX je otvorio nove proizvodne pogone u Japanu, Kini, Tajlandu i Maleziji.\n\nParalelno sa \u0161irenjem, kompanija je uvela me\u0111unarodno priznate ISO sertifikate za upravljanje kvalitetom (ISO9001) i za\u0161titom \u017eivotne sredine (ISO14001), \u010dime je dodatno u\u010dvrstila svoj status lidera u industriji alata.\n\nGodine 2010. i 2014. MAX je izvr\u0161io strate\u0161ke akvizicije i osnovao nova predstavni\u0161tva u Aziji i Evropi, pro\u0161iruju\u0107i prisustvo na globalnom tr\u017ei\u0161tu.\n\nKroz decenije rada, MAX konstantno ja\u010da istra\u017eiva\u010dke kapacitete i razvija proizvode koji zadovoljavaju visoke standarde profesionalaca \u0161irom sveta.\n\nMAX je danas me\u0111unarodno prepoznat kao pouzdan proizvo\u0111a\u010d industrijskih alata, kancelarijske opreme i elektri\u010dnih alata.\n\nNjihovi razvojni timovi kreiraju proizvode sa originalnim i izdr\u017eljivim karakteristikama, koji odgovaraju na potrebe profesionalnih korisnika u razli\u010ditim industrijama.",
          en: "Founded in 1942 under the name Yamada Air Industry Co., Ltd., MAX began manufacturing business and office equipment in 1945.\n\nIn 1964, the integration of production and sales sectors led to the formation of MAX CO., LTD.\n\nSince then, MAX has grown into a globally recognized manufacturer of industrial tools and equipment for the construction industry.\n\nThe company was listed on the Tokyo Stock Exchange in 1970, and the headquarters moved to Tokyo in 1981.\n\nDuring the 1990s and 2000s, MAX expanded its manufacturing capabilities with new plants in Japan, China, Thailand, and Malaysia.\n\nIt also introduced ISO9001 and ISO14001 certifications, reinforcing its commitment to quality and environmental responsibility.\n\nIn 2010 and 2014, key acquisitions and the establishment of new offices across Asia and Europe allowed MAX to further expand its global footprint.\n\nOver the decades, MAX has strengthened its R&D capabilities, becoming a leading developer of tools that meet the evolving needs of professionals worldwide.\n\nToday, MAX is internationally recognized as a reliable manufacturer of industrial equipment, office solutions, and power tools.\n\nIts product development teams focus on creating durable and innovative tools that cater to the demands of various industries.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Inovacije u kompaniji MAX zapo\u010dinju u istra\u017eiva\u010dkim, dizajnerskim i proizvodnim odeljenjima, a zavr\u0161avaju se kod krajnjih korisnika koji koriste MAX alate u svakodnevnom radu.\n\nNa osnovu povratnih informacija sa tr\u017ei\u0161ta, proizvodi se neprekidno prilago\u0111avaju stvarnim uslovima rada.\n\nBliska saradnja sa korisnicima omogu\u0107ava kompaniji da prati tehnolo\u0161ke trendove i predvidi budu\u0107e potrebe u gra\u0111evinskoj i industrijskoj proizvodnji.\n\nMAX alati se razvijaju u Japanu i proizvode u pogonima sa ISO sertifikatima, garantuju\u0107i visoku pouzdanost i kvalitet.\n\nSvaki proizvod prolazi rigorozne testove kako bi zadovoljio interne standarde kvaliteta i izdr\u017eljivosti.\n\nStalnim ulaganjem u istra\u017eivanje i razvoj, MAX doprinosi stvaranju pametnih alata i re\u0161enja koja zna\u010dajno olak\u0161avaju rad na gradili\u0161tu, u proizvodnim halama i kancelarijskom okru\u017eenju.",
          en: "Innovation at MAX begins in the research, design, and production departments and ends with the end-user.\n\nBased on user feedback, MAX tools are regularly optimized for real-world conditions.\n\nClose collaboration with customers enables the company to stay ahead of emerging trends and anticipate industry developments.\n\nMAX tools are developed in Japan and produced in ISO-certified factories, ensuring reliability and premium quality.\n\nAll products undergo rigorous testing to meet internal standards.\n\nContinuous investment in R&D allows MAX to design smart tools and advanced solutions that make work on-site and in the workshop easier and more efficient.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "MAX je postao sinonim za inovacije u oblasti alata, bio je prvi na svetu koji je razvio eksericu za krovove (1982), baterijski alat za vezivanje armature (1993), kao i kompresore i pneumatske ekserice visokog pritiska (1994).\n\nOvi alati su prepoznati me\u0111u profesionalcima zbog svoje pouzdanosti, dugotrajnosti i ergonomije.\n\nIndustrijski alati MAX uklju\u010duju \u010dvrste, ali lagane ure\u0111aje specijalno razvijene za primenu u gra\u0111evinskoj industriji.\n\nAsortiman obuhvata pneumatske ekserice, kompresore visokog pritiska (do 20 bara), alate za metal i beton, kao i dodatke za efikasno izvo\u0111enje radova na terenu.\n\nKancelarijska divizija kompanije MAX nudi \u0161irok spektar ure\u0111aja, me\u0111u kojima su poznate heftalice \u201eFlat Clinch\u201c i \u201eIntegral\u201c koje se koriste \u0161irom sveta u \u0161tamparijama i kancelarijama.\n\nMAX je poznat i po ure\u0111ajima za obradu \u010dekova namenjenim finansijskom sektoru, kao i sistemima za \u0161tampanje i rezanje etiketa, oznaka i kablova, koji nalaze primenu u industrijskim i obrazovnim okru\u017eenjima.\n\nMAX alati, kancelarijska oprema i ure\u0111aji za specijalizovanu upotrebu nude kompletna re\u0161enja za profesionalce iz razli\u010ditih sektora.\n\nNjihov \u0161irok asortiman \u010dini ih pouzdanim partnerom za sve koji tra\u017ee kvalitet, preciznost i inovaciju.",
          en: "MAX has pioneered many tools on the global market, including the first roofing nailer (1982), battery-powered rebar tying tool (1993), and high-pressure compressors and nailers (1994).\n\nThese tools are widely trusted by professionals for their performance, durability, and ergonomic design.\n\nMAX's industrial tools include powerful yet lightweight devices developed with proprietary features.\n\nThe range covers pneumatic nailers, 20-bar high-pressure compressors, metal and concrete tools, and accessories used in construction.\n\nThe office equipment division includes a variety of staplers, such as the innovative Flat Clinch and Integral models used in copy machines worldwide.\n\nMAX also offers check-processing devices for the financial sector and labeling systems for industrial and educational use, including tube marking tools and cable identification systems.\n\nMAX's diverse portfolio provides complete solutions for professionals across multiple sectors.\n\nIts tools and office equipment stand for reliability, innovation, and performance, making MAX a trusted brand for those who value quality in every task.",
        },
      },
    ],
    catalogs: [
      { name: "MAX katalog", pdfUrl: "https://drive.google.com/file/d/1k3AzwfcE_RlB8xJiO1Tp1nZQwrnEyZje/view?usp=share" },
    ],
    color: "#FFA43B",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/max/",
  },
  {
    slug: "hogert",
    name: "H\u00f6gert",
    logoSrc: "/logos/hogert-logo.png",
    description: "Hogert je specijalizovani proizvo\u0111a\u010d ru\u010dnih alata koji se isti\u010de po inovativnosti i ergonomskom dizajnu prilago\u0111enom profesionalcima.",
    heroDescription: { sr: "H\u00f6gert alati - Uvoznik za Srbiju", en: "H\u00f6gert Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "H\u00f6gert je noviji, ali ambiciozan brend ru\u010dnih alata i za\u0161titne opreme, sa jasnom vizijom da zauzme zna\u010dajno mesto u sektoru profesionalnog alata.\n\nOd samog osnivanja, H\u00f6gert Technik usmerava razvoj svojih proizvoda ka savremenim tehni\u010dkim re\u0161enjima i visokim standardima izrade, oslanjaju\u0107i se na proveren kvalitet, pouzdanost i dugotrajnost.\n\nOvaj savremeni brend prisutan je na me\u0111unarodnim tr\u017ei\u0161tima, a njegovi ru\u010dni alati i oprema dostupni su \u0161irom Evrope, Azije i Ju\u017ene Amerike od 2015. godine.\n\nKlju\u010dne vrednosti H\u00f6gert-a, iskrenost, stru\u010dnost, podr\u0161ka korisnicima i spremnost za nove izazove, deo su njegovog identiteta i organizacione kulture.\n\nH\u00f6gert Technik funkcioni\u0161e kroz efikasne organizacione strukture koje omogu\u0107avaju brzo dono\u0161enje odluka, uz jasnu i otvorenu komunikaciju sa partnerima i korisnicima.\n\nKompanija je usmerena na stalna unapre\u0111enja, otvorena je za promene i fokusirana na razvoj brenda i ja\u010danje prisustva na tr\u017ei\u0161tu alata i opreme za profesionalce.",
          en: "H\u00f6gert is a relatively new but ambitious brand of hand tools and protective equipment, with a clear goal to establish a strong presence in the professional tools sector.\n\nFrom the very beginning, H\u00f6gert Technik has focused on combining modern technical solutions with proven quality and reliability, aiming to offer tools that professionals can trust.\n\nAs a modern brand operating on the international market, H\u00f6gert's hand tools and equipment have been available across Europe, Asia, and South America since 2015.\n\nThe company is built on core values such as honesty, readiness for new challenges, user support, and technical expertise, all of which are embedded in H\u00f6gert Technik's organizational culture.\n\nWith efficient organizational structures that enable fast decision-making and clear internal and external communication, H\u00f6gert is open to innovation, development, and new approaches.\n\nThe company conducts business with a focus on strategic brand development and expanding its presence in the tool and equipment market.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Kvalitet i inovacija su temeljne vrednosti brenda H\u00f6gert Technik.\n\nU okviru svojih laboratorija, kompanija sprovodi precizna ispitivanja i merenja alata, sa ciljem kontrole kvaliteta, optimalne raspodele resursa i stalnog unapre\u0111enja proizvoda.\n\nFokus je na kreiranju alata koji olak\u0161avaju svakodnevni rad profesionalcima u industriji i gra\u0111evinarstvu.\n\nRazvojem inovativnih re\u0161enja i pa\u017eljivim pristupom dizajnu, H\u00f6gert podi\u017ee standarde ne samo unutar svoje kompanije, ve\u0107 i u \u010ditavoj industriji.\n\nBrend je poznat po te\u017enji ka jednostavnosti, korisnosti i pouzdanosti, uz posebnu pa\u017enju na dugotrajnu i intenzivnu upotrebu alata u zahtevnim uslovima rada.",
          en: "Quality and innovation are fundamental principles at H\u00f6gert Technik.\n\nIn-house laboratories conduct detailed product testing and quality measurements to ensure effective resource management and continuous product improvement.\n\nThe goal is to develop tools that simplify work for professionals in construction and industry.\n\nBy continuously exploring innovative solutions and enhancing product design, H\u00f6gert raises the standards within the company and the industry at large.\n\nThe brand is committed to simplicity, usability, and reliability, creating tools built for heavy-duty, everyday use in demanding conditions.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "H\u00f6gert Technik nudi \u0161irok spektar proizvoda koji obuhvataju ru\u010dne alate, kao \u0161to su odvija\u010di, klju\u010devi, kle\u0161ta i merni instrumenti, dizajnirani za precizan, dugotrajan i profesionalan rad.\n\nU ponudi su i elektri\u010dni alati koji omogu\u0107avaju efikasno izvo\u0111enje zadataka u razli\u010ditim radnim uslovima.\n\nPored alata, H\u00f6gert razvija i visokokvalitetnu za\u0161titnu opremu, radne rukavice, za\u0161titne nao\u010dare, \u0161lemove i radnu obu\u0107u.\n\nOva oprema je dizajnirana da pru\u017ei maksimalnu sigurnost i udobnost korisnicima u industrijskim i gra\u0111evinskim okru\u017eenjima.\n\nPoseban akcenat stavljen je na izbor sirovina: ugljeni\u010dni \u010delik koji se koristi u proizvodnji ru\u010dnih alata osigurava otpornost, \u010dvrsto\u0107u i dug vek trajanja.\n\nH\u00f6gert Technik sara\u0111uje isklju\u010divo sa renomiranim industrijskim partnerima, proveravaju\u0107i svaki korak u lancu snabdevanja kako bi garantovao alat visokog kvaliteta i pouzdanog porekla.\n\nSvi H\u00f6gert alati i proizvodi poseduju relevantne sertifikate kvaliteta, uklju\u010duju\u0107i T\u00dcV Rheinland i VDE, kao i uskla\u0111enost sa zahtevima DIN standarda Nema\u010dkog instituta za standardizaciju.\n\nOvi sertifikati potvr\u0111uju da su H\u00f6gert proizvodi u skladu sa najvi\u0161im standardima sigurnosti i performansi.",
          en: "H\u00f6gert Technik offers a comprehensive portfolio of hand tools, including screwdrivers, wrenches, pliers, and measuring instruments, engineered for precision, durability, and professional performance.\n\nThe range also includes power tools designed for efficient task execution in various working environments.\n\nIn addition to tools, H\u00f6gert produces high-quality protective equipment, including work gloves, safety glasses, helmets, and work footwear, all developed to ensure maximum protection and comfort in industrial settings.\n\nSpecial attention is given to raw materials: carbon steel is used in the production of hand tools, ensuring resistance, strength, and long service life.\n\nH\u00f6gert Technik carefully selects and audits its suppliers, working only with trusted industry partners to provide tools of verified origin and superior quality.\n\nAll H\u00f6gert products are certified by leading institutions such as T\u00dcV Rheinland and VDE, and meet the requirements of the German DIN standard.\n\nThese certifications confirm that H\u00f6gert tools comply with the highest standards of safety, quality, and performance.",
        },
      },
    ],
    catalogs: [
      { name: "Hogert elektri\u010darski alati", pdfUrl: "https://drive.google.com/file/d/1hIUpfarX9a1t8VKnGRGQabIm0u2eNwdh/view?usp=share" },
      { name: "Hogert HTZ", pdfUrl: "https://drive.google.com/file/d/16VbxheVuQsX2_aXxc61DBd4Gn0NqcgKZ/view?usp=share" },
      { name: "Hogert ode\u0107a katalog", pdfUrl: "https://drive.google.com/file/d/1CX8oW1BicRW6SdUNhOAxamVy_Y1dnUCw/view?usp=share" },
      { name: "Hogert ru\u010dni alati", pdfUrl: "https://drive.google.com/file/d/1hFN3PuIF2n-LS86D3cGeI0sIlmXoMUTe/view?usp=share" },
    ],
    color: "#4F73FF",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/hogert/",
  },
  {
    slug: "wera",
    name: "Wera",
    logoSrc: "/logos/wera-logo.svg",
    description: "Wera je priznata nema\u010dka marka specijalizovana za visokokvalitetne ru\u010dne alate. Projektuje i proizvodi vi\u0161e od 3.000 razli\u010ditih alata.",
    heroDescription: { sr: "Wera alati - Uvoznik za Srbiju", en: "Wera Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Godine 1936, preduzetnik Hermann Werner osnovao je Hermann Werner GmbH & Co. KG kao trgovinsku firmu specijalizovanu za prodaju alata. Ova osnova postavila je temelje za ono \u0161to \u0107e kasnije postati globalno prepoznat brend, Wera alati.\n\nDesetak godina kasnije, firma je rekonstruisana pod vo\u0111stvom Heinza Amtenbrinka, zeta porodice Werner. Tada se zapo\u010dinje proizvodnja odvija\u010da, \u0161to je ozna\u010dilo po\u010detak razvoja ru\u010dnih alata pod sopstvenim brendom. Od 1951. godine, kompanija koristi naziv Wera, kombinacijom imena Werner i Amtenbrink, \u010dime je postavljen identitet koji se odr\u017eava i danas.\n\nProizvodnja bitova zapo\u010dela je 1963. godine, a samo pet godina kasnije, u saradnji sa Fraunhofer institutom, razvijena je poznata Kraftform ru\u010dka, jedna od najprepoznatljivijih inovacija u svetu odvija\u010da. Ova ru\u010dka ostala je deo Wera logotipa, simbola kvaliteta i pouzdanosti nema\u010dkih alata.\n\nTokom 1990-ih, Wera Tools uvodi bitove presvu\u010dene dijamantom i \u0161iri se preuzimanjem Drehmax W. Holland i osnivanjem prodajne podru\u017enice u Velikoj Britaniji. Godine 1995, deo proizvodnje se seli u \u010ce\u0161ku Republiku, u grad Byst\u0159ice.\n\nNakon \u0161to se osniva\u010d povukao iz posla, Wera je 2016. godine prodata Bitburger Holdingu. Te iste godine otvoren je moderan logisti\u010dki centar u Wuppertalu, povr\u0161ine 20.000 m\u00b2. Kompanija je tada zapo\u0161ljavala vi\u0161e od 750 ljudi globalno, uklju\u010duju\u0107i vi\u0161e od 400 u \u010ce\u0161koj. Ekspanzija je nastavljena 2018. godine otvaranjem filijale u T\u0159eb\u00ed\u010du.\n\nOd 2019. godine, brend je prisutan i na promotivnim doga\u0111ajima sa svojim balonom u obliku odvija\u010da, isti\u010du\u0107i jedinstven pristup komunikaciji sa korisnicima. Wera alati su postali sinonim za preciznost, pouzdanost i inovacije u alatima.",
          en: "In 1936, entrepreneur Hermann Werner founded Hermann Werner GmbH & Co. KG as a trading company specializing in tools. This laid the foundation for what would later become a globally recognized brand, Wera tools.\n\nThe company was restructured about a decade later under the leadership of Heinz Amtenbrink, Werner\u2019s son-in-law. It was then that the production of screwdrivers began, marking the start of Wera\u2019s own line of hand tools. Since 1951, the company has used the name Wera, a combination of Werner and Amtenbrink, establishing the brand identity that continues to this day.\n\nThe production of bits began in 1963. In 1968, in collaboration with the Fraunhofer Institute, the company developed the iconic Wera Kraftform handle, which remains a part of the Wera logo and reflects the brand\u2019s dedication to ergonomic design in German tools.\n\nDuring the 1990s, Wera Tools introduced diamond-coated bits and expanded by acquiring Drehmax W. Holland and establishing a sales branch in the United Kingdom in 1993. In 1995, manufacturing was relocated to Byst\u0159ice, in the Czech Republic.\n\nFollowing the founder\u2019s retirement, Wera was sold to Bitburger Holding in 2016. That same year, a 20,000 m\u00b2 logistics center was opened in Wuppertal. By then, the company employed over 750 people worldwide, including more than 400 in the Czech Republic. The expansion continued in 2018 with the opening of a new branch in T\u0159eb\u00ed\u010d.\n\nSince 2019, the brand has taken part in promotional events such as Montgolfiade, Kiel Week, and Balloon Cup in the Kitzb\u00fchel Alps with a hot air balloon shaped like a screwdriver, a unique approach to engaging with users. Wera tools have become synonymous with innovation, precision, and professional hand tools.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Wera konstantno unapre\u0111uje dizajn i funkcionalnost svojih profesionalnih alata za ru\u010dnu i elektri\u010dnu upotrebu. Joker ra\u010dni klju\u010devi omogu\u0107avaju lako zatezanje i otpu\u0161tanje navrtki zahvaljuju\u0107i inovativnoj funkciji dr\u017eanja. Impaktor bit sistem je optimizovan za be\u017ei\u010dne udarne odvija\u010de, koriste\u0107i TriTorsion i Diamond tehnologiju za izdr\u017eljivost i efikasnost.\n\nWera nudi i BiTorsion bitove koji podnose velika optere\u0107enja, dok Rapidaptor dr\u017ea\u010di omogu\u0107avaju brzu i sigurnu zamenu bitova \u2013 \u010dak i jednom rukom. Tehnologija Hex-Plus spre\u010dava o\u0161te\u0107enje \u0161rafova sa \u0161esterougaonim glavama, dok Zyklop ra\u010dne kombinuju vi\u0161e funkcija i kompatibilne su sa razli\u010ditim \u010daurama.\n\nMe\u0111u najinovativnijim re\u0161enjima isti\u010du se Koloss ra\u010dna, koja slu\u017ei i kao \u010deki\u0107, kao i Chiseldriver odvija\u010d koji podnosi udarce bez gubitka preciznosti. Kraftform Kompakt setovi dolaze sa futrolama i selekcijom bitova, idealni za prenos. Posebnu pa\u017enju zaslu\u017euju Wera Stainless alati \u2013 izra\u0111eni od ner\u0111aju\u0107eg \u010delika, savr\u0161eni za za\u0161titu od korozije.",
          en: "Wera continually enhances the design and functionality of its professional tools for both manual and power tool applications. Joker combination ratchet wrenches feature a holding function that allows stable tightening and loosening of nuts. The Impaktor bit system is designed for cordless impact drivers and incorporates TriTorsion and Diamond technology for increased durability and performance.\n\nThe BiTorsion bits are built to withstand higher loads, while Rapidaptor bit holders allow for quick and secure one-handed bit changes. Hex-Plus technology prevents rounding of screws with hex heads, extending their service life. Zyklop ratchets combine multiple functions and are compatible with sockets of various sizes.\n\nAmong Wera\u2019s standout tools are the Koloss ratchet, which doubles as a hammer without damaging the tool, and the Chiseldriver, a screwdriver that can be struck with a hammer yet still offers precise screwdriving capabilities. Kraftform Kompakt sets come with holders and a selection of bits packed in hard or soft cases for easy transport. Wera Stainless tools, made from stainless steel, help prevent corrosion caused by contact with dissimilar metals.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "Wera projektuje i proizvodi vi\u0161e od 3.000 razli\u010ditih alata, uklju\u010duju\u0107i imbus klju\u010deve, ra\u010dne, \u010daure, odvija\u010de, bitove i kompletne setove alata. Sedi\u0161te kompanije je u Nema\u010dkoj, dok se proizvodnja odvija i u fabrici u \u010ce\u0161koj Republici.\n\nKroz svoju prodajnu platformu Wera Tool Rebels GmbH, brend nudi direktnu kupovinu alata za zavrtanje \u0161irom sveta. Kompanija je poznata po integraciji vi\u0161e funkcionalnosti u jedan alat, \u0161to korisnicima \u0161tedi vreme i pove\u0107ava efikasnost. Na primer, ra\u010dunasti klju\u010devi sa dodatnim funkcijama omogu\u0107avaju rad u te\u0161kim uslovima bez dodatnih alata.\n\nWera je prepoznatljiva po svojim odvija\u010dima sa Kraftform ru\u010dkom, dizajniranom za optimalno prianjanje i ergonomiju. Prepoznatljive \u201ckrune\u201d na ru\u010dki deo su vizuelnog identiteta brenda, simbolizuju\u0107i preciznost i inovaciju.",
          en: "Wera designs and manufactures over 3,000 tools including Allen keys, ratchets, sockets, screwdrivers, bits, tool sets, and compact tools. The company\u2019s headquarters is in Germany, with production facilities in the Czech Republic.\n\nThrough its subsidiary Wera Tool Rebels GmbH, the brand operates an online store for direct customer access. Wera specializes in screwdriving tools and is known for integrating multiple functions into one tool, enhancing efficiency and reducing the need for multiple instruments. For instance, their wrenches and ratchets feature advanced functionalities tailored for demanding work environments.\n\nThe brand is best known for its screwdrivers with Kraftform handles, designed to match the contours of the hand, featuring soft and hard gripping zones. The signature \u201ccrowns\u201d on the handles are part of the Wera logo, symbolizing innovation and ergonomic excellence in German tool manufacturing.",
        },
      },
      {
        title: { sr: "Nagrade", en: "Awards" },
        body: {
          sr: "Kao dokaz kvaliteta i inovacija, Wera Tools je dobitnik brojnih nagrada u oblasti dizajna i upravljanja brendom. Me\u0111u najva\u017enijima su iF Product Design Award (1997, 2009, 2012, 2013, 2015. uklju\u010duju\u0107i Zlatnu nagradu), Red Dot Design Award (\u201eBest of the Best\u201c u 2014. i nagrada 2015), i German Design Award 2015. godine.\n\nU oblasti komunikacije, Wera je tako\u0111e nagra\u0111ena Red Dot Design Award 2014. godine, a u upravljanju brendom, German Brand Award tri godine zaredom (2015\u20132017). Kompanija je 2007. godine progla\u0161ena za Top Innovator-a, dok je 2016. i 2021. godine osvojila prvo mesto u industrijskoj kategoriji Partner des Fachhandels.",
          en: "Over the years, Wera Tools has received numerous awards for product design, brand management, and innovation. In product design, Wera has won the iF Product Design Award in 1997, 2009, 2012, 2013, and 2015, including the prestigious Gold Award. The company also earned the Red Dot Design Award in 2014 for \u201cBest of the Best,\u201d and again in 2015.\n\nIn communication design, Wera received the Red Dot Design Award in 2014 and the German Design Award in 2015. For excellence in brand management, the company was honored with the German Brand Award from 2015 to 2017. In 2007, Wera was named a Top Innovator. In the industrial tools sector, Wera claimed first place in the \u201cPartner des Fachhandels\u201d award in both 2016 and 2021.",
        },
      },
    ],
    catalogs: [
      { name: "Wera katalog", pdfUrl: "https://drive.google.com/file/d/140HnM3JRm2k_F4iF_j46tbchAST-S45O/view?usp=share" },
    ],
    color: "#05B920",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/wera/",
  },
  {
    slug: "rubi",
    name: "Rubi",
    logoSrc: "/logos/rubi-logo.svg",
    description: "Rubi, sinonim za profesionalnost i preciznost, nudi vrhunsku kolekciju ma\u0161ina i alata za keramiku koji zadovoljavaju visoke standarde industrije.",
    heroDescription: { sr: "Rubi alati - Uvoznik za Srbiju", en: "Rubi Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Desetog aprila 1951. godine, mladi inovator Joan Boada podneo je u Kancelariji za registraciju i patente u Barseloni zahtev za za\u0161titu pronalaska novog alata, ru\u010dnog reza\u010da za mozaik i plo\u010dice. Ovaj alat \u0107e kasnije postati poznat \u0161irom sveta kao \u010duveni RUBI reza\u010d za plo\u010dice, jedan od najpoznatijih alata za se\u010denje keramike.\n\nRUBI reza\u010d za plo\u010dice dobio je zlatnu medalju na Prvoj nacionalnoj izlo\u017ebi pronalazaka odr\u017eanoj 1953. godine u Barseloni. Nakon toga, bra\u0107a Joan i Antoni Boada usmeravaju sve resurse na razvoj i proizvodnju ovog alata. Tokom \u0161ezdesetih godina, RUBI uvodi i udarni razbija\u010d, dodatak koji je tako\u0111e patentiran i zna\u010dajno unapre\u0111uje funkcionalnost ru\u010dnih alata za se\u010denje.\n\nZbog sve ve\u0107e potra\u017enje, 1969. godine bra\u0107i Boada se pridru\u017euje Miquel Escayol, a time je zvani\u010dno osnovana kompanija GERMANS BOADA, S.A. Ova kompanija postaje klju\u010dni nosilac brenda RUBI.\n\nSedamdesetih godina RUBI ru\u010dni reza\u010di za plo\u010dice postaju jo\u0161 sofisticiraniji. Kompanija ula\u017ee u \u0161irenje izvoza i razvija mehani\u010dki razbija\u010d koji postaje model TS, referenca u svetu profesionalnih alata za plo\u010dice.\n\nKrajem osamdesetih, sa pojavom porcelanskog granita, RUBI odgovara novim zahtevima tr\u017ei\u0161ta lansiranjem nove serije reza\u010da za plo\u010dice, posebno dizajniranih za tvr\u0111e materijale.\n\nTokom devedesetih godina RUBI do\u017eivljava pravi procvat. GERMANS BOADA, S.A. pro\u0161iruje svoje poslovanje otvaranjem filijala u Portugalu, Italiji, Francuskoj i drugim evropskim zemljama, \u0161to dodatno ja\u010da prisustvo RUBI alata na me\u0111unarodnom tr\u017ei\u0161tu.\n\nUlaskom u novo milenijum, RUBI nastavlja sa konstantnim rastom. Razvoj reza\u010da za plo\u010dice prati modernizaciju i primenu najnovijih tehnologija, prilago\u0111avaju\u0107i se savremenim izazovima u industriji.",
          en: "On April 10th, 1951, young inventor Joan Boada submitted a patent application at the Registration and Patents Office in Barcelona for a new tool, a manual cutter for mosaic and tiles. This tool would later become globally recognized as the famous RUBI tile cutter, a benchmark in the field of ceramic cutting tools.\n\nAfter winning the gold medal at the First National Invention Exhibition in Barcelona in 1953, brothers Joan and Antoni Boada focused on producing and improving this groundbreaking tool. In the 1960s, RUBI introduced the impact breaker, also invented and patented by the Boada brothers, further enhancing the performance of their manual cutting tools.\n\nDue to increasing demand, Miquel Escayol joined the brothers in 1969, marking the official establishment of GERMANS BOADA, S.A., the parent company behind the RUBI brand.\n\nDuring the 1970s, RUBI cutters continued to evolve. The company invested in exports while also developing the mechanical breaker, launching the TS model, which became a global standard for manual tile cutters.\n\nWith the emergence of porcelain granite in the late 1980s, RUBI developed a new line of manual cutters adapted to tougher materials and global market demands.\n\nThe 1990s marked a golden era for RUBI. GERMANS BOADA, S.A. expanded by opening subsidiaries in Portugal, Italy, France, and other European countries, further strengthening RUBI\u2019s position in the tile tool industry.\n\nEntering the new millennium, RUBI\u2019s growth continued steadily. The development of tile cutters adopted modern technologies, adjusting to new trends and challenges in the construction and tile-laying sectors.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "RUBI se isti\u010de po konstantnoj inovaciji i razvoju tehnologija koje profesionalcima olak\u0161avaju rad. RUBI alati su dizajnirani sa posebnim fokusom na ergonomiju, izdr\u017eljivost i jednostavnost kori\u0161\u0107enja.\n\nOd 2013. godine, RUBI uvodi na tr\u017ei\u0161te revolucionarne proizvode kao \u0161to su SLIM SYSTEM, TZ serija i elektri\u010dni reza\u010di ZERO DUST, vrhunska re\u0161enja za profesionalce koji rade sa kerami\u010dkim plo\u010dicama i prirodnim kamenom.\n\nPoseban akcenat stavlja se na lagane, ali robusne konstrukcije i udobne ru\u010dke koje omogu\u0107avaju komforan rad tokom celog dana. RUBI alati su sinonim za pouzdanost u gra\u0111evinskoj i kerami\u010darskoj industriji.",
          en: "RUBI is known for constant innovation, adapting tools to the needs of professionals. RUBI tools are designed with ergonomics, durability, and usability in mind.\n\nSince 2013, RUBI has launched advanced product lines such as the SLIM SYSTEM, TZ series, and the ZERO DUST electric cutters, providing industry-leading solutions for working with ceramic tiles and natural stone.\n\nTheir lightweight design, combined with comfortable grips, makes long work sessions easier. RUBI tools have become a symbol of reliability in the tiling and construction industry.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "RUBI nudi \u0161irok spektar alata i ma\u0161ina, od osnovnih ru\u010dnih reza\u010da za plo\u010dice do specijalizovanih elektri\u010dnih ure\u0111aja za se\u010denje keramike i kamena.\n\nNjihovi ru\u010dni reza\u010di predstavljaju siguran i precizan alat za profesionalce, bez o\u0161trih delova koji bi mogli ugroziti bezbednost korisnika. RUBI elektri\u010dni reza\u010di omogu\u0107avaju efikasno i precizno se\u010denje razli\u010ditih materijala, uklju\u010duju\u0107i granit i mermer.\n\nDodatno, RUBI asortiman obuhvata dijamantske se\u010dice za mokro i suvo se\u010denje. Ove se\u010dice su dostupne u pre\u010dnicima od 115 mm do 350 mm i kompatibilne su sa gotovo svim vrstama materijala, \u0161to ih \u010dini idealnim izborom za razne tipove kerami\u010darskih radova.",
          en: "RUBI offers a broad range of tools and machines, from basic manual tile cutters to complex electric devices for ceramic and stone cutting.\n\nTheir manual cutters ensure safety and precision, free of sharp parts that could pose a risk to users. RUBI electric cutters allow for precise, efficient cutting of materials like granite and marble.\n\nAdditionally, the RUBI product lineup includes diamond blades for wet and dry cutting, available in diameters from 115 mm to 350 mm, compatible with nearly every type of material. These blades are an ideal choice for a wide range of professional tiling tasks.",
        },
      },
    ],
    catalogs: [
      { name: "Rubi akcija 2023", pdfUrl: "https://drive.google.com/file/d/1Pu0Sd3ZYpC0pF6NHKWoyE0qMG8Upuxv7/view?usp=share" },
    ],
    color: "#FF0000",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/rubi/",
  },
  {
    slug: "senco",
    name: "Senco",
    logoSrc: "/logos/senco-logo.svg",
    description: "SENCO, sinonim za snagu i pouzdanost, nudi izuzetnu kolekciju zakiva\u010da eksera koja zadovoljava visoke standarde u gra\u0111evinskoj industriji.",
    heroDescription: { sr: "Senco alati - Uvoznik za Srbiju", en: "Senco Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "U 1930-im godinama, osniva\u010d kompanije, Albert Juilfs, radio je iz svog podruma i proizveo Springtramp Eliminator, alat koji je re\u0161avao problem vibracija u automobilima tog vremena.\n\nTaj pionirski duh postavio je temelje za budu\u0107e uspehe brenda SENCO.\n\nVe\u0107 tokom 1940-ih godina, SENCO uvodi revoluciju u industriji alatki, pravi prvi pneumatski alat za spajanje: spajalicu za industrijsku ambala\u017eu i tapaciranje.\n\nOvaj SENCO alat postavlja nove standarde brzine i efikasnosti na proizvodnoj traci i pozicionira brend kao lidera u industriji pri\u010dvr\u0161\u0107iva\u010da i pneumatskih alata.\n\nTokom 1960-ih godina, kompanija otvara prvu fabriku u Sinsinatiju, Ohio.\n\nU toj fabrici proizvodi se nova linija pri\u010dvr\u0161\u0107iva\u010da i pneumatskih alata: ekseri sa papirnom trakom i spiralni ekseri.\n\nZbog rasta potra\u017enje, fabrika se pro\u0161iruje ve\u0107 nakon pet godina.\n\nDevedesetih godina, SENCO lansira ikoni\u010dne modele kao \u0161to su SN325 framerski ekser, SFN40 i SN60 ekserke, kao i SLP20 brad ekser i M2+/M3+ spajalice.\n\nFramePro serija eksera postaje standard za graditelje, stolare i profesionalce koji tra\u017ee pouzdanost i brzinu u radu.\n\nPo\u010detkom 2000-ih, SENCO dodatno modernizuje industriju sa DURASPIN\u00ae be\u017ei\u010dnim auto-hranivim odvija\u010dem, idealnim za brzo i precizno pri\u010dvr\u0161\u0107ivanje.\n\nOva tehnologija integri\u0161e sistem za automatsko hranjenje vijaka, \u0161to \u010dini rad jo\u0161 efikasnijim.\n\nUbrzo sti\u017eu i verzije sa kablom i dodatna oprema.\n\nTokom 2010-ih, SENCO uvodi FUSION\u00ae tehnologiju, inovaciju u be\u017ei\u010dnim 15-Gauge zavr\u0161nim ekserkama koje elimini\u0161u potrebu za gorivnim \u0107elijama.\n\nAlati postaju jo\u0161 prakti\u010dniji, ekonomi\u010dniji i jednostavniji za odr\u017eavanje.\n\nU 2021. godini, nakon akvizicije od strane KYOCERA korporacije (2017), SENCO ula\u017ee u pro\u0161irenje fabrike u Sinsinatiju.\n\nNovi globalni centar konsoliduje sve SENCO resurse, unapre\u0111uju\u0107i inovacije, komunikaciju i razvoj alata za pri\u010dvr\u0161\u0107ivanje.",
          en: "In the 1930s, company founder Albert Juilfs worked from his basement and produced the Springtramp Eliminator, a device that addressed the vibration problem in automobiles of the time.\n\nBy the 1940s, SENCO created the first pneumatic stapler for industrial packaging and upholstery, setting a new standard for ease and speed on the production line.\n\nThis secured the company's future, and today, SENCO focuses on producing high-quality fastening tools.\n\nIn the 1960s, SENCO opened its first factory in Cincinnati, Ohio, where it produced a new line of fastening products\u2014paper-taped nails and coil nails.\n\nThe factory expanded five years later to support the growing production of tools and fasteners.\n\nDuring the 1990s, SENCO launched the SN325 Framing Nail and many other tools that became popular among builders, carpenters, and other professionals, including the SFN40 and SN60 nailers, M2+ and M3+ staplers, SLP20 Brad nailer, and the FramePro nailer series.\n\nIn the 2000s, SENCO revolutionized the collated nail market with its wireless DURASPIN\u00ae screwdriver.\n\nThe technology enabled a fully integrated auto-feed screw system.\n\nLater that year, a corded model and accessories were introduced.\n\nIn the 2010s, SENCO introduced FUSION\u00ae technology with the wireless 15-Gauge finish nailer, which eliminated the need for fuel cells, along with the associated costs and cleaning.\n\nIn 2021, after SENCO was acquired by KYOCERA Corporation in 2017, an investment was announced to expand the factory and bring all SENCO employees in Cincinnati under one roof.\n\nThe new global headquarters will enhance communication and innovation, allowing further progress in the coming years.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "SENCO alati prednja\u010de u inovacijama zahvaljuju\u0107i patentiranoj FUSION\u2122 tehnologiji.\n\nOva tehnologija koristi zatvorenu komoru sa komprimovanim vazduhom i baterijski motor koji pru\u017ea performanse poput klasi\u010dnih pneumatskih alata, bez potrebe za gasnim patronama ili odr\u017eavanjem.\n\nDURASPIN\u2122 sistemi sa automatskim hranjenjem vijaka omogu\u0107avaju korisnicima da rade u tesnim prostorima gde konvencionalni alati ne mogu da dopru.\n\nPovratni mehanizam dodatno pobolj\u0161ava preciznost i pove\u0107ava produktivnost do 30%, \u0161to \u010dini DURASPIN savr\u0161enim izborom za profesionalce.\n\nNEVERLUBE\u00ae tehnologija elimini\u0161e potrebu za podmazivanjem SENCO alata.\n\nSuvi podmaziva\u010di i O-prstenovi otporni na isu\u0161ivanje garantuju minimalno odr\u017eavanje, dug vek trajanja i visok u\u010dinak bez dodatnih tro\u0161kova.\n\nSENCOTE, specijalni premaz za SENCO ekseri, smanjuje trenje i pobolj\u0161ava prodor u materijale.\n\nNakon hla\u0111enja, premaz deluje kao vezivni agent, pove\u0107avaju\u0107i snagu dr\u017eanja eksera.\n\nDA stil zavr\u0161nih eksera razvijen od strane SENCO-a idealan je za ugaone ekserke, koje su naro\u010dito korisne za rad u ograni\u010denim prostorima.\n\nAutomatizacija je tako\u0111e klju\u010dni deo SENCO strategije, alati i pri\u010dvr\u0161\u0107iva\u010di lako se integri\u0161u u industrijske sisteme za serijsku proizvodnju.",
          en: "SENCO's revolutionary, patented FUSION\u2122 technology relies on a permanently sealed air chamber and a battery-powered motor that recompresses air repeatedly.\n\nWhile other cordless technologies use slow mechanical flywheels or expensive gas cartridges to drive nails, FUSION\u2122 tools function and perform like pneumatic nailers.\n\nSENCO created the first all-in-one auto-feed screw system with the launch of DURASPIN\u2122.\n\nFeaturing a corner-fit feed system, which allows access to tight spaces other drivers cannot reach, and a new return-feed drive system that improves precision, DURASPIN\u2122 boosts productivity by up to 30%.\n\nSENCO\u2019s patented NEVERLUBE\u00ae technology virtually eliminates routine tool maintenance.\n\nInternal components include a unique graphite composite that serves as a dry lubricant and self-lubricating O-rings that do not dry out.\n\nNEVERLUBE\u00ae tools do not require oiling and never need to be repacked with grease like other oil-free tools.\n\nSENCOTE is a specially formulated nail coating that reduces friction for easier driving.\n\nThe friction melts the coating inside the wood\u2014when it cools, it acts as a bonding agent, increasing holding power.\n\nSENCO also created the popular DA-style finish nail, ideal for nailers with angled magazines that are easier to maneuver in tight spaces.\n\nNailers and DURASPIN systems can be used in manufacturing environments where automation is key.\n\nSENCO tools and technologies can be incorporated into automated framing and screwing tables that build walls and structures with unmatched speed and precision on a massive scale.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "SENCO nudi \u0161irok spektar alata za pri\u010dvr\u0161\u0107ivanje, uklju\u010duju\u0107i pneumatske alate, pi\u0161tolje za ekserke, klamerice, spajalice i kompresore.\n\nNjihov asortiman zadovoljava potrebe stolara, gra\u0111evinara i profesionalaca iz svih oblasti.\n\nSENCO pneumatski alati i pri\u010dvr\u0161\u0107iva\u010di omogu\u0107avaju precizno i \u010dvrsto povezivanje materijala, \u010dak i u najzahtevnijim uslovima rada.\n\nBrzo punjenje i ergonomski dizajn omogu\u0107avaju dugotrajan rad bez umora.\n\nNjihovi kompaktni i pouzdani kompresori olak\u0161avaju svakodnevne zadatke, dok su SENCO ekseri i spajalice savr\u0161eno uskla\u0111eni sa alatima, za maksimalnu pouzdanost i vrhunske rezultate.",
          en: "Senco offers a wide range of products, from pneumatic tools to fastening machines, designed to meet the needs of professionals.\n\nTheir nailers and staplers provide precise and strong joints, even in demanding conditions, while models with quick reloading and ergonomic designs allow for long work hours with minimal fatigue.\n\nSenco compressors are compact, powerful, and reliable, enabling efficient work, while their nails and staples perfectly match their tools, providing durable and reliable joints for various projects.",
        },
      },
    ],
    catalogs: [
    ],
    color: "#FF5376",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/senco/",
  },
  {
    slug: "black-and-decker",
    name: "Black+Decker",
    logoSrc: "/logos/black-and-decker-logo.svg",
    description: "Black+Decker pru\u017ea izvanrednu kolekciju alata koja zadovoljava \u0161irok spektar potreba profesionalaca i entuzijasta \u0161irom sveta.",
    heroDescription: { sr: "Black+Decker alati - Uvoznik za Srbiju", en: "Black+Decker Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Black & Decker, poznat svetski proizvo\u0111a\u010d elektri\u010dnih alata i opreme za doma\u0107instvo, osnovan je 1910. godine od strane S. Duncana Blacka i Alonza G. Deckera. Kompanija je zapo\u010dela kao mala ma\u0161inska radionica u Baltimoru, ali se brzo istakla na tr\u017ei\u0161tu zahvaljuju\u0107i inovacijama. Ve\u0107 1917. godine patentirana je prva ru\u010dna elektri\u010dna bu\u0161ilica sa okida\u010dem, alat koji je postavio temelj za modernu proizvodnju elektri\u010dnih alata. Te iste godine otvorena je i prva fabrika u Towsonu, Maryland.\n\nTokom narednih decenija, Black & Decker konstantno \u0161iri svoje poslovanje. Kupovinom Van Dorn Electric Tool Company 1928. godine i izlaskom na Njujor\u0161ku berzu 1936. godine, kompanija u\u010dvr\u0161\u0107uje svoju poziciju lidera u industriji alata. Nakon Drugog svetskog rata, nagra\u0111ena je Army-Navy E nagradom za izuzetnu proizvodnju. Do 1960. godine, Black & Decker preuzima DeWalt, \u010dime dodatno \u0161iri svoj portfolio elektri\u010dnih i industrijskih alata.\n\nU periodu od 1975. godine, Black & Decker je nastavio sa akvizicijama, uklju\u010duju\u0107i General Electric (1984) i Emhart Corporation (1989), \u010dime je oja\u010dao ponudu malih aparata i ru\u010dnih alata. Kompanija je uvr\u0161tena u Space Foundation\u2019s Space Technology Hall of Fame zahvaljuju\u0107i razvoju be\u017ei\u010dnih alata koji su kori\u0161\u0107eni u svemirskim misijama. Godine 2010. dolazi do spajanja sa Stanley Works, \u010dime nastaje Stanley Black & Decker, globalni gigant u oblasti proizvodnje alata.\n\nNakon tog spajanja, kompanija se i dalje razvija. Godine 2012. prodaje sektor za hardver i pobolj\u0161anje doma\u0107instava, a 2014. se rebrendira u Black+Decker. Kupovina brenda Craftsman od Sears-a 2017. dodatno pro\u0161iruje asortiman. Iste godine, sklapa se i licencni ugovor sa Stovekraft-om za distribuciju proizvoda u Indiji. Do 2025. godine, Indkal Technologies zapo\u010dinje proizvodnju Black+Decker pametnih televizora za indijsko tr\u017ei\u0161te.",
          en: "Black & Decker, a globally recognized manufacturer of power tools and home equipment, was founded in 1910 by S. Duncan Black and Alonzo G. Decker. The company started as a small machine shop in Baltimore but quickly gained attention due to its innovation. In 1917, they patented the first portable electric drill with a trigger switch, a revolutionary power tool that laid the foundation for the modern tool industry. That same year, the first manufacturing plant opened in Towson, Maryland.\n\nOver the following decades, Black & Decker continued to grow. The acquisition of Van Dorn Electric Tool Company in 1928 and listing on the New York Stock Exchange in 1936 solidified its leadership in the power tool market. After WWII, the company received the Army-Navy E Award for excellence in manufacturing. By 1960, it had acquired DeWalt, further expanding its electric and industrial tool portfolio.\n\nFrom 1975, Black & Decker pursued major acquisitions, including the small appliance division from General Electric in 1984 and Emhart Corporation in 1989. Their innovation in cordless tools earned them a place in the Space Foundation\u2019s Space Technology Hall of Fame. In 2010, the merger with Stanley Works created Stanley Black & Decker, a global powerhouse in tool manufacturing.\n\nPost-merger, the company continued to evolve. In 2012, it sold its hardware and home improvement division, and in 2014, rebranded to Black+Decker. The acquisition of the Craftsman brand in 2017 and a licensing deal with Stovekraft for Indian distribution further expanded the brand. By 2025, Indkal Technologies began manufacturing Black+Decker smart TVs for the Indian market.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Black+Decker alati poznati su po tehnolo\u0161kim inovacijama koje su promenile industriju elektri\u010dnih alata. Jo\u0161 1917. godine razvijen je prvi ru\u010dni elektri\u010dni \u010deki\u0107 sa pi\u0161toljskom dr\u0161kom, alat koji je postao industrijski standard. Godine 1961. uvode se be\u017ei\u010dni alati koji koriste litijum-jonske baterije, \u010dime je Black+Decker postao pionir u oblasti akumulatorskih alata.\n\nKasnije inovacije uklju\u010duju naprednu Li-ion tehnologiju za du\u017ee trajanje baterija, kao i AutoSense, pametnu tehnologiju koja automatski pode\u0161ava snagu odvija\u010da. Kompanija je tako\u0111e razvila sofisticirane sisteme za \u010di\u0161\u0107enje doma, kao i efikasne ure\u0111aje za ba\u0161tenske radove.",
          en: "Black+Decker tools are renowned for innovations that transformed the power tool industry. In 1917, they developed the first pistol-grip electric drill. By 1961, they introduced cordless tools powered by lithium-ion batteries, making them a pioneer in battery-powered tool technology.\n\nRecent innovations include advanced Li-ion battery technology for longer runtime and AutoSense technology that intelligently adjusts torque. The company has also improved home cleaning devices and offers efficient garden maintenance solutions.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "Black+Decker nudi izuzetno \u0161irok asortiman proizvoda, uklju\u010duju\u0107i elektri\u010dne alate, akumulatorske alate, opremu za ba\u0161tu i ure\u0111aje za \u010di\u0161\u0107enje. Njihovi alati su dizajnirani za profesionalce, hobiste, ali i za svakodnevnu upotrebu u doma\u0107instvu.\n\nElektri\u010dni alati kao \u0161to su bu\u0161ilice, testerice, brusilice i odvija\u010di poznati su po pouzdanosti i ergonomiji. Akumulatorski alati, koji koriste naprednu litijum-jonsku tehnologiju, pru\u017eaju visoke performanse bez potrebe za kablovima. Alati su laki za upotrebu i brzo se pune, \u0161to ih \u010dini idealnim za rad na terenu i kod ku\u0107e.\n\nU segmentu alata za ba\u0161tu, Black+Decker nudi kosilice, trimere, duva\u010de li\u0161\u0107a i testere za grane, sve dizajnirano da olak\u0161a odr\u017eavanje dvori\u0161ta. Pored toga, kompanija nudi i ku\u0107ne ure\u0111aje za \u010di\u0161\u0107enje poput usisiva\u010da i paro\u010dista\u010da, koji garantuju visok nivo higijene u domu.\n\nBlack+Decker alati kombinuju funkcionalnost, izdr\u017eljivost i modernu tehnologiju, \u010dime zadovoljavaju \u0161irok spektar potreba potro\u0161a\u010da \u0161irom sveta.",
          en: "Black+Decker offers a vast range of products, including power tools, cordless tools, garden equipment, and cleaning devices, all designed to meet the diverse needs of professionals and everyday users.\n\nTheir power tools, such as drills, saws, grinders, and screwdrivers, are known for reliability and ergonomic design. Cordless tools, powered by lithium-ion technology, provide cable-free freedom, fast charging, and powerful performance for both home and job site tasks.\n\nIn the gardening segment, Black+Decker provides lawn mowers, trimmers, leaf blowers, and branch cutters, tools designed to simplify yard maintenance. Their home cleaning devices, including vacuums and steam cleaners, ensure hygienic and spotless environments.\n\nBlack+Decker tools blend functionality, durability, and modern technology to meet the evolving demands of users around the world.",
        },
      },
    ],
    catalogs: [
    ],
    color: "#FFA43B",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/black-and-decker/",
  },
  {
    slug: "mtx",
    name: "MTX",
    logoSrc: "/logos/mtx-logo.svg",
    description: "MTX pru\u017ea izvanrednu kolekciju ru\u010dnih alata posebno osmi\u0161ljenu za hobiste i ljubitelje ru\u010dnih radova sa fokusom na jednostavnost i funkcionalnost.",
    heroDescription: { sr: "MTX alati - Uvoznik za Srbiju", en: "MTX Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Veleprodajna kompanija MATRIZE osnovana je 1995. godine i od tada se bavi snabdevanjem i prodajom alata na veliko. Glavne aktivnosti obuhvataju distribuciju ru\u010dnog alata, kao i razvoj \u0161iroke distributivne mre\u017ee za alat. Na po\u010detku rada, kompanija je bila fokusirana na klasi\u010dne ru\u010dne alate za obradu metala, stolarske radove, merenje i farbanje. Vremenom, ponuda je pro\u0161irena na ba\u0161tenske alate, elektri\u010dne alate, gra\u0111evinske alate i gara\u017enu opremu, \u010dime je oja\u010dana pozicija na tr\u017ei\u0161tu veleprodaje alata.\n\nBrend MTX uveden je na tr\u017ei\u0161te 2001. godine. U kratkom roku, MTX alati su postali prepoznatljivi u Evropi, a zatim i u Ju\u017enoj Americi. Do 2005. godine, MATRIZE je potpisala prvi me\u0111unarodni ugovor, \u0161to je otvorilo vrata ka tr\u017ei\u0161tima Kazahstana, Ukrajine, Bugarske, Poljske, Rumunije i Brazila. Kompanija tako\u0111e sara\u0111uje sa klijentima u Gr\u010dkoj i na Kipru, dodatno \u0161ire\u0107i prisustvo MTX alata.",
          en: "The wholesale company MATRIZE was established in 1995 and has since been engaged in the supply and wholesale of tools. Its main activities include the distribution of hand tools and the development of a broad distribution network for tools. In its early years, the company focused on classic hand tools for metalwork, carpentry, measuring, and painting. Over time, the product range expanded to include garden tools, power tools, construction tools, and garage equipment, strengthening its position in the tool wholesale market.\n\nThe MTX brand was introduced to the market in 2001. Within a few years, MTX tools gained recognition in Europe and later in South America. By 2005, MATRIZE signed its first international agreement, entering the markets of Kazakhstan, Ukraine, Bulgaria, Poland, Romania, and Brazil. The company also collaborates with clients in Greece and Cyprus, further expanding the reach of MTX tools.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Sa vi\u0161e od 20 godina prisustva u industriji alata, MTX se razvila u jedan od najpoznatijih brendova ru\u010dnog alata u Rusiji i zemljama Zajednice nezavisnih dr\u017eava (ZND). MTX alati se izra\u0111uju od kvalitetnih materijala i u skladu sa savremenim tehnologijama proizvodnje, \u0161to obezbe\u0111uje dug vek trajanja i pouzdanost u svakodnevnoj upotrebi.\n\nNeprestana primena inovativnih re\u0161enja doprinosi stabilnosti performansi MTX alata, \u0161to ih \u010dini izuzetno tra\u017eenim kako me\u0111u profesionalcima, tako i me\u0111u ku\u0107nim majstorima.",
          en: "With over 20 years in the tool industry, MTX has become one of the most recognized hand tool brands in Russia and the Commonwealth of Independent States (CIS). MTX tools are made from quality materials using modern manufacturing technologies, ensuring durability and reliability in everyday use.\n\nThe constant implementation of innovative solutions contributes to the consistent performance of MTX tools, making them highly sought after by both professionals and DIY users.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "Asortiman MTX alata obuhvata veliki broj proizvoda, uklju\u010duju\u0107i osnovne ru\u010dne alate, profesionalne alate, kao i alate za specijalizovanu upotrebu. Zahvaljuju\u0107i konkurentnim cenama i kvalitetnoj izradi, MTX alati su idealni za veleprodajne kupce i krajnje korisnike. U ponudi se nalaze alati za doma\u0107instvo, gra\u0111evinske radove, ba\u0161tovanstvo i profesionalne primene, \u0161to ih \u010dini jednim od najtra\u017eenijih brendova u kategoriji alata na tr\u017ei\u0161tu.",
          en: "The MTX tool range includes a wide variety of products, from basic hand tools to professional tools and specialized equipment. Thanks to competitive prices and reliable design, MTX tools are a great choice for both wholesale customers and end users. The product lineup includes tools for household use, construction work, gardening, and professional applications, making MTX one of the most in-demand brands in the tools category.",
        },
      },
    ],
    catalogs: [
      { name: "MTX, Sparta katalog", pdfUrl: "https://drive.google.com/file/d/1wASvbffFJGKsAIN9fb1R48XCrtJmYXkM/view?usp=share" },
    ],
    color: "#FF5376",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/mtx/",
  },
  {
    slug: "sparta",
    name: "Sparta",
    logoSrc: "/logos/sparta-logo.png",
    description: "Sparta, pouzdan izbor za hobisti\u010dke projekte, pru\u017ea izvanrednu kolekciju ru\u010dnih alata namenjenu hobistima i ljubiteljima ru\u010dnih radova.",
    heroDescription: { sr: "Sparta alati - Uvoznik za Srbiju", en: "Sparta Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Naziv brenda Sparta simbolizuje duh spartanskog obrazovanja. Sparta je brend koji se tokom godina razvio sa ciljem da ponudi kvalitetan alat po pristupa\u010dnim cenama. Njihova osnovna filozofija je da svaki korisnik, bez obzira na nivo znanja ili iskustva, mo\u017ee lako i sigurno da koristi njihove alate. \n\nBrend Sparta je u vlasni\u0161tvu kompanije Mir Instrumenta. Kompanija tako\u0111e poseduje brendove Denzel, Kronverk, Sibirtech, Stern, GROSS, Matrik, STELS, Palisad i druge. Ovaj brend je pozicioniran u pristupa\u010dnom segmentu cena sa prili\u010dno visokim standardima kvaliteta proizvoda.",
          en: "The name of the Sparta brand symbolizes the spirit of Spartan education. Sparta is a brand that has developed over the years with the aim of offering quality tools at affordable prices. Their core philosophy is that every user, regardless of their level of knowledge or experience, can use their tools easily and safely.\n\n\n\nThe Sparta brand is owned by the company Mir Instrumenta. The company also owns the brands Denzel, Kronverk, Sibirtech, Stern, GROSS, Matrik, STELS, Palisad, and others. This brand is positioned in the affordable price segment with relatively high product quality standards.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Zahvaljujuc\u0301i pametnom pristupu implementaciji sekundarnih karakteristika, alat Sparta odr\u017eava potreban nivo funkcionalnosti uz minimalne tro\u0161kove. Sparta se neprestano usmerava ka pobolj\u0161anju kvaliteta i upotrebljivosti svojih proizvoda.\n\nKontinuirano prate\u0107i savremene trendove u industriji alata, ula\u017eu u razvoj ergonomskih re\u0161enja i funkcionalnosti koje olak\u0161avaju svakodnevne zadatke u doma\u0107instvu. Njihovi alati su posebno prilago\u0111eni za osnovne ku\u0107ne popravke, monta\u017ee i radove u radionici, \u010dine\u0107i ih pouzdanim saputnicima u svakom projektu.",
          en: "Thanks to a smart approach to implementing secondary features, Sparta tools maintain the necessary level of functionality at minimal cost. Sparta is constantly focused on improving the quality and usability of its products.\n\n\n\nBy continuously following current trends in the tool industry, they invest in the development of ergonomic solutions and functionalities that facilitate everyday household tasks. Their tools are especially adapted for basic home repairs, assemblies, and workshop tasks, making them reliable companions for every project.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "U \u0161irokom asortimanu Sparta alata nalaze se raznovrsni ru\u010dni alati poput klju\u010deva, odvija\u010da, kle\u0161ta, skalpela, turpija i uglomera, kao i alati za obradu drveta i stolarski pribor. Tako\u0111e nude i pi\u0161tolje za silikon koji se \u010desto koriste u monta\u017eama i zavr\u0161nim radovima. Pored toga, Sparta u svojoj ponudi ima i ba\u0161tenski alat i osnovne ma\u0161ine za rad u ku\u0107nim uslovima i oko dvori\u0161ta. \n\nProizvodi brenda Sparta razvijeni su posebno da zadovolje zahteve masovnog potro\u0161a\u010da i dizajnirani su za obavljanje jednostavnih popravki kod kuc\u0301e, na selu iu automobilu. Sparta alati su dostupni svima i bic\u0301e korisni u svakom domac\u0301instvu.",
          en: "The wide assortment of Sparta tools includes various hand tools such as wrenches, screwdrivers, pliers, utility knives, files, and squares, as well as woodworking tools and carpentry accessories. They also offer silicone guns that are often used in assembly and finishing work. In addition, Sparta also offers gardening tools and basic machines for use in household conditions and around the yard.\n\n\n\nSparta brand products are specifically developed to meet the demands of the mass consumer and are designed for carrying out simple repairs at home, in the countryside, and in the car. Sparta tools are accessible to everyone and will be useful in every household.",
        },
      },
    ],
    catalogs: [
      { name: "MTX, Sparta katalog", pdfUrl: "https://drive.google.com/file/d/1wASvbffFJGKsAIN9fb1R48XCrtJmYXkM/view?usp=share" },
    ],
    color: "#FF5376",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/sparta/",
  },
  {
    slug: "sg-tools",
    name: "SG Tools",
    logoSrc: "/logos/sg-tools-logo.png",
    description: "SG Tools je profesionalni brend dijamantskog pribora koji se isti\u010de kvalitetom i dugotrajno\u0161\u0107u dijamantskih plo\u010da i burgija.",
    heroDescription: { sr: "SG Tools - Uvoznik za Srbiju", en: "SG Tools - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "SG Tools je specijalizovan brend koji se fokusira na proizvodnju dijamantskih plo\u010da i burgija za keramiku. Cilj je pru\u017eiti kvalitetne alate koji omogu\u0107avaju precizno se\u010denje, bu\u0161enje i obradu keramike po povoljnim cenama. SG Tools je postao prepoznatljiv me\u0111u korisnicima koji tra\u017ee pouzdane proizvode koji kombinuju efikasnost i dugotrajnost, a sve to po konkurentnim cenama.",
          en: "SG Tools is a specialized brand focused on the production of diamond blades and drills for ceramics. The goal is to provide high-quality tools that enable precise cutting, drilling, and processing of ceramics at affordable prices. SG Tools has become recognized among users who seek reliable products combining efficiency and durability, all at competitive prices.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "SG Tools se ponosi primenom savremenih tehnologija u proizvodnji svojih dijamantskih plo\u010da i burgija. Svi proizvodi brenda izra\u0111eni su od visokokvalitetnih materijala, \u0161to im omogu\u0107ava dugotrajan rad, \u010dak i pri intenzivnoj upotrebi.\n\nDijamantske plo\u010de SG Tools su dizajnirane za precizno se\u010denje keramike, betona, drvenih i aluminijumskih materijala, dok burgije omogu\u0107avaju sigurno i precizno bu\u0161enje keramike bez potrebe za dodatnim priborom. SG Tools redovno unapre\u0111uje svoje proizvode kako bi zadovoljio potrebe tr\u017ei\u0161ta i obezbedio vrhunske performanse po pristupa\u010dnim cenama.",
          en: "SG Tools prides itself on applying modern technologies in the production of its diamond blades and drills. All brand products are made from high-quality materials, ensuring long-lasting performance even with heavy use.\n\nSG Tools diamond blades are designed for precise cutting of ceramics, concrete, wood, and aluminum materials, while the drills provide safe and precise drilling of ceramics without the need for additional accessories. SG Tools continuously improves its products to meet market demands and deliver top performance at affordable prices.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "Asortiman proizvoda SG Tools uklju\u010duje dijamantske plo\u010de i burgije koje su savr\u0161ene za sve vrste radova na keramici. Dijamantske plo\u010de su dostupne u razli\u010ditim veli\u010dinama, od 115 do 400 mm, i pru\u017eaju precizno, brzo i \u010disto se\u010denje. Tako\u0111e, plo\u010de su kompatibilne sa ve\u0107inom standardnih ma\u0161ina za se\u010denje, \u0161to ih \u010dini prakti\u010dnim za \u0161irok spektar korisnika.\n\nBurgije za keramiku SG Tools su dizajnirane za suvo bu\u0161enje i idealne su za rad sa kerami\u010dkim plo\u010dicama, porcelanom i drugim tvrdim materijalima.",
          en: "SG Tools offers a wide range of products, including diamond blades and drills perfect for all types of ceramic work. The diamond blades come in various sizes, from 115 to 400 mm, providing precise, fast, and clean cuts. Additionally, the blades are compatible with most standard cutting machines, making them practical for a wide range of users.\n\nSG Tools ceramic drills are designed for dry drilling and are ideal for working with ceramic tiles, porcelain, and other hard materials.",
        },
      },
    ],
    catalogs: [
    ],
    color: "#C8C8C8",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/sg-tools/",
  },
  {
    slug: "karcher",
    name: "K\u00e4rcher",
    logoSrc: "/logos/karcher-logo.svg",
    description: "K\u00e4rcher je svetski poznati proizvo\u0111a\u010d visokokvalitetnih \u010dista\u010da za doma\u0107instvo i industriju sa inovativnim tehnologijama i visokim standardima.",
    heroDescription: { sr: "K\u00e4rcher - Uvoznik za Srbiju", en: "K\u00e4rcher - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Nakon \u0161to je diplomirao na Tehni\u010dkom univerzitetu u \u0160tutgartu 1924. godine, Alfred K\u00e4rcher (1901\u20131959) pridru\u017eio se porodi\u010dnom biznisu koji se bavio prodajom industrijske opreme za kuvanje i pranje u delu \u0160tutgarta zvanom Bad Kan\u0161tat.\n\nTokom narednih godina, Alfred K\u00e4rcher je razvio niz tehni\u010dkih re\u0161enja, uklju\u010duju\u0107i elektri\u010dne uranjaju\u0107e greja\u010de i industrijske pe\u0107i za sagorevanje, \u010dime je postavio temelje za osnivanje sopstvene kompanije.\n\nGodine 1935. osnovao je Alfred K\u00e4rcher Komanditno dru\u0161tvo, a ve\u0107 1939. kompanija, tada sa 120 zaposlenih, preselila se u Vinneneden, gde se i danas nalazi sedi\u0161te.\n\nU tom periodu, firma je proizvodila proizvode kao \u0161to su \u0161poreti, kolica i greja\u010di, dok su se tokom obnove posleratnih gradova pojavili i prvi K\u00e4rcher greja\u010di za betonske oplate i sve\u017e vazduh.\n\nOd 1950-ih do 1970-ih, fokus je bio na proizvodnji industrijskih parnih generatora i grejalica, dok su tehnologije za \u010di\u0161\u0107enje tek kasnije postale glavni izvor prihoda.\n\nNakon smrti Alfreda K\u00e4rchera 1959. godine, njegovu ulogu preuzima supruga Irene K\u00e4rcher, koja je u prvoj godini upravljanja pove\u0107ala prihode za 70%.\n\nKompanija se brzo internacionalizuje 1962. osniva prodajnu firmu u Francuskoj, a ubrzo zatim i u Austriji i \u0160vajcarskoj.\n\nTokom 1970-ih, K\u00e4rcher menja korporativnu boju iz plave u \u017eutu i u potpunosti se fokusira na visokotla\u010dne \u010dista\u010de, zapo\u010dev\u0161i globalnu proizvodnju otvaranjem fabrike u Brazilu.\n\nGodine 1984. na tr\u017ei\u0161te je lansiran prvi visokotla\u010dni \u010dista\u010d za ku\u0107nu upotrebu, \u0161to ozna\u010dava po\u010detak nove ere za K\u00e4rcher, razvoj profesionalne opreme za \u010di\u0161\u0107enje i \u0161irenje portfolija.\n\nDo kraja 1980-ih, kompanija je uklju\u010dena u projekte \u010di\u0161\u0107enja istorijskih zgrada \u0161irom sveta.\n\nU 1990-im godinama, K\u00e4rcher se pro\u0161irio na komercijalno \u010di\u0161\u0107enje podova i razvio brojne aparate za ku\u0107nu i profesionalnu upotrebu, uklju\u010duju\u0107i usisiva\u010de i paro\u010dista\u010de.\n\nGodine 2003. predstavljen je prvi autonomni \u010dista\u010d za potro\u0161a\u010de, dok su u narednim godinama razvijani roboti i ba\u0161tenska oprema kao \u0161to su pumpe i prskalice.\n\nNa kraju 2011. godine, kupljena je biv\u0161a Pfleiderer fabrika, \u010dime je gotovo udvostru\u010dena operativna povr\u0161ina.\n\nU 2022. godini, K\u00e4rcher lansira Kira prvi autonomni usisiva\u010d i brisa\u010d za profesionalnu upotrebu.",
          en: "After graduating from the Technical University of Stuttgart in 1924, Alfred K\u00e4rcher (1901\u20131959) joined the family business, which sold industrial cooking and washing equipment in Bad Cannstatt, a district of Stuttgart.\n\nIn the following years, he began developing devices such as electric immersion heaters and combustion furnaces for industrial use, laying the foundation for his own company.\n\nIn 1935, he founded Alfred K\u00e4rcher Limited Partnership in Bad Cannstatt.\n\nDue to space constraints, 120 employees moved to Winnenden in 1939, where the company\u2019s headquarters remain today.\n\nBy the late 1940s, K\u00e4rcher was producing items like stoves, handcarts, and trailers for civilians.\n\nThe company also manufactured concrete formwork heaters and air heaters for post-war reconstruction.\n\nFrom the 1950s to the 1970s, K\u00e4rcher focused on producing steam generators for industry and construction, while cleaning technology became the company\u2019s main revenue stream later.\n\nOn September 17, 1959, Alfred K\u00e4rcher passed away at age 58 from a heart attack.\n\nHis wife, Irene K\u00e4rcher (1920\u20131989), took over the business, increasing revenue by 70% in the first year.\n\nBy 1962, K\u00e4rcher had opened its first sales office outside Germany, near Paris, followed by branches in Austria and Switzerland.\n\nIn the 1960s and 1970s, K\u00e4rcher expanded into the global market, producing toys, catamarans, and construction formwork before focusing on high-pressure cleaners in 1974.\n\nThat year, the corporate color changed from blue to yellow, and the first international factory was opened in Brazil.\n\nFrom the late 1970s, K\u00e4rcher began cleaning historical monuments worldwide.\n\nIn 1984, it launched its first high-pressure cleaner for home use.\n\nAfter Irene K\u00e4rcher passed away in 1989, management was taken over by the existing executive team.\n\nAlfred and Irene K\u00e4rcher\u2019s descendants remained involved in supervisory roles.\n\nDuring the 1990s, K\u00e4rcher entered the commercial floor-cleaning and municipal equipment sector.\n\nThe company launched household appliances like vacuum cleaners and steam cleaners.\n\nIn 2003, K\u00e4rcher introduced its first fully autonomous consumer cleaner and later expanded into gardening with pumps and watering systems.\n\nBy the end of 2011, K\u00e4rcher acquired the former Pfleiderer factory in Winnenden, nearly doubling its operational space.\n\nIn 2022, K\u00e4rcher released Kira, the first autonomous vacuum and mop for professional use.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "K\u00e4rcher konstantno ula\u017ee u razvoj naprednih tehnologija za \u010di\u0161\u0107enje.\n\nAutomatizovani sistemi i digitalni alati omogu\u0107avaju preciznu kontrolu proizvodnje i efikasno otkrivanje problema.\n\nKompanija razvija pametne ure\u0111aje povezive sa internetom, sa naprednim senzorima i softverskim re\u0161enjima za optimizaciju rada.\n\nInovacije poput smanjenja potro\u0161nje energije, upotrebe naprednih litijum-jonskih baterija i be\u017ei\u010dne tehnologije doprinele su efikasnosti njihovih ure\u0111aja.\n\nK\u00e4rcher \u010dista\u010di pod pritiskom, profesionalni usisiva\u010di i ure\u0111aji za parno \u010di\u0161\u0107enje sve vi\u0161e koriste automatizaciju i IoT tehnologiju.\n\nJedan od ranih uspeha bio je energetski efikasni ure\u0111aj za industrijsko kupanje u slanoj vodi.\n\nPatent za ovu tehnologiju prodat je Siebert GmbH, a do kraja rata prodat je u vi\u0161e od 1.200 primeraka.\n\nU 2024. godini, prema izve\u0161taju WIPO, K\u00e4rcher je bio me\u0111u top 10 kompanija u svetu po broju registrovanih industrijskih dizajna, sa ukupno 189 dizajna prijavljenih tokom 2023. godine.",
          en: "K\u00e4rcher constantly integrates modern technology to improve the efficiency of its cleaning equipment.\n\nAutomated systems allow for precise production control, while digital tools help monitor performance and quickly identify issues.\n\nSmart cleaning devices that can connect to the internet enable remote operation and monitoring.\n\nThe use of advanced sensors and software ensures accurate analysis and predictive maintenance.\n\nEnergy-efficient innovations and optimized resource usage contribute to greater sustainability and productivity.\n\nOne of K\u00e4rcher\u2019s early commercial successes was a salt bath furnace used for hardening and refining light metals.\n\nThe patent was sold to Siebert GmbH, with over 1,200 units sold by 1945.\n\nAccording to WIPO\u2019s 2024 annual report, K\u00e4rcher ranked 10th globally in industrial design with 189 registrations in 2023.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "K\u00e4rcher nudi bogat izbor opreme za \u010di\u0161\u0107enje, uklju\u010duju\u0107i \u010dista\u010de pod pritiskom, industrijske usisiva\u010de, parne \u010dista\u010de i ure\u0111aje za odr\u017eavanje podova i fasada.\n\nNjihovi visokotla\u010dni \u010dista\u010di su klju\u010dni proizvodi, idealni za uklanjanje tvrdokornih prljav\u0161tina sa betona, plo\u010dica, kamena i drugih povr\u0161ina.\n\nAsortiman obuhvata profesionalne usisiva\u010de za suvo i mokro \u010di\u0161\u0107enje, kao i komercijalne modele za fabrike, skladi\u0161ta i kancelarije.\n\nK\u00e4rcher paro\u010dista\u010di koriste paru za dezinfekciju, uklanjaju\u0107i ne\u010disto\u0107e bez hemikalija, \u0161to ih \u010dini idealnim za doma\u0107instva i zdravstvene ustanove.\n\nU ponudi su i sistemi za \u010di\u0161\u0107enje podova velikih povr\u0161ina, kao i specijalizovani ure\u0111aji za pranje prozora i fasada.\n\nKompanija je poznata po kvalitetu i pouzdanosti, \u010dine\u0107i K\u00e4rcher idealnim izborom kako za profesionalce, tako i za privatne korisnike koji tra\u017ee vrhunske aparate za \u010di\u0161\u0107enje.",
          en: "K\u00e4rcher offers an extensive range of cleaning equipment for industrial and commercial use.\n\nTheir catalog includes pressure washers, vacuum cleaners, steam cleaners, and specialized equipment for floor and glass cleaning.\n\nHigh-pressure washers are K\u00e4rcher\u2019s flagship products, using powerful water jets to remove stubborn dirt from concrete, stone, and tiled surfaces.\n\nTheir vacuum cleaners are designed for both household and commercial applications, capable of handling dry, wet, and specific types of waste.\n\nK\u00e4rcher\u2019s steam cleaners disinfect and clean various surfaces without chemicals, making them ideal for homes and healthcare facilities.\n\nIn addition, K\u00e4rcher offers floor cleaning machines for large industrial spaces and specialized tools for cleaning glass surfaces and facades, delivering fast and efficient maintenance solutions.",
        },
      },
    ],
    catalogs: [
      { name: "Karcher profesionalni program katalog", pdfUrl: "https://drive.google.com/file/d/1rCZ63RGygIn4IeTTar4sLetDzc7UUoaJ/view?usp=share" },
      { name: "Karcher \u017euti program katalog", pdfUrl: "https://drive.google.com/file/d/14ERZxuCZexyQZ0rNtbBUXGXKjzZm_x5Q/view?usp=share" },
    ],
    color: "#ECFF44",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/karcher/",
  },
  {
    slug: "wolfcraft",
    name: "Wolfcraft",
    logoSrc: "/logos/wolfcraft-logo.svg",
    description: "Wolfcraft je renomirani proizvo\u0111a\u010d alata i pribora za rad na drvetu i metalu, dizajniranih za dugotrajnu upotrebu i pouzdane rezultate.",
    heroDescription: { sr: "Wolfcraft - Uvoznik za Srbiju", en: "Wolfcraft - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "Kompaniju Wolfcraft osnovao je 1949. godine u Rem\u0161ajdu proizvo\u0111a\u010d alata i tehni\u010dki crta\u010d Robert Wolff.\n\nPrvobitno se bavila proizvodnjom ru\u010dnih bu\u0161ilica, datoteka i pila, namenjenih specijalizovanoj trgovini sa alatom.\n\nGodine 1961. Wolfcraft je po\u010deo da nudi alate za DIY segment.\n\nPrvi alati za uradi sam korisnike predstavljeni su pod brendom Wolfcraft.\n\nSedi\u0161te kompanije preme\u0161teno je 1965. iz Rem\u0161ajda u Vajbern, u regionu Ajfel.\n\nU 1969. godini po\u010dela je proizvodnja ru\u010dnih glodalica, \u010dime je zapo\u010det razvoj ure\u0111aja i alata u toj kategoriji.\n\nCentralni skladi\u0161ni objekat u Kempenihu po\u010deo je sa radom 1976. godine.\n\nOva logisti\u010dka ta\u010dka imala je va\u017enu ulogu u distribuciji alata.\n\nGodine 1977. Wolfcraft ulazi na ameri\u010dko tr\u017ei\u0161te otvaranjem prodajnog ureda u \u010cikagu.\n\nTe godine Robert Wolff dobija Rudolf Diesel Srebrnu medalju.\n\nTokom narednih godina otvaraju se filijale u Francuskoj, Velikoj Britaniji, Italiji i Slova\u010dkoj.\n\nNovi logisti\u010dki centar za Evropu otvoren je u Kempenihu dve godine kasnije.\n\nSedi\u0161te kompanije sa novom administrativnom zgradom preme\u0161teno je u Kempenih 1995. godine.\n\nU 2008. godini predstavljene su kompletne DIY linije proizvoda sa grupama za laminat i suvu gradnju.\n\nGodine 2017. Wolfcraft je dobio \u201eNema\u010dku nagradu za brend 2017\u201c od Nema\u010dkog savetodavnog tela za dizajn.\n\nRobert Wolff sala u Vajbernu nosi ime po osniva\u010du, koji je progla\u0161en i po\u010dasnim gra\u0111aninom op\u0161tine Kempenih.",
          en: "The Wolfcraft company was founded in 1949 in Remscheid by toolmaker and technical draftsman Robert Wolff.\n\nInitially, it manufactured hand drills, files, and saws for specialized tool trade.\n\nIn 1961, Wolfcraft started offering tools for the DIY segment.\n\nThe first DIY tools were introduced under the Wolfcraft brand.\n\nIn 1965, the company moved its headquarters from Remscheid to Weibern, in the Eifel region.\n\nIn 1969, it began manufacturing hand routers, marking the start of device and tool development in that area.\n\nIn 1976, the central warehouse in Kempenich became operational.\n\nThis logistics point played an important role in tool distribution.\n\nIn 1977, Wolfcraft entered the U.S. market by opening a sales office in Chicago.\n\nThat year, Robert Wolff received the Rudolf Diesel Silver Medal.\n\nOver the following years, branches were opened in France, the UK, Italy, and Slovakia.\n\nA new logistics center for Europe was opened in Kempenich two years later.\n\nThe company's headquarters and new administrative building were relocated to Kempenich in 1995.\n\nIn 2008, complete DIY product lines were introduced, with groups for laminate and drywall.\n\nIn 2017, Wolfcraft received the \u201cGerman Brand Award 2017\u201d from the German Design Council.\n\nThe Robert Wolff Hall in Weibern was named after the founder, who was also named honorary citizen of the municipality of Kempenich.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Inovacija je deo svakog Wolfcraft proizvoda.\n\nKompanija ula\u017ee u istra\u017eivanje i razvoj, sa ciljem da alati koje nudi unaprede radne procese.\n\nSvaki alat prolazi kroz proces in\u017eenjeringa i testiranja.\n\nAlati su prilago\u0111eni zahtevima korisnika i projektovani da zadovolje funkcionalnost.\n\nWolfcraft alati izra\u0111uju se od materijala koji su u skladu sa industrijskim standardima.\n\nProizvodni procesi omogu\u0107avaju da alati budu pogodni za \u010destu upotrebu i primenu u razli\u010ditim uslovima.",
          en: "Innovation is part of every Wolfcraft product.\n\nThe company invests in research and development to ensure its tools improve work processes.\n\nEach tool goes through engineering and testing processes.\n\nTools are designed to meet user needs and functional requirements.\n\nWolfcraft tools are made of materials that comply with industry standards.\n\nThe manufacturing process allows the tools to be suitable for frequent use and application in various conditions.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "Od 2023. godine, Wolfcraft u svojoj ponudi ima oko 3.000 proizvoda.\n\nAsortiman obuhvata alate i dodatke koji se koriste u radionici, na gradili\u0161tu i u ku\u0107nim uslovima.\n\nU ponudi su ru\u010dni alati i dodaci za elektri\u010dne alate.\n\nWolfcraft radioni\u010dki alati uklju\u010duju stege, \u0161ablone, uglomere i vinkel.\n\nOvi alati su prisutni u stolarskim radionicama i deo su redovne upotrebe.\n\nAlati su razvijeni za razli\u010dite namene u okviru tehni\u010dkih i prakti\u010dnih poslova.",
          en: "As of 2023, Wolfcraft offers around 3,000 products.\n\nThe range includes tools and accessories used in workshops, on construction sites, and at home.\n\nThe offering includes hand tools and accessories for power tools.\n\nWolfcraft workshop tools include clamps, templates, angle rulers, and squares.\n\nThese tools are commonly used in woodworking shops and are part of daily operations.\n\nThe tools are developed for various technical and practical applications.",
        },
      },
    ],
    catalogs: [
      { name: "Wolfcraft katalog", pdfUrl: "https://drive.google.com/file/d/1SU0y0Lr9TvJqvX0t20R44H6HxHLiWaZJ/view?usp=share" },
    ],
    color: "#53FF6C",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/wolfcraft/",
  },
  {
    slug: "kwb",
    name: "Kwb",
    logoSrc: "/logos/kwb-logo.svg",
    description: "Kwb je proizvo\u0111a\u010d alata i pribora za rad na drvetu i metalu. Sa dugogodi\u0161njim iskustvom, KWB alati su priznat simbol kvaliteta i preciznosti.",
    heroDescription: { sr: "KWB - Uvoznik za Srbiju", en: "KWB - Importer for Serbia" },
    paragraphs: [
      {
        title: { sr: "Istorijat", en: "History" },
        body: {
          sr: "KWB Germany GmbH je me\u0111unarodno prisutan brend koji se isti\u010de kao nezavisan sistemski stru\u010dnjak za pribor za elektri\u010dne alate i ru\u010dne alate. Kompanija sa sedi\u0161tem u Nema\u010dkoj razvija i distribuira \u0161irok spektar KWB alata i pribora za profesionalnu i hobi upotrebu.\n\nSa vi\u0161e od 90 godina iskustva u industriji alata, KWB Germany GmbH se isti\u010de po doslednim standardima kvaliteta i inovativnom pristupu. Vi\u0161e od 200 zaposlenih doprinosi razvoju KWB proizvoda koji se plasiraju u 90 zemalja \u0161irom sveta. Brend KWB predstavlja pouzdanog partnera za prodavnice alata, specijalizovane trgovce i online prodavce.",
          en: "KWB Germany GmbH is an internationally active brand recognized as an independent systems specialist for power tool accessories and hand tools. Headquartered in Germany, the company develops and distributes a broad range of KWB tools and accessories for both professional and DIY users.\n\nWith over 90 years of experience in the tool industry, KWB Germany GmbH is known for its consistent quality standards and innovative approach. With more than 200 employees, the company offers KWB products in over 90 countries, serving as a reliable partner for hardware stores, specialty retailers, and online tool sellers.",
        },
      },
      {
        title: { sr: "Tehnologije i inovacije", en: "Technologies and innovations" },
        body: {
          sr: "Kompanija KWB neprekidno ula\u017ee u istra\u017eivanje i razvoj, sa ciljem da unapredi postoje\u0107i asortiman alata i uvede nove tehnologije koje olak\u0161avaju upotrebu i unapre\u0111uju rezultate rada. Inovacije su prisutne u svakom KWB alatu i priboru, omogu\u0107avaju\u0107i korisnicima moderna re\u0161enja za najrazli\u010ditije zadatke.\n\nKWB alati i pribor dizajnirani su sa fokusom na prakti\u010dnost i efikasnost. Svaki proizvod je razvijen tako da unapredi radne procese, smanji fizi\u010dki napor i pobolj\u0161a produktivnost. Ergonomski dizajn, jednostavnost kori\u0161\u0107enja i dug vek trajanja izdvajaju KWB proizvode na tr\u017ei\u0161tu alata i pribora za elektri\u010dne alate i radioni\u010dke alate.",
          en: "KWB continuously invests in research and development to improve its current tool range and introduce new technologies that enhance ease of use and work results. Innovation is present in every KWB tool and accessory, offering modern solutions to a variety of challenges.\n\nThe KWB tools and accessories are designed with a focus on practicality and efficiency. Each product is engineered to optimize workflows, reduce effort, and improve productivity. Ergonomic design, ease of use, and durability make KWB products stand out in the market of power tool accessories and workshop tools.",
        },
      },
      {
        title: { sr: "Asortiman proizvoda", en: "Product range" },
        body: {
          sr: "KWB nudi \u0161irok i raznovrstan asortiman proizvoda koji obuhvata sve \u0161to je potrebno za se\u010denje, bu\u0161enje, bru\u0161enje, kao i veliki izbor radioni\u010dkih alata koji olak\u0161avaju svakodnevne zadatke u radionici, na gradili\u0161tu ili kod ku\u0107e.\n\nNjihova ponuda uklju\u010duje pribor za elektri\u010dne alate, kao i ru\u010dne alate, razvijene s ciljem da optimizuju rad i unaprede krajnji rezultat. Vi\u0161e od 5.500 proizvoda u KWB katalogu uklju\u010duje i patentirane proizvode, \u010dime se dodatno potvr\u0111uje fokus na inovacije i razvoj proizvoda.\n\nKontinuirano unapre\u0111enje ponude omogu\u0107ava KWB Germany GmbH da bude konkurentna na dinami\u010dnom tr\u017ei\u0161tu alata i pribora za elektri\u010dne alate, uz stalno osve\u017eavanje programa i razvoj novih re\u0161enja.",
          en: "KWB provides a broad and diverse product range that covers all needs for cutting, drilling, grinding, and a wide selection of workshop tools that simplify daily tasks in the workshop, on the job site, or at home.\n\nTheir portfolio includes power tool accessories as well as hand tools, all developed to enhance performance and achieve better results. With more than 5,500 products, the KWB product offering includes patented innovations, showcasing the company\u2019s dedication to product development.\n\nOngoing improvement of the product line allows KWB Germany GmbH to remain competitive in the fast-moving tool and power tool accessory market, with regular updates and new solutions.",
        },
      },
    ],
    catalogs: [
      { name: "KWB AKKU TOP pribor za aku alate", pdfUrl: "https://drive.google.com/file/d/14yFw6dV6jnzqwOksY9_AECaI6wX3K8te/view?usp=share" },
      { name: "KWB dodaci za ma\u0161ine katalog", pdfUrl: "https://drive.google.com/file/d/1CpjLO7fBAU_twmPZy5KfHNJk27BG0MhV/view?usp=share" },
      { name: "KWB pribor", pdfUrl: "https://drive.google.com/file/d/1E06fPvQOqKfLGxCzWH-nh_GQYfK2XtOz/view?usp=share" },
    ],
    color: "#C8C8C8",
    storeUrl: "https://www.prodavnicaalata.rs/proizvodjaci/kwb/",
  },
];

export const getBrandBySlug = (slug: string): Brand | undefined =>
  BRANDS.find((b) => b.slug === slug);
