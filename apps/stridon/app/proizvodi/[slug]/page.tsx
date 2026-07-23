import ProductDetailPage from "@brand/shared/components/product-detail-page";
import { DEALERS } from "@/constants/dealers";

export {
  generateMetadata,
  generateStaticParams,
} from "@brand/shared/components/product-detail-page";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  return <ProductDetailPage {...props} dealers={DEALERS} />;
}
