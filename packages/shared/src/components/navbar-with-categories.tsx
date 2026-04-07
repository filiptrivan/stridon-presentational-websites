import { getLeafCategories } from "../lib/api";
import type { Category } from "../types/categories";
import Navbar from "./navbar";

const NavbarWithCategories = async () => {
  let categories: Category[] = [];
  try {
    categories = await getLeafCategories();
  } catch {
    categories = [];
  }

  return <Navbar categories={categories} />;
};

export default NavbarWithCategories;
