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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@brand/ui/sheet";
import { NAV_LINKS } from "@/constants/links";
import type { Category } from "../types/categories";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import BuyOnlineButton from "./buy-online-button";

interface MobileMenuProps {
  categories: Category[];
}

const MobileMenu = ({ categories }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-4">
        <SheetHeader className="sr-only">
          <SheetTitle>Meni</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-8">
          {NAV_LINKS.map((link, index) =>
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
                          Sve kategorije
                        </Link>
                      </SheetClose>
                      {categories.map((cat) => (
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
            <BuyOnlineButton className="mt-4" variant={"outline"} />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
