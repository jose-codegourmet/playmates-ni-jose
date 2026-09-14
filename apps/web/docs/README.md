# `apps/web` — Public Playmates archive

Purpose, routes, shared packages, and commands for the public site.

---

## Purpose

`apps/web` is the public Playmates ni José archive. Visitors browse published sessions, games, players, and venues. It has no authentication. Pages are Server Components that read `@fe-template/mocks` through `src/lib/playmates.ts`.

- **Primary users**: Public visitors
- **Port**: 9000
- **Filter**: `web`

Prisma (`@fe-template/db`) still contains leftover PawPair models. **It does not have Playmates models.** Do not query Prisma from this app. Owner swap: [`ROADMAP/11-handoff-to-real-data.md`](../../../ROADMAP/11-handoff-to-real-data.md).

---

## Main responsibilities

- Compose thin `page.tsx` shells from `src/sections/`.
- List and detail published sessions, games, players, and venues.
- Emit `/sitemap.xml` and `/robots.txt` for public slugs only.
- Brand chrome (header, footer) and a Playmates `not-found` page.

---

## Technology

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19, `@fe-template/ui`, JabKit blocks in `src/components/jabkit/`, Tailwind CSS 4 |
| State | Redux Toolkit (theme), TanStack Query (unused for public lists today) |
| Data | `@fe-template/mocks` via `src/lib/playmates.ts` (in-memory + `packages/mocks/.data/store.json`) |
| Auth | None |
| Styling | Tailwind CSS 4, `next/font` (Figtree, Manrope) |

---

## Routes and entry points

The eight public visitor routes:

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Archive home: calendar hero, latest sessions, recent games, players strip |
| `/sessions` | `src/app/sessions/page.tsx` | Sessions index (filters + grid) |
| `/sessions/[sessionSlug]` | `src/app/sessions/[sessionSlug]/page.tsx` | Session detail |
| `/games/[gameSlug]` | `src/app/games/[gameSlug]/page.tsx` | Game detail (YouTube embed, recordings, links) |
| `/players` | `src/app/players/page.tsx` | Players index |
| `/players/[playerSlug]` | `src/app/players/[playerSlug]/page.tsx` | Player detail |
| `/venues` | `src/app/venues/page.tsx` | Venues index |
| `/venues/[venueSlug]` | `src/app/venues/[venueSlug]/page.tsx` | Venue detail |

Also:

| Route | File | Purpose |
|---|---|---|
| `/sitemap.xml` | `src/app/sitemap.ts` | Public slugs only |
| `/robots.txt` | `src/app/robots.ts` | Crawl rules (`allow: /`) |
| `not-found` | `src/app/not-found.tsx` | Playmates 404 (Home + Sessions) |

Canonical map: [`docs/template/PAGES.md`](../../../docs/template/PAGES.md).

---

## Important directories

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js routes (no `api/` in this prototype) |
| `src/sections/` | Page sections, one folder per page |
| `src/components/jabkit/` | Installed JabKit source only |
| `src/modules/layout/` | Header, footer, navigation |
| `src/modules/providers/` | Redux, TanStack Query, next-themes providers |
| `src/hooks/` | Public fetchers (`use-public-*`) |
| `src/lib/playmates.ts` | Adapter over `@fe-template/mocks` |
| `src/constants/` | `routes.ts`, `seo.ts`, `navigation.ts` |
| `src/store/` | Redux store and theme slice |
| `public/images/` | Brand and marketing image assets |

---

## Shared packages consumed

- `@fe-template/ui` — shared UI primitives.
- `@fe-template/mocks` — Playmates prototype data. See [`packages/mocks/docs/README.md`](../../../packages/mocks/docs/README.md).

---

## External services

None in the prototype. Public visibility filtering happens in `@fe-template/mocks` (`src/public.ts`). Shared mock state with admin lives in `packages/mocks/.data/store.json`.

---

## Environment variables

| Variable | Purpose | Required? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute origin for sitemap / metadata (falls back to `http://localhost:9000`) | Recommended |

---

## Scripts

| Script | Command | Purpose |
|---|---|---|
| Dev | `pnpm --filter web dev` | Start dev server on port 9000 |
| Build | `pnpm --filter web build` | Production build |
| Start | `pnpm --filter web start` | Start built app on port 9000 |
| Type check | `pnpm --filter web typecheck` | `tsc --noEmit` |
| Lint | `pnpm --filter web lint` | ESLint |
| Storybook | `pnpm --filter web storybook` | Storybook on port 6006 |

---

## Local docs

- `apps/web/docs/architecture.md` — rendering and data flow
- `apps/web/docs/development.md` — local setup and debugging
- `apps/web/docs/patterns.md` — concrete patterns and file references

---

## Common task routing

| Task | Read next |
|---|---|
| New page | `apps/web/docs/patterns.md`, `docs/template/PAGES.md` |
| New section | `apps/web/docs/patterns.md`, `docs/template/COMPONENTS.md` |
| Public data / mocks | `packages/mocks/docs/README.md`, `ROADMAP/11-handoff-to-real-data.md` |
| Styling | `docs/styling-and-design-system.md` |
| State | `docs/state-management.md` |

### Calendar hero

The home hero adapts the CLI-installed JabKit `fullscreen-calendar` layout in `src/sections/home/hero/`. Registry files remain pristine: the domain adaptation adds session buttons, removes editing controls, and keeps a seven-column grid on mobile. The server supplies the current Asia/Manila date; empty months stay empty. Session events open a dialog, and selecting a game changes the dialog to game details with a Back to session button. Camera Side A/B are independent of Team 1/2. Each view embeds YouTube and exposes its Google Drive link, including multiple recording parts. `calendar-data.ts` projects public sessions/games to display-only props and normalizes YouTube links. Club and per-set scores are optional; existing admin forms do not yet collect them.
