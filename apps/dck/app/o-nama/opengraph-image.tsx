import { OG_SIZE } from "@/lib/og/constants";
import { DefaultTemplate } from "@/lib/og/templates";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { ImageResponse } from "next/og";

export const alt = "O nama — DCK";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadFonts();

  return new ImageResponse(
    <DefaultTemplate
      title="O nama"
      description="Upoznaj DCK, brend Dongcheng-a od 1995. godine, prisutan u 100+ zemalja i zvanično dostupan u Srbiji."
    />,
    { ...size, fonts },
  );
}
