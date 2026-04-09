---
name: env-update
description: Use when adding, removing, or renaming environment variables in the project. Ensures turbo.json stays in sync and naming conventions are followed.
---

# Environment Variables

## Rules

1. **turbo.json must stay in sync.** Every env var used by any app must be declared in `turbo.json` under `tasks.build.env`. Turborepo uses this list to track build cache invalidation and Vercel will warn about missing entries.

2. **`NEXT_PUBLIC_` prefix** means the variable is inlined into the client bundle at build time and visible to anyone. Only use it for values that are safe to expose publicly (e.g. brand slug, Sentry DSN, Turnstile site key). Never use it for API keys, secrets, or tokens. **Do NOT add `NEXT_PUBLIC_*` vars to Vercel project settings** - they are public, so they belong in each app's ``.env.production` in each app, not in Vercel's secret store.

3. **Server-only variables** (no `NEXT_PUBLIC_` prefix) are only available in server components, server actions, route handlers, and `next.config.ts`. Use this for all secrets (`API_URL`, `BREVO_API_KEY`, `PACMS_API_KEY`, `TURNSTILE_SECRET_KEY`, `SENTRY_AUTH_TOKEN`). These **must** be set in Vercel project settings.

## Checklist when adding a new env var

- [ ] Add to `turbo.json` `tasks.build.env` array (keep alphabetical order)
- [ ] If server-only: add to `.env.local` in each app that uses it (gitignored) and to Vercel project settings (use the `prod-vercel` skill in PACMS)
- [ ] If `NEXT_PUBLIC_*`: add to ``.env.production` in each app - do NOT add to Vercel project settings
- [ ] Document in `CLAUDE.md` Environment Variables section if it's a key variable

## Checklist when removing an env var

- [ ] Remove from `turbo.json` `tasks.build.env`
- [ ] If server-only: remove from `.env.local` files and Vercel project settings (use the `prod-vercel` skill in PACMS)
- [ ] If `NEXT_PUBLIC_*`: remove from ``.env.production` in each app
- [ ] Remove from `CLAUDE.md` if documented there

## Current turbo.json env list

Keep this alphabetically sorted:

```
API_URL, BREVO_API_KEY, NEXT_PUBLIC_SENTRY_DSN, PACMS_API_KEY, SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT, TURNSTILE_SECRET_KEY
```
