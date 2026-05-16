import { OG_SIZE } from "@/lib/og/constants";
import { DefaultTemplate, ProductTemplate } from "@/lib/og/templates";
import { getProductBySlug, getSitemapProducts } from "@brand/shared/lib/api";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { imageToPngDataUrl } from "@brand/shared/lib/og/image";
import { ImageResponse } from "next/og";

export const alt = "Proizvod - SG TOOLS";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const products = await getSitemapProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fonts = await loadFonts();
  const product = await getProductBySlug(slug);

  if (!product) {
    return new ImageResponse(<DefaultTemplate title="Proizvod" />, {
      ...size,
      fonts,
    });
  }

  const imageDataUrl = product.imageUrl
    ? await imageToPngDataUrl(product.imageUrl)
    : undefined;

  return new ImageResponse(
    <ProductTemplate title={product.title} imageUrl={imageDataUrl} />,
    { ...size, fonts },
  );
}
