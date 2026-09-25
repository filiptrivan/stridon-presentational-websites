import { routing } from "./routing";
import { createNavigation } from "next-intl/navigation";

/**
 * Locale-aware routing helpers. `getPathname` takes the internal route
 * (`/onama`) and returns whatever the locale spells it as (`/onama` or
 * `/en/about`), so no component has to know which language it is rendering in.
 * Only the two helpers the app calls are exported; `Link`, `redirect` and
 * `useRouter` are one destructure away if a page ever needs them.
 */
export const { usePathname, getPathname } = createNavigation(routing);
