# CLAUDE.md — SG Tools

See root `../../CLAUDE.md` for shared principles, architecture patterns, and domain map.

## Project-Specific

- **Domain**: sgtools.rs
- **Theme**: Dark mode only — `.dark` class is hardcoded on `<body>`
- **Brand slug**: `sg-tools` (via `NEXT_PUBLIC_BRAND_SLUG` in `next.config.ts`)
- **Primary color**: Warm red — `oklch(44.4% 0.177 26.899)` in `.dark` block of `globals.css`

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
