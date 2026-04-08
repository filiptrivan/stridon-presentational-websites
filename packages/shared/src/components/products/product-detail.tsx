import Container from "../container";
import Wrapper from "../wrapper";
import { type BreadcrumbSegment, buildBreadcrumbJsonLd } from "@brand/shared/lib/categories";
import type { Product } from "@brand/shared/types/products";
import PageBreadcrumbs from "./page-breadcrumbs";
import ProductGallery from "./product-gallery";
import ProductTabs from "./product-tabs";

interface ProductDetailProps {
  product: Product;
  categoryBreadcrumbs: BreadcrumbSegment[];
}

const ProductDetail = ({
  product,
  categoryBreadcrumbs,
}: ProductDetailProps) => {
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.imageUrl,
    brand: {
      "@type": "Brand",
      name: product.brandName || "SG Tools",
    },
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    categoryBreadcrumbs,
    product.title,
  );

  return (
    <Wrapper className="py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Breadcrumbs */}
      <Container>
        <PageBreadcrumbs
          segments={categoryBreadcrumbs}
          currentPage={product.title}
        />
      </Container>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <Container>
          <ProductGallery
            media={product.productMedia}
            fallbackUrl={product.imageUrl}
            title={product.title}
          />
        </Container>

        {/* Right: Product info */}
        <Container delay={1}>
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {product.title}
            </h1>

            {product.description && (
              <div
                className="text-muted-foreground mt-3 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Metadata */}
            <div className="mt-8 pt-6 border-t border-border/20 space-y-2 text-sm">
              {product.sku != null && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground">Šifra proizvoda:</span>
                  <span>{product.sku}</span>
                </div>
              )}
              {product.weightKg != null && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground">Težina:</span>
                  <span>{product.weightKg} kg</span>
                </div>
              )}
              {product.heightCm != null && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground">Visina:</span>
                  <span>{product.heightCm} cm</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Product details / specification */}
      {(product.htmlDescription || product.specification) && (
        <Container delay={2} className="mt-12 lg:mt-16">
          <ProductTabs
            htmlDescription={product.htmlDescription}
            specification={product.specification}
          />
        </Container>
      )}

    </Wrapper>
  );
};

export default ProductDetail;
