# Playmates ni José

Badminton video archive and publishing app for José: a public browse site plus a private admin dashboard.

This repository is implemented on [fe-multi-web-template](https://github.com/jose-codegourmet/fe-multi-web-template) (pinned overlay: `52fc5a0d2a8edc5beaadf569ff485142c643d64f`). The bundled starter UI and Prisma schema are still the template’s **PawPair** example until a later rebrand.

Product and domain source of truth: [`docs/README.md`](docs/README.md) (numbered folders `00-foundation` … `10-decisions`). How to code in this monorepo: the same `docs/` tree’s engineering files plus each app/package `AGENTS.md`.

## Product in brief

- **Public site** — browse sessions, games, participants, venues/courts, and published YouTube/Google Drive links.
- **Admin dashboard** — manage players, venues, sessions, games, recordings, upload/publishing jobs, and generated Facebook post copy.
- **Media rule** — do not store raw video in Supabase Storage or the application database. Metadata only; bytes go to Google Drive and YouTube.
- **Facebook** — generate copy in-app; posting to the group is a manual final step for MVP.

The data model must allow any number of recordings per game (Side A / Side B / extra parts), not a fixed pair of files.

## Monorepo structure

```text
playmates-ni-jose/
├── apps/
│   ├── web/                 # Public site (Next.js, port 9000) — PawPair starter for now
│   └── admin/               # Admin portal (Next.js, port 9001) — PawPair starter for now
├── packages/
│   ├── ui/                  # Shared UI primitives (@fe-template/ui)
│   ├── db/                  # Prisma client + schema (@fe-template/db)
│   └── config/              # Shared config (@fe-template/config)
├── docs/
│   ├── 00-foundation/ … 10-decisions/   # Playmates product SoT
│   ├── template/            # Human-facing template docs
│   ├── llm/                 # AI agent context (CONTEXT, PATTERNS, PROMPTS)
│   └── about-example-site/  # PawPair brand (starter only)
└── turbo.json
```

| Workspace | Package name | Purpose |
| --- | --- | --- |
| [`apps/web`](apps/web/README.md) | `web` | Public site |
| [`apps/admin`](apps/admin/README.md) | `admin` | Admin portal |
| [`packages/ui`](packages/ui/README.md) | `@fe-template/ui` | Shared shadcn/Base UI primitives |
| [`packages/db`](packages/db/README.md) | `@fe-template/db` | Prisma schema, migrations, seed, and shared `prisma` client |
| `packages/config` | `@fe-template/config` | Placeholder for shared config |

---

## Stack

| Layer | Choice |
| --- | --- |
| Monorepo | pnpm workspaces + Turborepo 2 |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui (`base-nova` style) on Base UI |
| Database | Prisma 6 + Supabase Postgres |
| Auth | Supabase Auth (`@supabase/ssr`) — admin only |
| State | Redux Toolkit, TanStack Query (web) |
| Tables / charts | TanStack Table, Recharts |
| Motion | Framer Motion (scroll-reveal only) |
| Docs / UI kit | Storybook 10 (config in `apps/web/.storybook`) |
| Lint / format | Biome |
| Tests | Vitest (Storybook test runner in `apps/web` only; see [`docs/testing.md`](docs/testing.md)) |
| Git hooks | Husky, lint-staged, commitlint (Conventional Commits) |

---

## Prerequisites

- **Node.js 24** — pinned in [`.nvmrc`](.nvmrc)
- **pnpm** — see `packageManager` in [`package.json`](package.json)
- A **Supabase** project (Postgres + Auth) for the database and admin login

---

## Quick start

```bash
nvm use
pnpm install
cp .env.example .env                              # fill in your Supabase values
cp packages/db/.env.example packages/db/.env      # Prisma CLI reads this
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
pnpm --filter @fe-template/db db:generate         # generate the Prisma client
pnpm dev                                          # web :9000 + admin :9001 via Turbo
```

To run a single app:

```bash
pnpm --filter web dev            # http://localhost:9000
pnpm --filter admin dev          # http://localhost:9001
pnpm --filter web storybook      # http://localhost:6006
```

First-time database setup and admin login are covered in [`packages/db/README.md`](packages/db/README.md) and [`apps/admin/README.md`](apps/admin/README.md).

---

## Root scripts

| Script | Runs |
| --- | --- |
| `pnpm dev` | `turbo run dev` — web (9000) and admin (9001) together |
| `pnpm build` | `turbo run build` — production build of every workspace |
| `pnpm start` | `turbo run start` — start built apps |
| `pnpm typecheck` | `turbo run typecheck` — TypeScript across all workspaces |
| `pnpm lint` | `biome check .` across the repo |
| `pnpm lint:apps` | `turbo run lint` — per-app ESLint (Next.js rules) |
| `pnpm format` | `biome format --write .` |
| `pnpm build-storybook` | `turbo run build-storybook` — static Storybook build |
| `pnpm db:generate` | `turbo run db:generate` — Prisma client generation |

Database-specific scripts live in [`packages/db`](packages/db/README.md) and run via `pnpm --filter @fe-template/db <script>`.

Makefile shortcuts: `make dev`, `make build`, `make storybook`, `make fix`, `make fix-unsafe`. All support `FILTER=<workspace>`.

---

## Documentation

| Path | Purpose |
| --- | --- |
| [`docs/README.md`](docs/README.md) | Combined product + template documentation index |
| [`docs/FILE_INDEX.md`](docs/FILE_INDEX.md) | Product file list plus template engineering paths |
| [`AGENTS.md`](AGENTS.md) | Agent routing and validation |
| [`apps/web/README.md`](apps/web/README.md) | Public site: entry points, scripts |
| [`apps/admin/README.md`](apps/admin/README.md) | Admin portal: features, Supabase auth setup |
| [`packages/ui/README.md`](packages/ui/README.md) | Shared primitives |
| [`packages/db/README.md`](packages/db/README.md) | Prisma + Supabase |

---

## Commits

Husky runs Biome on staged files pre-commit, and commitlint enforces [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(sections): add hero to pricing page
fix(admin): correct posts table sort order
docs(db): document pooled connection string
```
