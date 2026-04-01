import { ImageResponse } from "next/og";
import { OG_SIZE } from "@/lib/og/constants";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { DefaultTemplate } from "@/lib/og/templates";

export const alt = "Gde kupiti — SG Tools";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <DefaultTemplate
        title="Gde kupiti"
        description="Pronađi ovlašćene distributere i prodajna mesta za SG Tools alate."
      />
    ),
    { ...size, fonts },
  );
}
