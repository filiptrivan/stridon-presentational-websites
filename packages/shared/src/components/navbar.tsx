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
import Container from "./container";
import MobileMenu, { type NavbarLink } from "./mobile-menu";
import Wrapper from "./wrapper";

const { logoSrc, logoAlt, navbarLogoHeight, headerCta } = getBrandConfig();

interface NavbarProps {
  categories: Category[];
  navLinks: readonly NavbarLink[];
  /** Opt-in language switch (SR is the default locale, the link points at /en). */
  showLanguageSwitch?: boolean;
}

const Navbar = ({
  categories,
  navLinks,
  showLanguageSwitch = false,
}: NavbarProps) => {
  const router = useRouter();

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
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src={logoSrc}
              className={cn("w-auto", navbarLogoHeight)}
              alt={logoAlt}
              width={100}
              height={20}
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
                                  Sve kategorije
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

        <div className="flex items-center justify-end gap-x-2 md:gap-x-4">
          <Container animation="fadeLeft" delay={0.1}>
            <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
              {headerCta.external ? (
                <a href={headerCta.href} target="_blank" rel="noopener noreferrer">
                  {headerCta.label}
                  <ExternalLinkIcon className="size-3.5" />
                </a>
              ) : (
                <Link href={headerCta.href}>{headerCta.label}</Link>
              )}
            </Button>
          </Container>
          {showLanguageSwitch && (
            <Container animation="fadeLeft" delay={0.15}>
              <Link
                href="/en"
                hrefLang="en"
                aria-label="Switch to English"
                className="flex items-center justify-center rounded-md p-1 transition-colors hover:bg-accent"
              >
                <span className="flex h-6 w-7 items-center justify-center">
                  <UnionJack />
                </span>
              </Link>
            </Container>
          )}
          <div className="-mr-1.5 md:mr-0 md:hidden">
            <Container animation="fadeLeft" delay={0.1}>
              <MobileMenu categories={categories} navLinks={navLinks} />
            </Container>
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

const UnionJack = () => (
  <svg
    viewBox="0 0 60 30"
    aria-hidden
    className="h-3.5 w-7 shrink-0"
  >
    <clipPath id="union-jack-clip">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#00247d" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path
      d="M0,0 L60,30 M60,0 L0,30"
      clipPath="url(#union-jack-clip)"
      stroke="#cf142b"
      strokeWidth="4"
    />
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6" />
  </svg>
);

export default Navbar;
