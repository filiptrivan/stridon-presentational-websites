import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@brand/config", "@brand/ui", "@brand/shared"],
  cacheComponents: true,
  env: {
    NEXT_PUBLIC_BRAND_SLUG: "sg-tools",
    BUILD_YEAR: String(new Date().getFullYear()),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.prodavnicaalata.rs" },
      {
        protocol: "https",
        hostname: "pub-0c08792ef71a4e14abb8d23b3a1fcdaf.r2.dev",
      },
    ],
  },
};

export default nextConfig;
