"use client";

import { getBrandConfig } from "@brand/config";
import { Button } from "@brand/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@brand/ui/sheet";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { cn } from "@brand/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLinkIcon, MenuIcon } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";

const { logoSrc, logoAlt, navbarLogoHeight, headerCta } = getBrandConfig();

const NAV_KEYS = ["home", "brands", "catalogs", "service", "b2b", "contact"] as const;
const NAV_HREFS: Record<string, string> = {
  home: "/",
  brands: "/brendovi",
  catalogs: "/katalozi",
  service: "/servis",
  b2b: "/b2b",
  contact: "/kontakt",
};

function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <Link
        href={pathname}
        locale="sr"
        className={cn(
          "px-1.5 py-0.5 rounded transition-colors",
          locale === "sr"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        SR
      </Link>
      <span className="text-border">|</span>
      <Link
        href={pathname}
        locale="en"
        className={cn(
          "px-1.5 py-0.5 rounded transition-colors",
          locale === "en"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </Link>
    </div>
  );
}

const Navbar = () => {
  const t = useTranslations("Nav");

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full h-16 backdrop-blur-md border-b border-border transition-all duration-300">
      <Wrapper className="grid grid-cols-2 md:grid-cols-3 items-center h-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/" className="inline-flex items-center">
            <Image
              src={logoSrc}
              className={cn("w-max", navbarLogoHeight)}
              alt={logoAlt}
              width={120}
              height={28}
            />
          </Link>
        </motion.div>

        {/* Desktop nav */}
        <nav className="hidden md:flex justify-center items-center gap-x-1">
          <AnimatePresence>
            {NAV_KEYS.map((key, index) => (
              <Container key={key} animation="fadeDown" delay={0.05 * index}>
                <Link
                  href={NAV_HREFS[key]}
                  className="px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {t(key)}
                </Link>
              </Container>
            ))}
          </AnimatePresence>
        </nav>

        {/* Right side */}
        <div className="flex items-center justify-end gap-x-3">
          <Container animation="fadeLeft" delay={0.1} className="hidden md:flex items-center gap-x-3">
            <LanguageToggle />
            <Button asChild size="sm" variant="outline">
              <a href={headerCta.href} target="_blank" rel="noopener noreferrer">
                {t("store")}
                <ExternalLinkIcon className="size-3.5" />
              </a>
            </Button>
          </Container>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MenuIcon className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-4">
                <SheetHeader className="sr-only">
                  <SheetTitle>Meni</SheetTitle>
                  <SheetDescription>Navigacija kroz stranice.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-8">
                  {NAV_KEYS.map((key) => (
                    <SheetClose asChild key={key}>
                      <Link
                        href={NAV_HREFS[key]}
                        className="text-lg font-medium w-full py-2"
                      >
                        {t(key)}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <LanguageToggle />
                    <SheetClose asChild>
                      <Button asChild variant="outline" size="sm">
                        <a href={headerCta.href} target="_blank" rel="noopener noreferrer">
                          {t("store")}
                          <ExternalLinkIcon className="size-3.5" />
                        </a>
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export default Navbar;
