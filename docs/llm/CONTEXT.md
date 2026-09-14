# Agent Context — Playmates ni José

Concise context for AI agents working in this repository. The checkout is a Playmates prototype on the fe-multi-web-template scaffold.

---

## Stack

| Layer | Tech |
| --- | --- |
| Monorepo | pnpm workspaces + Turborepo |
| Framework | Next.js 16 App Router (two apps: `web`, `admin`) |
| UI | shadcn/ui on Base UI via `@fe-template/ui`; public visual blocks via JabKit in `apps/web/src/components/jabkit`; Tailwind CSS 4 |
| Database | Prisma 6 + Supabase Postgres in `@fe-template/db` — **still PawPair models. No Playmates Prisma schema.** |
| Auth | Supabase Auth (`@supabase/ssr`) — admin only; `MOCK_AUTH=true` bypass |
| State | Redux Toolkit (`themeSlice`, web) |
| Theme | next-themes (DOM), Redux source of truth |
| Data | Playmates: `@fe-template/mocks` (`getPlaymatesRepos`, public helpers). Shared disk: `packages/mocks/.data/store.json`. Owner swap: [`ROADMAP/11-handoff-to-real-data.md`](../../ROADMAP/11-handoff-to-real-data.md) |
| Motion | Framer Motion (scroll-reveal only) |
| Docs | Storybook co-located with components |
| Lint | Biome, Husky, commitlint |

---

## Folder Map

```text
apps/web/src/               ← public archive (port 9000)
├── app/                    ← 8 public routes (section composition only)
├── sections/               ← home, sessions, game-detail, players, venues, …
├── components/jabkit/      ← installed JabKit only
├── constants/              ← routes.ts, seo.ts, navigation.ts
├── hooks/                  ← use-public-sessions|games|players|venues
├── lib/playmates.ts        ← @fe-template/mocks public helpers
├── modules/layout/         ← header, footer
├── modules/providers/      ← Redux + Query + theme
└── store/                  ← Redux store + themeSlice

apps/admin/src/             ← admin portal (port 9001)
├── app/(dashboard)/        ← dashboard, sessions workspace, players, venues, settings
├── app/(dashboard)/sessions/[id]/
│   ├── details|players|import|organize|matchups|upload|publish/
├── app/login/              ← Supabase sign-in (skipped when MOCK_AUTH=true)
├── lib/playmates.ts        ← getPlaymatesRepos from @fe-template/mocks
├── lib/supabase/           ← browser + server clients
└── modules/playmates/      ← domain widgets (organize, upload, publish, …)

packages/ui/src/            ← @fe-template/ui — shared primitives
├── components/<kebab>/     ← shadcn/Base UI components
├── lib/utils.ts            ← cn()
└── index.ts                ← barrel: every public export

packages/db/                ← @fe-template/db — Prisma client (PawPair leftover)
├── prisma/schema/*.prisma  ← user, pet, post, marketing — NOT Playmates
├── prisma/seed.ts
└── src/client.ts           ← prisma singleton (profile/auth only)

packages/mocks/             ← @fe-template/mocks — Playmates prototype data
├── src/memory/             ← in-memory repos
├── src/public.ts           ← public visibility helpers
├── src/store.ts            ← persist to .data/store.json
└── docs/README.md

packages/config/            ← @fe-template/config — PlaymatesComponentMeta
```

Route map: [`docs/template/PAGES.md`](../template/PAGES.md). Mock package: [`packages/mocks/docs/README.md`](../../packages/mocks/docs/README.md). Real-data handoff: [`ROADMAP/11-handoff-to-real-data.md`](../../ROADMAP/11-handoff-to-real-data.md).

Reference docs:

```text
docs/02-domain/                            ← Playmates domain
docs/03-data/                              ← intended schema (not in Prisma)
docs/template/                             ← Human-facing docs (PAGES route map)
docs/llm/                                  ← This folder
ROADMAP/00-conventions.md                  ← Agent conventions
ROADMAP/11-handoff-to-real-data.md         ← Owner: mocks → Prisma / Drive / YouTube
```

---

## Key Imports

