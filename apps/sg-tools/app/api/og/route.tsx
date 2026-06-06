import {
  CategoryTemplate,
  DefaultTemplate,
  ProductTemplate,
} from "@/lib/og/templates";
import { createOgImageRoute } from "@brand/shared/lib/og/route";

export const GET = createOgImageRoute({
  default: ({ title, description }) => (
    <DefaultTemplate title={title} description={description} />
  ),
  category: ({ title, description }) => (
    <CategoryTemplate name={title} description={description} />
  ),
  product: ({ title, image }) => (
    <ProductTemplate title={title} imageUrl={image} />
  ),
});
