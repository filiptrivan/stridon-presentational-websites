/**
 * `public/stridon-logo.svg` rasterised to a 400x163 PNG and inlined.
 *
 * The OG route runs on satori, which has no browser: an `<img>` pointing at a
 * URL would cost a fetch on every cold render, and its SVG support is thinner
 * than its PNG support. Inlining costs 7 KB in this module and nothing at
 * request time. 400px wide is 2x the 200 the card draws it at, so it stays
 * crisp where a preview is shown at 2x.
 *
 * Regenerate after any change to the logo:
 *   sharp(svg, { density: 300 }).resize(400, 163, { fit: "fill" })
 *     .png({ compressionLevel: 9, palette: true })
 */
export const LOGO_PNG_DATA_URI =
  "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAZAAAACjCAMAAACT+LhJAAADAFBMVEVMaXHhAA6dnZ2cnJyMJSqcnJyMJSmMJSqLJCmLJCp/" +
  "f3+dnZ2MJCqioqKdnZ2dnZ3RAADiABadnZ2dnZ2dnZ2MJSqdnZ3jAhTjAhSkpKSdnZ2cnJyCHCbkAxOcnJy4uLicnJzkAxTa" +
  "AACcnJyMJCmcnJydnZ2MJCmdnZ2dnZ2cnJzjAxShoaGcnJydnZ2LJCmdnZ2dnZ2cnJycnJyLJSqLOTmLJCmNJSmbm5udnZ2d" +
  "nZ2bm5udnZ2cnJydnZ2dnZ2dnZ2dnZ2nGBicnJzmBRSdnZ2cnJycnJydnZ2dnZ2MJCmOJSecnJyWlpbkAxOdnZ3kAxKbm5ud" +
  "nZ2dnZ2NJCmOHi7kAhOdnZ2cnJycnJyPISzkAhTkAxSdnZ2MJSmdnZ2enp6cnJydnZ2MJSqcnJycnJyLJSnkAxOdnZ2cnJyc" +
  "nJyLJCmLJCmMJCqcnJyMJSqenp7kAxScnJznABeMJSqLJSmLJSqcnJyenp6MJCmcnJyOJSWMIyuMJCnqABLkABrkAhOMJCmc" +
  "nJyMJSqcnJyenp6hoaGdnZ2dnZ2enp6MJSmdnZ2dnZ2KJSiZmZmdnZ2MJSmdnZ2dnZ2ampqMJCmcnJydnZ3iBBKNIyOYmJic" +
  "nJybm5uLJCnkAhOMJCnkAxOLJCnnABPkAhLbAB+LJSqdnZ2dnZ2LJCmMJCqcnJycnJzjAxSLJCqKJSiLJSnkAhPjAxPkABSM" +
  "JCnkAxPkAxOLJSmMIyrkAhOdnZ3lAxOJKSmLJSnjAxOMJCmdnZ2MJCrjAhPkAxPjAxTkBBThABPkAxPlAhSMJCnkABGdnZ2L" +
  "IymMJCmMJCiLJCmMJCmLJCqLJCnjAxSLJCqdnZ2MJCiLIirkAhTkAxPkAhPkAxPjAhOMJSmcnJzjAxPjAxOMJCmMJSqNLS2M" +
  "JCqLJCnjAhSMJCnkBBPkAhTjAxTkAhOLIymdnZ3jAxPkAhPkAxSLJCrjAhOLJSrkAhPkBRTjAxPjABTkAxPkAhScnJyNJCnj" +
  "AhPkABOKJCiMJSrkAxSdnZ2F/441AAAA/XRSTlMAEX40Wd2IbWhUBO+7Cz9jASLm2f7Mk7vMBIOZCN1VAUbuAvn8XvzmzPp3" +
  "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";

/** The wordmark's own aspect, 456 x 186 from the SVG viewBox. */
export const LOGO_ASPECT = 456 / 186;
