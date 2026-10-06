import { baseNextConfig } from "@brand/config/next-config";
import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(baseNextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  tunnelRoute: "/monitoring",
});
