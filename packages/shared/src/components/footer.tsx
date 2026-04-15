import { getBrandConfig } from "@brand/config";
import { Facebook, Instagram, Mail, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Container from "./container";
import Glow from "./glow";
import NewsletterForm from "./newsletter/newsletter-form";
import Wrapper from "./wrapper";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
} as const;

export interface FooterNavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSocialLink {
  name: string;
  href: string;
  icon: keyof typeof socialIcons;
}

function FooterLinkColumn({
  title,
  links,
  animation,
  delay,
}: {
  title: string;
  links: readonly FooterNavLink[];
  animation: "fadeUp" | "fadeLeft" | "fadeRight";
  delay: number;
}) {
  return (
    <Container animation={animation} delay={delay}>
      <div>
        <h3 className="text-base font-medium">{title}</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {links.map((link) => (
            <li key={link.href + link.label}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                  <span className="ml-1 text-xs">&#8599;</span>
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

interface FooterProps {
  productLinks: readonly FooterNavLink[];
  companyLinks: readonly FooterNavLink[];
  legalLinks: readonly FooterNavLink[];
  socialLinks: readonly FooterSocialLink[];
}

const Footer = ({
  productLinks,
  companyLinks,
  legalLinks,
  socialLinks,
}: FooterProps) => {
  const { logoSrc, logoAlt, siteName, footerTagline, footerGradientEdge } =
    getBrandConfig();
  const year = process.env.BUILD_YEAR;

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
          ></div>
        </Container>

        {/* Newsletter */}
        <Container animation="fadeUp" delay={0.4}>
          <div>
            <h3 className="text-base font-medium">Newsletter</h3>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">
              Budi u toku sa novostima i akcijama.
            </p>
            <div className="max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </Container>

        <div className="mt-10 border-t border-border/80 pt-8 grid gap-10 grid-cols-2 md:grid-cols-3 xl:gap-8">
          {/* Brand column */}
          <Container
            animation="fadeLeft"
            delay={0.5}
            className="col-span-2 md:col-span-1"
          >
            <div className="flex flex-col items-start justify-start">
              <div className="flex items-center gap-2">
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={32}
                  height={32}
                  className="w-24 h-8"
                />
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                {footerTagline}
              </p>
              <div className="mt-4 text-sm text-muted-foreground px-4 py-2 cursor-pointer rounded-full border border-border/40 bg-foreground/5 hover:bg-foreground/10 transition-colors duration-300">
                <a
                  href="mailto:office@stridon.rs"
                  className="flex items-center gap-2"
                >
                  <Mail className="size-4" />
                  <p>office@stridon.rs</p>
                </a>
              </div>
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.icon];
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon className="size-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </Container>

          {/* Link columns */}
          <FooterLinkColumn
            title="Proizvodi"
            links={productLinks}
            animation="fadeUp"
            delay={0.6}
          />
          <FooterLinkColumn
            title="Kompanija"
            links={companyLinks}
            animation="fadeUp"
            delay={0.7}
          />
        </div>

        {/* Copyright bar */}
        <Container animation="fadeUp" delay={0.9}>
          <div className="mt-10 border-t border-border/80 py-8 flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <p>{`\u00A9 ${year} ${siteName}`}</p>
            <span className="hidden md:inline">&middot;</span>
            <div className="flex items-center gap-2">
              {legalLinks.map((link, index) => (
                <span key={link.href} className="flex items-center gap-2">
                  {index > 0 && <span>&middot;</span>}
                  <Link
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Wrapper>
    </footer>
  );
};

export default Footer;
