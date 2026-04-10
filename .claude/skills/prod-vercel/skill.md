---
name: prod-vercel
description: Use when checking Vercel deployment status, investigating build failures, viewing build logs, listing environment variables, or managing the sg-tools and dck apps on Vercel.
---

# Vercel Deployments

Check deployment status, build logs, runtime logs, environment variables, and domains for apps deployed on Vercel.

## Prerequisites

- Vercel CLI installed and authenticated (`vercel login`)
- Team: `filiptrivans-projects` (auto-scoped after login)
- Apps must be linked first: `vercel link --scope filiptrivans-projects --project PROJECT --cwd apps/PROJECT -y`

## Projects

| Project  | Framework | Production URL   | App directory |
| -------- | --------- | ---------------- | ------------- |
| sg-tools | Next.js   | `sgtools.rs`     | `apps/sg-tools/` |
| dck      | Next.js   | `dcksrbija.rs`   | `apps/dck/` |

Replace `PROJECT` with the project name from the table above.

## Commands

**Recent deployments:**

```bash
vercel list PROJECT
```

**Failed deployments:**

```bash
vercel list PROJECT --status ERROR
```

**Build logs** (replace `DEPLOYMENT_URL` with a URL from `vercel list` output):

```bash
vercel inspect DEPLOYMENT_URL --logs
```

**Build errors only:**

```bash
vercel inspect DEPLOYMENT_URL --logs 2>&1 | grep -iE 'error|ERR_|failed'
```

**Deployment info** (status, aliases/domains, framework, builds):

```bash
vercel inspect DEPLOYMENT_URL
```

**Runtime logs** (serverless function logs, errors, requests):

```bash
vercel logs -p PROJECT --level error --since 1h
```

```bash
vercel logs -p PROJECT --status-code 500 --since 1h
```

```bash
vercel logs -p PROJECT --environment production --since 30m --expand
```

**Environment variables:**

```bash
vercel env ls --cwd apps/sg-tools
vercel env ls --cwd apps/dck
```

**Add environment variable:**

```bash
echo "value" | vercel env add VAR_NAME production --cwd apps/PROJECT -y
```

**Trigger redeployment (requires user confirmation):**

```bash
vercel redeploy DEPLOYMENT_URL
```

## Rules

- **Prefer read-only.** Use inspection commands first.
- **Redeployment requires explicit user confirmation** — always ask before triggering.
- If `vercel env ls` fails with "not linked", run `vercel link --scope filiptrivans-projects --project PROJECT --cwd apps/PROJECT -y` first.
