import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stridon Group - distributer alata",
    short_name: "Stridon",
    description:
      "Stridon Group - zvanični uvoznik i distributer profesionalnog alata u Srbiji.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#E50113",
    icons: [
      {
        src: "/favicon.ico",
        // The real frames in the file, not "any". That value declares a
        // scalable resource and belongs to vector formats; on a raster icon
        // Chrome downloads it, finds 48px where the manifest promised any
        // size, and logs "Resource size is not correct - typo in the
        // Manifest?" on every page load.
        sizes: "48x48 32x32 16x16",
        type: "image/x-icon",
      },
      {
        src: "/web-app-manifest-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "/web-app-manifest-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  };
}
