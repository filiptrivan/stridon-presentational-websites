import { OG_SIZE } from "@/lib/og/constants";
import { DefaultTemplate } from "@/lib/og/templates";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { ImageResponse } from "next/og";

export const alt = "SG Tools - Profesionalni alati";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadFonts();

  return new ImageResponse(
    <DefaultTemplate
      title="Građen znanjem"
      description="Porodična firma sa 30 godina iskustva u prodaji i distribuciji alata."
    />,
    { ...size, fonts },
  );
}
