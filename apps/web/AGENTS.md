# Agent Instructions — `apps/web`

Local agent instructions for the public marketing site. Read `/AGENTS.md` first, then this file.

---

## Scope

`apps/web` is the public Playmates ni José archive site (eight visitor routes). PawPair marketing pages were removed in PNJ-004. It does **not** have authentication, middleware, or Supabase clients. Playmates data comes from `@fe-template/mocks` via `src/lib/playmates.ts`. Do not import `@fe-template/db` for Playmates entities. Owner swap: [`ROADMAP/11-handoff-to-real-data.md`](../../ROADMAP/11-handoff-to-real-data.md).

- **Port**: 9000
- **Filter**: `pnpm --filter web`
- **Package name**: `web`

---

## Important directories

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js App Router routes (no `src/app/api/*` in this prototype) |
| `src/sections/` | Page sections, organized per page (`home`, `sessions`, `game-detail`, `players`, `player-detail`, `venues`, `venue-detail`, `not-found`) |
| `src/components/jabkit/` | **Only** allowed `src/components/` tree. Written by `@jabkit/cli`, not by hand. See [`ROADMAP/00-conventions.md`](../../ROADMAP/00-conventions.md). Domain UI stays in `sections/` and `modules/`. |
| `src/modules/layout/` | Header, footer, navigation |
| `src/modules/providers/` | Redux + TanStack Query + theme providers |
| `src/hooks/` | Public fetchers (`use-public-sessions`, `use-public-games`, `use-public-players`, `use-public-venues`) |
| `src/lib/playmates.ts` | Thin adapter: imports `@fe-template/mocks` public helpers |
| `src/constants/` | Routes, SEO metadata, navigation (Playmates set from PNJ-006) |
| `src/types/` | App-local types |
| `src/store/` | Redux store + theme slice |
| `src/lib/` | Utility helpers |
| `public/images/` | Brand and marketing image assets |

---

## Shared packages used

- `@fe-template/ui` — shared UI primitives (Button, Card, ScrollReveal, etc.).
- `@fe-template/mocks` — prototype Playmates data layer. Prisma in `@fe-template/db` is still PawPair; **do not claim or use it for Playmates models**.

---

## Entry points

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Archive home (PNJ-043): hero, latest sessions, recent games, players strip |
| `/sessions` | `src/app/sessions/page.tsx` | Public sessions index (PNJ-044) |
| `/sessions/[sessionSlug]` | `src/app/sessions/[sessionSlug]/page.tsx` | Public session detail (PNJ-045) |
| `/games/[gameSlug]` | `src/app/games/[gameSlug]/page.tsx` | Public game detail (PNJ-046) |
| `/players` | `src/app/players/page.tsx` | Public players index (PNJ-047) |
| `/players/[playerSlug]` | `src/app/players/[playerSlug]/page.tsx` | Public player detail (PNJ-048) |
| `/venues` | `src/app/venues/page.tsx` | Public venues index (PNJ-049) |
| `/venues/[venueSlug]` | `src/app/venues/[venueSlug]/page.tsx` | Public venue detail (PNJ-050) |
| `/sitemap.xml` | `src/app/sitemap.ts` | Public sitemap (PNJ-051); public slugs only |
| `/robots.txt` | `src/app/robots.ts` | Crawl rules (`allow: /`) |
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
- Do not import `@fe-template/db`. There are no Playmates Prisma models. Public data goes through `@fe-template/mocks` (`src/lib/playmates.ts`). Real-data swap: [`ROADMAP/11-handoff-to-real-data.md`](../../ROADMAP/11-handoff-to-real-data.md).
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
| Public data / mocks | `packages/mocks/docs/README.md`, `ROADMAP/11-handoff-to-real-data.md` |
| New hook | `docs/template/HOOKS.md` |
| Style change | `docs/styling-and-design-system.md` |

---

## Documentation maintenance

Update this file and `apps/web/docs/` when:
- A new route or API route is added.
- A new shared package is consumed.
- A new environment variable is required.
- The validation commands change.

## UI components (JabKit)

This project uses JabKit. Search its MCP catalogue before hand-writing a reusable UI component. Installed files live in `src/components/jabkit/`; use semantic token classes, never hardcoded colors.

Installed names (CLI output only; do not hand-edit):

| Name | Kind | Ticket |
|---|---|---|
| `button` | atom | PNJ-019 |
| `badge` | atom | PNJ-019 |
| `skeleton` | atom | PNJ-019 |
| `separator` | atom | PNJ-019 |
| `avatar` | atom | PNJ-019 |
| `hero228` | marketing | PNJ-020 |
| `gallery31` | marketing | PNJ-020 |
| `projects16` | marketing | PNJ-020 |
| `team17` | marketing | PNJ-020 |
| `count-up` | marketing | PNJ-020 |
| `split-text` | marketing | PNJ-020 |
| `spotlight-card` | marketing | PNJ-020 |
| `footer-section` | marketing | PNJ-020 |
| `input` | atom (registryDependency of `footer-section`) | PNJ-020 |
| `label` | atom (registryDependency of `footer-section`) | PNJ-020 |

`hero-section-5` and `tubelight-navbar` were not installed.

The CLI rewrites `@/lib/cn` to `@/components/jabkit/lib/cn` but leaves `@/atoms/<name>` imports as-is. `tsconfig.json` maps `@/atoms/*` → `./src/components/jabkit/*` so those registryDependencies resolve without editing installed source.
