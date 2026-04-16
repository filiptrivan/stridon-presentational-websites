import { getFlatCategories } from "../lib/api";
import type { Category } from "../types/categories";
import Navbar from "./navbar";
import type { NavbarLink } from "./mobile-menu";

const HEADER_CATEGORY_COUNT = 4;

interface NavbarWithCategoriesProps {
  navLinks: readonly NavbarLink[];
}

const NavbarWithCategories = async ({
  navLinks,
}: NavbarWithCategoriesProps) => {
  let categories: Category[] = [];
  try {
    categories = await getFlatCategories(HEADER_CATEGORY_COUNT);
  } catch {
    categories = [];
  }

  return <Navbar categories={categories} navLinks={navLinks} />;
};

export default NavbarWithCategories;
