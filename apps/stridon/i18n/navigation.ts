import { routing } from "./routing";
import { createNavigation } from "next-intl/navigation";

/**
 * Locale-aware replacements for `next/link` and `next/navigation`. They take the
 * internal route (`/onama`) and emit whatever the current locale spells it as
 * (`/onama` or `/en/about`), so no component has to know which language it is
 * rendering in.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
