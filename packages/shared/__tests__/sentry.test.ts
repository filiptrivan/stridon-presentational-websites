import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@sentry/nextjs", () => ({
  captureRequestError: vi.fn(),
}));

import * as Sentry from "@sentry/nextjs";
import { onRequestError } from "../src/lib/sentry";

const mockedCapture = vi.mocked(Sentry.captureRequestError);

const fakeRequest = {
  path: "/proizvodi/tagovi/foo/opengraph-image",
  method: "GET",
  headers: {},
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("onRequestError filter (next.js#88043 workaround)", () => {
  it("drops DYNAMIC_SERVER_USAGE from opengraph-image routes", () => {
    const err = Object.assign(new Error("Dynamic server usage"), {
      digest: "DYNAMIC_SERVER_USAGE",
    });

    onRequestError(err, fakeRequest, {
      routerKind: "App Router",
      routePath: "/proizvodi/tagovi/[slug]/opengraph-image",
      routeType: "route",
    });

    expect(mockedCapture).not.toHaveBeenCalled();
  });

  it("captures DYNAMIC_SERVER_USAGE from non-opengraph-image routes", () => {
    const err = Object.assign(new Error("Dynamic server usage"), {
      digest: "DYNAMIC_SERVER_USAGE",
    });

    onRequestError(err, fakeRequest, {
      routerKind: "App Router",
      routePath: "/proizvodi/tagovi/[slug]",
      routeType: "render",
    });

    expect(mockedCapture).toHaveBeenCalledOnce();
  });

  it("captures non-DYNAMIC_SERVER_USAGE errors from opengraph-image routes", () => {
    const err = Object.assign(new Error("u2 is not iterable"), {
      digest: "TYPE_ERROR",
    });

    onRequestError(err, fakeRequest, {
      routerKind: "App Router",
      routePath: "/proizvodi/[slug]/opengraph-image",
      routeType: "route",
    });

    expect(mockedCapture).toHaveBeenCalledOnce();
  });

  it("captures errors without a digest", () => {
    onRequestError(new Error("plain error"), fakeRequest, {
      routerKind: "App Router",
      routePath: "/proizvodi/[slug]/opengraph-image",
      routeType: "route",
    });

    expect(mockedCapture).toHaveBeenCalledOnce();
  });
});
