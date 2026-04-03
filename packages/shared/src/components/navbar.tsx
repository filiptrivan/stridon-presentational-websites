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
import { NAV_LINKS } from "@/constants/links";
import { cn } from "../lib/utils";
import type { Category } from "../types/categories";
import { getBrandConfig } from "@brand/config";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "./container";
import MobileMenu from "./mobile-menu";
import Wrapper from "./wrapper";

const { logoSrc, logoAlt, navbarLogoHeight, headerCta } = getBrandConfig();

interface NavbarProps {
  categories: Category[];
}

const Navbar = ({ categories }: NavbarProps) => {
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
              className={cn("w-max", navbarLogoHeight)}
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
                {NAV_LINKS.map((link, index) => (
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

        <div className="flex items-center justify-end gap-x-4">
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
          <div className="md:hidden">
            <Container animation="fadeLeft" delay={0.1}>
              <MobileMenu categories={categories} />
            </Container>
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export default Navbar;
