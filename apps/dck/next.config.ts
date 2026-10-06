import { baseNextConfig } from "@brand/config/next-config";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...baseNextConfig,
  experimental: {
    ...baseNextConfig.experimental,
    serverActions: {
      // MAX_FILE_SIZE (4MB) + 1MB headroom for multipart envelope and form fields.
      bodySizeLimit: "5mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/registracija-garancije",
        destination: "/produzetak-garancije",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  tunnelRoute: "/monitoring",
});
