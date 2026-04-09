import { OG_SIZE } from "@/lib/og/constants";
import { DefaultTemplate } from "@/lib/og/templates";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { ImageResponse } from "next/og";

export const alt = "Registracija garancije - DCK";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadFonts();

  return new ImageResponse(
    <DefaultTemplate
      title="Registracija garancije"
      description="Registruj garanciju za svoj DCK alat - brzo, jednostavno i besplatno."
    />,
    { ...size, fonts },
  );
}
