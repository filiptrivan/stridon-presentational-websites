import { getBrandConfig } from "@brand/config";
import Container from "@brand/shared/components/container";
import Glow from "@brand/shared/components/glow";
import Wrapper from "@brand/shared/components/wrapper";
import { Mail, Instagram, Facebook } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FOOTER_LINKS, STORE_URL } from "@/constants/links";

const { logoSrc, logoAlt, siteName, footerTagline, footerGradientEdge } =
  getBrandConfig();

const COMPANY_LINKS = [
  { label: "O nama", href: "/o-nama" },
  { label: "Brendovi", href: "/brendovi" },
  { label: "Katalozi", href: "/katalozi" },
  { label: "Servis", href: "/servis" },
  { label: "B2B", href: "/b2b" },
  { label: "Kontakt", href: "/kontakt" },
];

const STORE_LINKS = [
  { label: "Online prodavnica", href: STORE_URL, external: true },
  { label: "DeWalt alati", href: `${STORE_URL}/proizvodjaci/dewalt/`, external: true },
  { label: "Bosch alati", href: `${STORE_URL}/proizvodjaci/bosch/`, external: true },
  { label: "Stanley alati", href: `${STORE_URL}/proizvodjaci/stanley/`, external: true },
];

const Footer = () => {
  const year = process.env.BUILD_YEAR ?? new Date().getFullYear().toString();

  return (
    <footer className="relative pt-16 w-full overflow-hidden">
      <Glow />
      <Wrapper>
        <Container animation="scaleUp" delay={0.3}>
          <div
            className="absolute top-0 w-4/5 mx-auto inset-x-0 h-px"
            style={{
              backgroundImage: `linear-gradient(to right, ${footerGradientEdge}, oklch(from var(--primary) l c h / 40%), ${footerGradientEdge})`,
            }}
          />
        </Container>

        <div className="pt-8 grid gap-10 grid-cols-2 md:grid-cols-4 xl:gap-8">
          {/* Brand column */}
          <Container animation="fadeLeft" delay={0.4} className="col-span-2 md:col-span-1">
            <div className="flex flex-col items-start">
              <Image src={logoSrc} alt={logoAlt} width={120} height={32} className="h-8 w-auto" />
              <p className="text-muted-foreground mt-4 text-sm">{footerTagline}</p>
              <a
                href="mailto:office@stridon.rs"
                className="mt-4 text-sm text-muted-foreground px-4 py-2 rounded-full border border-border/40 bg-foreground/5 hover:bg-foreground/10 transition-colors flex items-center gap-2"
              >
                <Mail className="size-4" />
                office@stridon.rs
              </a>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://www.instagram.com/stridongroup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram className="size-5" />
                </a>
                <a
                  href="https://www.facebook.com/stridongroup"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Facebook className="size-5" />
                </a>
              </div>
            </div>
          </Container>

          {/* Company links */}
          <Container animation="fadeUp" delay={0.5}>
            <div>
              <h3 className="text-base font-medium">Kompanija</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>

          {/* Store links */}
          <Container animation="fadeUp" delay={0.6}>
            <div>
              <h3 className="text-base font-medium">Prodavnica</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {STORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label}
                      <span className="ml-1 text-xs">&#8599;</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Container>

          {/* Contact info */}
          <Container animation="fadeUp" delay={0.7}>
            <div>
              <h3 className="text-base font-medium">Kontakt</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Borivoja Stevanovića, Beograd</li>
                <li>Vojislava Ilića 141g, Beograd</li>
                <li>Ugrinovačka 212 (Altina)</li>
                <li className="pt-1">
                  <a href="tel:+38111000000" className="hover:text-foreground transition-colors">
                    +381 11 000 0000
                  </a>
                </li>
              </ul>
            </div>
          </Container>
        </div>

        {/* Copyright */}
        <Container animation="fadeUp" delay={0.8}>
          <div className="mt-10 border-t border-border/80 py-8 flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <p>{`© ${year} ${siteName}`}</p>
            <span className="hidden md:inline">&middot;</span>
            <p>Sva prava zadržana.</p>
          </div>
        </Container>
      </Wrapper>
    </footer>
  );
};

export default Footer;
