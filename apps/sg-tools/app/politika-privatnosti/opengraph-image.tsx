import { OG_SIZE } from "@/lib/og/constants";
import { DefaultTemplate } from "@/lib/og/templates";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { ImageResponse } from "next/og";

export const alt = "Politika privatnosti - SG TOOLS";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadFonts();

  return new ImageResponse(
    <DefaultTemplate
      title="Politika privatnosti"
      description="Politika privatnosti SG TOOLS - kako čuvamo tvoje podatke."
    />,
    { ...size, fonts },
  );
}
