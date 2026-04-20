import { OG_SIZE } from "@/lib/og/constants";
import { CategoryTemplate, DefaultTemplate } from "@/lib/og/templates";
import { getAllCategoriesFlat, getCategoryBySlug } from "@brand/shared/lib/api";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { ImageResponse } from "next/og";

export const alt = "Kategorija - SG TOOLS";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const categories = await getAllCategoriesFlat();
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fonts = await loadFonts();
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return new ImageResponse(<DefaultTemplate title="Kategorija" />, {
      ...size,
      fonts,
    });
  }

  return new ImageResponse(
    <CategoryTemplate
      name={category.name}
      description={category.metaDescription || category.description}
    />,
    { ...size, fonts },
  );
}
