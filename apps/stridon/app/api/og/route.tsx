import { DefaultTemplate } from "@/lib/og/templates";
import { createOgImageRoute } from "@brand/shared/lib/og/route";

export const GET = createOgImageRoute({
  default: ({ title, description }) => (
    <DefaultTemplate title={title} description={description} />
  ),
});
