import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type OgFontSpec = {
  /** Filename inside the app's `public/fonts/` directory. */
  file: string;
  /** Family name referenced by `fontFamily` in the brand's OG templates. */
  name: string;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
};

// Called once at module init of each app's OG route, outside any render path,
// so the font files are read once per instance rather than once per image.
export const loadFonts = (specs: OgFontSpec[]) => {
  const fontsDir = join(process.cwd(), "public", "fonts");
  return Promise.all(
    specs.map(async ({ file, name, weight }) => ({
      name,
      data: (await readFile(join(fontsDir, file))).buffer as ArrayBuffer,
      style: "normal" as const,
      weight,
    })),
  );
};
