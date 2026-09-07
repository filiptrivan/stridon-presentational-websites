import { DefaultTemplate } from "@/lib/og/templates";
import { fonts } from "@/lib/og/constants";
import { createOgImageRoute } from "@brand/shared/lib/og/route";

// Only the `default` card is reachable: Stridon has no product, category or tag
// routes, so no page ever asks for those OG types.
export const GET = createOgImageRoute(
  {
    default: ({ title, description }) => (
      <DefaultTemplate title={title} description={description} />
    ),
  },
  fonts,
);
