"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@brand/ui/accordion";
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
import type { Category } from "../types/categories";
import { getBrandConfig } from "@brand/config";
import { ExternalLinkIcon, MenuIcon } from "lucide-react";
import Link from "next/link";

export interface NavbarLink {
  label: string;
  href: string;
  external?: boolean;
}

const DEFAULT_LABELS = {
  menu: "Meni",
  menuDescription: "Navigacija kroz kategorije i stranice.",
  allCategories: "Sve kategorije",
  headerCta: undefined as string | undefined,
};

export type MobileMenuLabels = Partial<typeof DEFAULT_LABELS>;

interface MobileMenuProps {
  categories: Category[];
  navLinks: readonly NavbarLink[];
  labels?: MobileMenuLabels;
  /** A localized site passes the localized path; brand-config cannot. */
  headerCtaHref?: string;
}

const { headerCta } = getBrandConfig();

const MobileMenu = ({
  categories,
  navLinks,
  labels,
  headerCtaHref,
}: MobileMenuProps) => {
  const t = { ...DEFAULT_LABELS, ...labels };
  const ctaHref = headerCtaHref ?? headerCta.href;
  const ctaLabel = t.headerCta ?? headerCta.label;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-4">
        <SheetHeader className="sr-only">
          <SheetTitle>{t.menu}</SheetTitle>
          <SheetDescription>{t.menuDescription}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-8">
          {navLinks.map((link, index) =>
            link.href === "/proizvodi/kategorije" ? (
              <Accordion key={index} type="single" collapsible>
                <AccordionItem value="categories" className="border-b-0">
                  <AccordionTrigger className="py-2 text-lg font-medium hover:no-underline">
                    {link.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-2">
                    <div className="flex flex-col gap-1 pl-2">
                      <SheetClose asChild>
                        <Link
                          href="/proizvodi/kategorije"
                          className="py-2 text-base text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {t.allCategories}
                        </Link>
                      </SheetClose>
                      {categories.slice(0, 4).map((cat) => (
                        <SheetClose asChild key={cat.slug}>
                          <Link
                            href={`/proizvodi/kategorije/${cat.slug}`}
                            className="py-2 text-base text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {cat.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <SheetClose asChild key={index}>
                <Link
                  href={link.href}
                  className="text-lg font-medium w-full py-2"
                >
                  {link.label}
                </Link>
              </SheetClose>
            ),
          )}
          <SheetClose asChild>
            <Button asChild variant="outline" className="mt-4">
              {headerCta.external ? (
                <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                  {ctaLabel}
                  <ExternalLinkIcon className="size-3.5" />
                </a>
              ) : (
                <Link href={ctaHref}>{ctaLabel}</Link>
              )}
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
