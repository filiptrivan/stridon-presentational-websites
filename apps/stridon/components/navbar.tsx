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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@brand/ui/navigation-menu";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { cn } from "@brand/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon } from "lucide-react";
import { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { BRANDS } from "@/constants/brands";

const { logoSrc, logoAlt, navbarLogoHeight } = getBrandConfig();

const NAV_KEYS = ["home", "brands", "catalogs", "service", "b2b", "contact"] as const;
const NAV_HREFS: Record<string, string> = {
  home: "/",
  brands: "/brendovi",
  catalogs: "/katalozi",
  service: "/servis",
  b2b: "/b2b",
  contact: "/kontakt",
};

const FEATURED_BRANDS = BRANDS.slice(0, 8);

const LanguageToggle = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = locale === "sr" ? "en" : "sr";
  const targetFlagSrc = nextLocale === "sr" ? "/rs.svg" : "/en.svg";

  const [, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="p-1 cursor-pointer"
      aria-label={`Switch to ${nextLocale.toUpperCase()}`}
    >
      <Image src={targetFlagSrc} alt={nextLocale.toUpperCase()} width={22} height={16} />
    </button>
  );
};

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
        <nav className="hidden md:flex justify-center items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-x-0.5 flex-nowrap">
              <AnimatePresence>
                {NAV_KEYS.map((key, index) => (
                  <Container key={key} animation="fadeDown" delay={0.05 * index}>
                    <NavigationMenuItem>
                      {key === "brands" ? (
                        <>
                          <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground px-2 py-1 h-auto bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent">
                            {t(key)}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="min-w-[480px]">
                            <div className="p-2">
                              <ul className="grid grid-cols-4 gap-0.5">
                                {FEATURED_BRANDS.map((brand) => (
                                  <li key={brand.slug}>
                                    <NavigationMenuLink asChild>
                                      <Link
                                        href={`/brendovi/${brand.slug}`}
                                        className="flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-muted transition-colors group"
                                      >
                                        <div className="relative h-7 w-full">
                                          <Image
                                            src={brand.logoSrc}
                                            alt={brand.name}
                                            fill
                                            className="object-contain"
                                          />
                                        </div>
                                        <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                                          {brand.name}
                                        </span>
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                              <div className="border-t border-border mt-4 pt-2">
                                <NavigationMenuLink asChild>
                                  <Link
                                    href="/brendovi"
                                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {t("allBrands")}
                                  </Link>
                                </NavigationMenuLink>
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <Link
                            href={NAV_HREFS[key]}
                            className="px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                          >
                            {t(key)}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  </Container>
                ))}
              </AnimatePresence>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right side */}
        <div className="flex items-center justify-end gap-x-2">
          <Container animation="fadeLeft" delay={0.1} className="hidden md:flex items-center gap-x-2">
            <LanguageToggle />
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
                  <SheetTitle>{t("menu")}</SheetTitle>
                  <SheetDescription>{t("menuDescription")}</SheetDescription>
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
                  <div className="mt-4 pt-4 border-t border-border flex items-center">
                    <LanguageToggle />
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
