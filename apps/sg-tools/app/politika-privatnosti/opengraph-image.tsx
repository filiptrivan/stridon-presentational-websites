import { ImageResponse } from "next/og";
import { OG_SIZE } from "@/lib/og/constants";
import { loadFonts } from "@brand/shared/lib/og/fonts";
import { DefaultTemplate } from "@/lib/og/templates";

export const alt = "Politika privatnosti — SG Tools";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <DefaultTemplate
        title="Politika privatnosti"
        description="Politika privatnosti SG Tools — kako čuvamo tvoje podatke."
      />
    ),
    { ...size, fonts },
  );
}
