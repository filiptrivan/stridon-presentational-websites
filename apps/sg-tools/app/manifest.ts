import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SG Tools — Profesionalni alati",
    short_name: "SG Tools",
    description:
      "Profesionalni alati nastali iz 30 godina iskustva. Kvalitet po cenama koje imaju smisla.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#B42A37",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
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
