# Agent Instructions — `apps/web`

Local agent instructions for the public marketing site. Read `/AGENTS.md` first, then this file.

---

## Scope

`apps/web` is the public Playmates ni José site. PawPair marketing pages were removed in PNJ-004. It does **not** have authentication, middleware, or Supabase clients.

- **Port**: 9000
- **Filter**: `pnpm --filter web`
- **Package name**: `web`

---

## Important directories

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js App Router routes and API routes |
| `src/sections/` | Page sections, organized per page |
| `src/components/jabkit/` | **Only** allowed `src/components/` tree. Written by `@jabkit/cli`, not by hand. See [`ROADMAP/00-conventions.md`](../../ROADMAP/00-conventions.md). Domain UI stays in `sections/` and `modules/`. |
| `src/modules/layout/` | Header, footer, navigation |
| `src/modules/providers/` | Redux + TanStack Query + theme providers |
| `src/hooks/` | Query hooks (PawPair hooks deleted in PNJ-004; folder may be empty) |
| `src/constants/` | Routes, SEO metadata, navigation (still PawPair until PNJ-006) |
| `src/types/` | App-local types |
| `src/store/` | Redux store + theme slice |
| `src/lib/` | Utility helpers |
| `public/images/` | Brand and marketing image assets |

---

## Shared packages used

- `@fe-template/ui` — shared UI primitives (Button, Card, ScrollReveal, etc.).
- `@fe-template/db` — Prisma client used only in API routes (`src/app/api/*`).

---

## Entry points

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Temporary stub heading “Playmates ni José” (Phase 3 replaces it) |
| `not-found` | `src/app/not-found.tsx` | Branded 404 (`NotFoundHeroSection`) |

---

## Validation commands

| Concern | Command |
|---|---|
| Dev | `pnpm --filter web dev` |
| Build | `pnpm --filter web build` |
| Type check | `pnpm --filter web typecheck` |
| Lint (ESLint) | `pnpm --filter web lint` |
| Biome (repo-wide) | `pnpm lint` |
| Storybook | `pnpm --filter web storybook` |

---

## Restrictions and boundaries

- No authentication. Do not add middleware, login, or signup pages here without a plan.
- Do not import `@fe-template/db` from client components or pages. Only import it in API routes.
- Do not create a local `src/components/ui/` folder. Use `@fe-template/ui`.
- Do not grow `src/components/` except `src/components/jabkit/` via `@jabkit/cli`. Admin never gets `src/components/`. CLI recipe: [`ROADMAP/00-conventions.md`](../../ROADMAP/00-conventions.md).
- Shared UI wiring must remain in place: `transpilePackages` in `next.config.ts` and the `@source` directive in `globals.css`.
- `NEXT_PUBLIC_SITE_URL` is used for server-side self-fetching but is not in `.env.example`. Document it if you add it.

---

## Common task routing

| Task | Read next |
|---|---|
| New page | `docs/frontend-conventions.md`, `docs/template/PAGES.md`, then `apps/web/docs/patterns.md` |
| New section | `docs/frontend-conventions.md`, `docs/template/COMPONENTS.md`, then inspect `src/sections/not-found/` |
| New API route | `docs/api-and-data-fetching.md` |
| New hook | `docs/template/HOOKS.md` |
| Style change | `docs/styling-and-design-system.md` |

---

## Documentation maintenance

Update this file and `apps/web/docs/` when:
- A new route or API route is added.
- A new shared package is consumed.
- A new environment variable is required.
- The validation commands change.
