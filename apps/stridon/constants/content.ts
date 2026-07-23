import type { TrustBadge } from "@brand/shared/components/cta";
import {
  Award,
  BadgePercent,
  Factory,
  Globe,
  Layers,
  MapPin,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

export const FEATURES = [
  {
    title: "Zvanični uvoz",
    desc: "Originalni proizvodi sa punom garancijom i tehničkom podrškom, direktno od proizvođača.",
    icon: ShieldCheck,
  },
  {
    title: "Preko 30 brendova",
    desc: "DeWalt, Bosch, Stanley, Makita, Knipex i još desetine svetskih brendova na jednom mestu.",
    icon: Layers,
  },
  {
    title: "Veleprodaja i B2B",
    desc: "Veleprodajne cene, posebni uslovi i podrška za dilere širom Srbije.",
    icon: BadgePercent,
  },
  {
    title: "Brza isporuka",
    desc: "Isporuka za 1 do 5 radnih dana, uz besplatnu dostavu preko 15.000 RSD.",
    icon: Truck,
  },
];

export const CTA_TRUST_BADGES: TrustBadge[] = [
  { icon: ShieldCheck, text: "Zvanični uvoz" },
  { icon: Award, text: "Originalni proizvodi" },
  { icon: Layers, text: "30+ brendova" },
  { icon: Truck, text: "Brza isporuka" },
];

export const STATS = [
  { value: "10.630+", label: "Veleprodajnih kupaca" },
  { value: "120+", label: "Dilera u Srbiji" },
  { value: "30+", label: "Zastupanih brendova" },
  { value: "2", label: "Lokacije u Beogradu" },
];

export const ABOUT_MILESTONES = [
  {
    title: "Dongcheng od 1995.",
    description:
      "DCK je profesionalni brend kompanije Jiangsu Dongcheng Power Tools, osnovane 1995. sa vizijom da kvalitet ne mora da bude skup.",
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    image: {
      src: "/about/dck-sponsored-driver.webp",
      alt: "DCK sponsored driver holding tools",
    },
  },
  {
    title: "Sopstvena proizvodnja od A do Š",
    description:
      "Motori, baterije i elektronika se proizvode u sopstvenim fabrikama - vertikalna integracija koja garantuje kontrolu kvaliteta na svakom koraku.",
    icon: Factory,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    image: {
      src: "/about/dck-product-demo-event.webp",
      alt: "DCK product demo event",
    },
  },
  {
    title: "390.000 m² kapaciteta",
    description:
      "Dongcheng raspolaže sa preko 390.000 m² proizvodnog i poslovnog prostora, sa 5.500+ zaposlenih i automatizovanim proizvodnim linijama.",
    icon: Globe,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    image: {
      src: "/about/dck-trade-show-booth.webp",
      alt: "DCK trade show booth",
    },
  },
  {
    title: "Zvanična distribucija u Srbiji",
    description:
      "Stridon Group je glavni zastupnik za teritoriju Srbije sa punom garancijom od 3 godine, ovlašćenim servisom i tehničkom podrškom.",
    icon: MapPin,
    color: "text-rose-400",
    bg: "bg-rose-500/15",
    border: "border-rose-500/30",
    image: {
      src: "/about/sgtools_i_dck_tim.jpg",
      alt: "Tim SG TOOLS i DCK",
    },
  },
];

export const COMPANY_BENEFITS = [
  {
    title: "Garancija i servis",
    description:
      "Mreža ovlašćenih servisera, dostupnost rezervnih delova i tehnička podrška na srpskom - sve što treba da alat ne stoji dok čeka popravku.",
  },
  {
    title: "Brushless aku program",
    description:
      "Brushless motori znače duži rad po punjenju, manje održavanja i manji broj komponenti koje se troše - zato je ceo DCK aku program bez četkica.",
  },
  {
    title: "Sopstvena proizvodnja",
    description:
      "Kad isti proizvođač pravi motor, bateriju i elektroniku, nema posrednika koji usložnjavaju cenu - ušteda se direktno prenosi na krajnju cenu alata.",
  },
  {
    title: "Prisutan u 100+ zemalja",
    description:
      "Preko 5.500 zaposlenih, 390.000 m² proizvodnog prostora i distribucija u više od 100 zemalja - obim koji garantuje stabilnost i kontinuitet.",
  },
];

export const HOME_ABOUT_PARAGRAPH =
  "DCK je profesionalni brend nastao sa jasnom idejom - da vrhunski kvalitet i pristupačna cena mogu ići zajedno. Iza svakog alata stoji kompanija sa skoro tri decenije iskustva i sopstvenom proizvodnjom motora, baterija i elektronike. Kompletan bežični program je brushless, bez kompromisa - jer tvoj alat treba da radi jednako dobro kao i najskuplji na tržištu, samo bez preterane cene.";

export const ABOUT_PARAGRAPHS = [
  "DCK nije nastao kao još jedan brend u moru alata. Nastao je iz uverenja da profesionalci, majstori i hobisti zaslužuju alat koji radi posao bez izgovora - i bez preterane cene. Kompanija Jiangsu Dongcheng Power Tools, osnovana 1995. godine, taj princip živi od prvog dana. Sa preko 5.500 zaposlenih, 390.000 m² proizvodnog prostora i prisustvom u više od 100 zemalja, Dongcheng nije mali igrač koji pokušava da se probije - to je proizvođač koji kontroliše svaki korak, od sirovine do gotovog alata.",
  "Ono što DCK izdvaja nije samo cena. Kompletan bežični program koristi isključivo brushless motore - nema četkica, nema kompromisa. Motori i baterije se proizvode u sopstvenim fabrikama, a kvalitet se proverava u ISO i CE sertifikovanim laboratorijama sa automatizovanim linijama. U Srbiji, Stridon Group je zvanični distributer sa punom garancijom od 3 godine, servisom i tehničkom podrškom. Jednostavno - DCK ti daje alat profesionalnog nivoa, po ceni koja ima smisla za svakodnevni rad.",
];
