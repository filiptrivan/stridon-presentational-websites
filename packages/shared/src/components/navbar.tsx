"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@brand/ui/navigation-menu";
import { Button } from "@brand/ui/button";
import { cn } from "../lib/utils";
import type { Category } from "../types/categories";
import { getBrandConfig } from "@brand/config";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Container from "./container";
import MobileMenu, {
  type MobileMenuLabels,
  type NavbarLink,
} from "./mobile-menu";
import Wrapper from "./wrapper";

const {
  logoSrc,
  logoAlt,
  logoWidth,
  logoHeight,
  navbarLogoHeight,
  headerCta,
} = getBrandConfig();

const DEFAULT_LABELS = {
  allCategories: "Sve kategorije",
  headerCta: undefined as string | undefined,
};

export type NavbarLabels = Partial<typeof DEFAULT_LABELS>;

interface NavbarProps {
  categories: Category[];
  navLinks: readonly NavbarLink[];
  /** Rendered next to the header CTA. A translated site passes its own switch
      so this package needs no routing library of its own; the two
      single-language sites pass nothing and the slot disappears. */
  languageSwitch?: ReactNode;
  labels?: NavbarLabels;
  mobileLabels?: MobileMenuLabels;
  /** A localized site passes the localized path; brand-config cannot. */
  headerCtaHref?: string;
  /** Where the logo links. Localized sites pass their own home path. */
  homeHref?: string;
}

const Navbar = ({
  categories,
  navLinks,
  languageSwitch,
  labels,
  mobileLabels,
  headerCtaHref,
  homeHref = "/",
}: NavbarProps) => {
  const router = useRouter();
  const t = { ...DEFAULT_LABELS, ...labels };
  const ctaHref = headerCtaHref ?? headerCta.href;

  // The right-hand cluster only gets crowded on a phone when a language switch
  // sits beside the burger, which is the translated site and nothing else.
  // Deriving it from the slot rather than taking a flag is what keeps dck and
  // sg-tools rendering byte-identically to what they shipped before this app
  // existed: they pass no switch, so they take neither class.
  const tightMobile = Boolean(languageSwitch);
  const ctaLabel = t.headerCta ?? headerCta.label;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 w-full h-16 transition-all duration-300 backdrop-blur-md border-b border-border",
      )}
    >
      <Wrapper className="grid grid-cols-2 md:grid-cols-3 items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link href={homeHref} className="inline-flex items-center gap-2">
            <Image
              src={logoSrc}
              className={cn("w-auto", navbarLogoHeight)}
              alt={logoAlt}
              // Falls back to the pair this was hardcoded to, so a brand that
              // declares no logo dimensions renders exactly as before.
              width={logoWidth ?? 100}
              height={logoHeight ?? 20}
            />
          </Link>
        </motion.div>

        <div className="hidden md:flex justify-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-x-1 flex-nowrap">
              <AnimatePresence>
                {navLinks.map((link, index) => (
                  <Container
                    key={index}
                    animation="fadeDown"
                    delay={0.1 * index}
                  >
                    <NavigationMenuItem>
                      {link.href === "/proizvodi/kategorije" ? (
                        <>
                          <NavigationMenuTrigger
                            className="text-sm font-medium cursor-pointer"
                            onClick={() => {
                              router.push("/proizvodi/kategorije");
                            }}
                          >
                            {link.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="min-w-[420px]">
                            <ul className="grid grid-cols-2 gap-0.5 p-1">
                              {categories.slice(0, 4).map((cat) => (
                                <li key={cat.slug}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={`/proizvodi/kategorije/${cat.slug}`}
                                      className="flex select-none rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                      {cat.name}
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                            <div className="border-t border-border mx-1 mb-1">
                              <NavigationMenuLink asChild>
                                <Link
                                  href="/proizvodi/kategorije"
                                  className="flex select-none rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                  {t.allCategories}
                                </Link>
                              </NavigationMenuLink>
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.href}
                            className="hover:text-foreground transition-all duration-500 px-1.5 text-sm font-medium text-muted-foreground whitespace-nowrap"
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  </Container>
                ))}
              </AnimatePresence>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div
          className={cn(
            "flex items-center justify-end",
            tightMobile ? "gap-x-2 md:gap-x-4" : "gap-x-4",
          )}
        >
          <Container animation="fadeLeft" delay={0.1}>
            <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
              {headerCta.external ? (
                <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                  {ctaLabel}
                  <ExternalLinkIcon className="size-3.5" />
                </a>
              ) : (
                <Link href={ctaHref}>{ctaLabel}</Link>
              )}
            </Button>
          </Container>
          {languageSwitch ? (
            <Container animation="fadeLeft" delay={0.15}>
              {languageSwitch}
            </Container>
          ) : null}
          <div className={cn("md:hidden", tightMobile && "-mr-1.5 md:mr-0")}>
            <Container animation="fadeLeft" delay={0.1}>
              <MobileMenu
                categories={categories}
                navLinks={navLinks}
                labels={mobileLabels}
                headerCtaHref={headerCtaHref}
              />
            </Container>
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export default Navbar;
