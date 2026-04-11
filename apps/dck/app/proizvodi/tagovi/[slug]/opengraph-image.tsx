import { OG_SIZE } from "@/lib/og/constants";
import { CategoryTemplate, DefaultTemplate } from "@/lib/og/templates";
import { getPrerenderedTagSlugs, getTagBySlug } from "@brand/shared/lib/api";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { ImageResponse } from "next/og";

export const alt = "Tag - DCK";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getPrerenderedTagSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fonts = await loadFonts();
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return new ImageResponse(
      <DefaultTemplate title="Tag" description="DCK profesionalni alati" />,
      { ...size, fonts },
    );
  }

  return new ImageResponse(
    <CategoryTemplate
      name={tag.name}
      description={tag.metaDescription}
      label="TAG"
    />,
    { ...size, fonts },
  );
}
