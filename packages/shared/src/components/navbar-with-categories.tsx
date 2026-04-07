import { getLeafCategories } from "../lib/api";
import type { Category } from "../types/categories";
import Navbar from "./navbar";
import type { NavbarLink } from "./mobile-menu";

interface NavbarWithCategoriesProps {
  navLinks: readonly NavbarLink[];
}

const NavbarWithCategories = async ({
  navLinks,
}: NavbarWithCategoriesProps) => {
  let categories: Category[] = [];
  try {
    categories = await getLeafCategories();
  } catch {
    categories = [];
  }

  return <Navbar categories={categories} navLinks={navLinks} />;
};

export default NavbarWithCategories;
