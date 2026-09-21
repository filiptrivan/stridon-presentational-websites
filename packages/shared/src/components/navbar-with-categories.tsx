import { getFlatCategories } from "../lib/api";
import type { Category } from "../types/categories";
import Navbar, { type NavbarLabels } from "./navbar";
import type { MobileMenuLabels, NavbarLink } from "./mobile-menu";
import type { ReactNode } from "react";

const HEADER_CATEGORY_COUNT = 4;

interface NavbarWithCategoriesProps {
  navLinks: readonly NavbarLink[];
  languageSwitch?: ReactNode;
  labels?: NavbarLabels;
  mobileLabels?: MobileMenuLabels;
  headerCtaHref?: string;
  homeHref?: string;
}

const NavbarWithCategories = async ({
  navLinks,
  languageSwitch,
  labels,
  mobileLabels,
  headerCtaHref,
  homeHref,
}: NavbarWithCategoriesProps) => {
  let categories: Category[] = [];
  try {
    categories = await getFlatCategories(HEADER_CATEGORY_COUNT);
  } catch {
    categories = [];
  }

  return (
    <Navbar
      categories={categories}
      navLinks={navLinks}
      languageSwitch={languageSwitch}
      labels={labels}
      mobileLabels={mobileLabels}
      headerCtaHref={headerCtaHref}
      homeHref={homeHref}
    />
  );
};

export default NavbarWithCategories;
