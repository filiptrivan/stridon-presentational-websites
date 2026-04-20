import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Load fonts once at module init, outside any render path. Cache Components
// only inspects IO inside render callbacks; doing readFile here sidesteps
// vercel/next.js#88043 (silent "use cache" drop in opengraph-image routes).
const fontsPromise = (async () => {
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
})();

export const loadFonts = () => fontsPromise;
