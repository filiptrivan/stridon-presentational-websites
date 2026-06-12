import { getBrandConfig } from "@brand/config";
import Container from "@brand/shared/components/container";
import Glow from "@brand/shared/components/glow";
import Wrapper from "@brand/shared/components/wrapper";
import { Youtube, Instagram, Facebook } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const { siteName, footerGradientEdge } = getBrandConfig();

const Footer = async () => {
  const year = process.env.BUILD_YEAR ?? new Date().getFullYear().toString();
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");

  const INFORMATION_LINKS = [
    { label: tNav("home"), href: "/" },
    { label: tNav("about"), href: "/o-nama" },
    { label: tNav("contact"), href: "/kontakt" },
  ];

  const COMPANY_LINKS = [
    { label: tNav("brands"), href: "/brendovi" },
    { label: tNav("b2b"), href: "/b2b" },
    { label: tNav("catalogs"), href: "/katalozi" },
    { label: tNav("service"), href: "/servis" },
  ];

  const CALL_CENTER_ITEMS = [
    { label: "office@stridon.rs", href: "mailto:office@stridon.rs", isLink: true },
    { label: t("altina"), href: "", isLink: false },
    { label: "011/210-0230", href: "tel:0112100230", isLink: true },
    { label: t("vojislava"), href: "", isLink: false },
    { label: "011/2886-509", href: "tel:0112886509", isLink: true },
  ];

  const WORKING_HOURS = [
    t("hoursWeekdays"),
    t("hoursSaturday"),
    t("hoursSunday"),
  ];

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

        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 xl:gap-8">
          {/* Call center */}
          <Container animation="fadeUp" delay={0.4}>
            <div>
              <h3 className="text-sm font-semibold mb-4">{t("callCenter")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {CALL_CENTER_ITEMS.map((item, i) =>
                  item.isLink ? (
                    <li key={i}>
                      <a href={item.href} className="hover:text-primary transition-colors">
                        {item.label}
                      </a>
                    </li>
                  ) : (
                    <li key={i} className="font-medium text-foreground pt-1">
                      {item.label}
                    </li>
                  )
                )}
              </ul>
            </div>
          </Container>

          {/* Working hours */}
          <Container animation="fadeUp" delay={0.5}>
            <div>
              <h3 className="text-sm font-semibold mb-4">{t("workingHours")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {WORKING_HOURS.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </Container>

          {/* Information */}
          <Container animation="fadeUp" delay={0.6}>
            <div>
              <h3 className="text-sm font-semibold mb-4">{t("information")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {INFORMATION_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>

          {/* Company */}
          <Container animation="fadeUp" delay={0.7}>
            <div>
              <h3 className="text-sm font-semibold mb-4">{t("company")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </div>

        {/* Bottom bar */}
        <Container animation="fadeUp" delay={0.8}>
          <div className="mt-10 border-t border-border/80 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>{`© ${year} ${t("rights")} ${siteName}.`}</p>

            <div className="flex items-center gap-4">
              <Link href="/podaci-za-identifikaciju" className="hover:text-primary transition-colors">
                {t("identificationData")}
              </Link>
              <span className="text-border">·</span>
              <Link href="/politika-privatnosti" className="hover:text-primary transition-colors">
                {t("privacy")}
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/stridongroup"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-full bg-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="https://www.instagram.com/stridongroup/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full bg-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://www.youtube.com/@prodavnicaalata5203"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2 rounded-full bg-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="size-4" />
              </a>
            </div>
          </div>
        </Container>
      </Wrapper>
    </footer>
  );
};

export default Footer;
