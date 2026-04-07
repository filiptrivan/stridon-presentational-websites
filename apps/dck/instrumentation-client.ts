import * as Sentry from "@sentry/nextjs";
import { initSentry } from "@brand/shared/lib/sentry";

initSentry();

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
