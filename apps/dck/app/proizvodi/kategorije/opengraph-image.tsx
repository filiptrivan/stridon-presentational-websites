import { OG_SIZE } from "@/lib/og/constants";
import { DefaultTemplate } from "@/lib/og/templates";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { ImageResponse } from "next/og";

export const alt = "Kategorije proizvoda - DCK";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadFonts();

  return new ImageResponse(
    <DefaultTemplate
      title="Kategorije proizvoda"
      description="Pregledaj sve kategorije DCK profesionalnih alata."
    />,
    { ...size, fonts },
  );
}
