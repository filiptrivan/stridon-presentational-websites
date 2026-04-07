import { ImageResponse } from "next/og";
import { OG_SIZE } from "@/lib/og/constants";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { DefaultTemplate } from "@/lib/og/templates";

export const alt = "DCK — Profesionalni alati";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <DefaultTemplate
        title="DCK profesionalni alati"
        description="Brend kompanije Dongcheng od 1995, prisutan u 100+ zemalja sa zvaničnom podrškom u Srbiji."
      />
    ),
    { ...size, fonts },
  );
}