```ts
import { Button, Card, ScrollReveal, cn } from "@fe-template/ui";   // shared primitives
import { getPlaymatesRepos, listPublicSessions } from "@fe-template/mocks";
import { HomeHeroSection } from "@/sections/home/hero/HomeHeroSection";
// Do not import prisma for Playmates entities. @fe-template/db is still PawPair.
```

---

## How to Add Things

| Task | Location | Files |
| --- | --- | --- |
| New web page | `apps/web/src/app/[route]/page.tsx` + `apps/web/src/sections/[page]/` | `page.tsx` composes sections only |
| New section | `apps/web/src/sections/[page]/[section]/` | `.tsx` + `.stories.tsx` + `.usecase.md`; add `.schema.ts` + `.defaults.ts` only if it is a form |
| New shared primitive | `packages/ui/src/components/[name]/` | `.tsx` + `.stories.tsx` + `.usecase.md`, plus an export line in `packages/ui/src/index.ts` |
| New admin page | `apps/admin/src/app/(dashboard)/[route]/page.tsx` | Server Component + `actions.ts` calling `@fe-template/mocks` |
| Playmates data change | `packages/mocks/` | Types, seed, repos, `store.json`. **Do not** add Playmates models to Prisma |
| Swap mocks → Prisma | `ROADMAP/11-handoff-to-real-data.md` | Owner work only — keep `getPlaymatesRepos()` as the seam |
| New hook | `apps/<app>/src/hooks/use-[name]/` | `client.ts` (React Query) + `server.ts` (server prefetch) |
| New route constant | `apps/web/src/constants/routes.ts` | Add to `ROUTES` object |
| New SEO entry | `apps/web/src/constants/seo.ts` | Add page metadata |

---

## Brand & Content Summary

### 1. Playmates ni José — Product

Badminton session archive and publishing app. Public visitors watch published sessions and games. Admins organize recordings, simulate Drive/YouTube uploads, and copy Facebook drafts.

`apps/web` has no auth. Playmates data is **`@fe-template/mocks`**, not Prisma. `packages/db` remains the template PawPair schema until the owner follows [`ROADMAP/11-handoff-to-real-data.md`](../../ROADMAP/11-handoff-to-real-data.md).

Product domain: [`docs/02-domain/domain-model.md`](../02-domain/domain-model.md). Routes: [`docs/template/PAGES.md`](../template/PAGES.md).

### 2. Branding

Product name: **Playmates ni José**. Guide: [`docs/06-ui/branding.md`](../06-ui/branding.md). Cream `#FCF4C6` + green `#284400`. Display: Figtree (600-900). Body: Manrope. Logo: `Logo` from `@fe-template/ui` (`currentColor` fill). Visual blocks use JabKit `--jk-*` aliases plus `@fe-template/ui`. Do not treat leftover PawPair coral / pet-social copy as product truth.

### 3. Images

Use `next/image`. Prefer token backgrounds + initials or files under `apps/web/public/images/`. Do not keep PawPair pet photos on Playmates pages.

---

## Cleanup Script

Remove unused components from `apps/web` after copying the template:

```bash
python scripts/cleanup-unused.py           # dry-run
python scripts/cleanup-unused.py --delete  # delete unused folders
```

The script does not scan `packages/ui` — prune unused primitives there by hand, removing both the folder and its export line in `packages/ui/src/index.ts`.

---

## Commits

All commits must pass Husky + commitlint. Use Conventional Commits:

```bash
feat(sections): add hero to pricing page
docs(llm): update CONTEXT brand summary
```

---

## Further Reading

- [`docs/template/`](../template/) — Human-facing docs (README, COMPONENTS, HOOKS, PAGES)
- [`PATTERNS.md`](./PATTERNS.md) — Required code patterns
- [`PROMPTS.md`](./PROMPTS.md) — Copy-paste agent prompts
- [`packages/ui/README.md`](../../packages/ui/README.md) — Shared primitives package
- [`packages/db/README.md`](../../packages/db/README.md) — Prisma schema and commands
- [`apps/admin/README.md`](../../apps/admin/README.md) — Admin portal and Supabase auth
