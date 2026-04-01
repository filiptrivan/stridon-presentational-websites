import { readFile } from "node:fs/promises";
import { join } from "node:path";

let fontsCache:
  | { name: string; data: ArrayBuffer; style: "normal"; weight: 400 | 600 }[]
  | null = null;

export async function loadFonts() {
  if (fontsCache) return fontsCache;

  const fontsDir = join(process.cwd(), "public", "fonts");

  const [spaceGrotesk, inter] = await Promise.all([
    readFile(join(fontsDir, "SpaceGrotesk-SemiBold.ttf")),
    readFile(join(fontsDir, "Inter-Regular.ttf")),
  ]);

  fontsCache = [
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

  return fontsCache;
}
