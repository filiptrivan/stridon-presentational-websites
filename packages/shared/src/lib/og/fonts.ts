import { cacheLife } from "next/cache";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function loadFonts() {
  "use cache";
  cacheLife("weeks");

  const fontsDir = join(process.cwd(), "public", "fonts");

  const [spaceGrotesk, inter] = await Promise.all([
    readFile(join(fontsDir, "SpaceGrotesk-SemiBold.ttf")),
    readFile(join(fontsDir, "Inter-Regular.ttf")),
  ]);

  return [
    {
      name: "Space Grotesk",
      data: spaceGrotesk.buffer as ArrayBuffer,
      style: "normal" as const,
      weight: 600 as const,
    },
    {
      name: "Inter",
      data: inter.buffer as ArrayBuffer,
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}
