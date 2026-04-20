import { OG_SIZE } from "@/lib/og/constants";
import { DefaultTemplate, ProductTemplate } from "@/lib/og/templates";
import { getProductBySlug, getSitemapProducts } from "@brand/shared/lib/api";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { ImageResponse } from "next/og";

export const alt = "Proizvod - SG TOOLS";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const products = await getSitemapProducts();
  return products.map((p) => ({ slug: p.slug }));
}

// Satori recommends passing base64-encoded image data directly instead of remote
// URLs to avoid extra I/O during rendering (see github.com/vercel/satori#images).
// Without this, satori's internal fetch races the prerender window and gets rejected.
async function toDataUrl(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const contentType = res.headers.get("content-type") ?? "image/png";
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return undefined;
  }
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
    ? await toDataUrl(product.imageUrl)
    : undefined;

  return new ImageResponse(
    <ProductTemplate title={product.title} imageUrl={imageDataUrl} />,
    { ...size, fonts },
  );
}
