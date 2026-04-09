import { OG_SIZE } from "@/lib/og/constants";
import { DefaultTemplate } from "@/lib/og/templates";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { ImageResponse } from "next/og";

export const alt = "Servis - DCK";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadFonts();

  return new ImageResponse(
    <DefaultTemplate
      title="Ovlašćeni servisi"
      description="Pronađi ovlašćeni servisni centar za DCK alate u Srbiji."
    />,
    { ...size, fonts },
  );
}
