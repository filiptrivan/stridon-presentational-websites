import messages from "./messages/sr.json";

// Types every next-intl call against the Serbian catalog, the default locale:
// an unknown namespace or key is a tsc error instead of a raw key rendered at
// runtime (https://next-intl.dev/docs/workflows/typescript). en.json is held
// to the same keys by __tests__/messages-parity.test.ts.
//
// `Locale` is deliberately not declared here yet: once it is, every
// getTranslations call needs a `Locale` rather than the `string` a page gets
// from its params.
declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
  }
}
