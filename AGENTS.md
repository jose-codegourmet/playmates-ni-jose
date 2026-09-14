# Agent Instructions — Playmates ni José

Primary navigation for AI coding agents working in this monorepo. Read this file first, then follow the routing below. Do not load every document for every task.

---

## Repository Purpose

This checkout is **Playmates ni José**, a badminton video archive and publishing app, implemented on [fe-multi-web-template](https://github.com/jose-codegourmet/fe-multi-web-template) (overlay SHA `52fc5a0d2a8edc5beaadf569ff485142c643d64f`). The public site and admin portal now render the Playmates prototype. `@fe-template/db` Prisma models are still the template **PawPair** schema — do not treat them as Playmates entities.

The stack is a **pnpm workspaces + Turborepo** monorepo that pairs a public site with a private admin portal. Both apps are Next.js 16 with React 19, Tailwind CSS 4, and shadcn/Base UI primitives. Shared packages supply the UI library (`@fe-template/ui`), the Prisma client (`@fe-template/db`, leftover PawPair models only), and the prototype data layer (`@fe-template/mocks`).

### Prototype data (current source of truth)

- Playmates pages and Server Actions read and write **`packages/mocks`** (`@fe-template/mocks`). Do not import `prisma` for sessions, games, players, venues, recordings, or posts.
- Shared state across `apps/web` (9000) and `apps/admin` (9001) is `packages/mocks/.data/store.json` (metadata only; no video bytes).
- Wiring Prisma / Drive / YouTube is **owner work**, not prototype work. Follow [`ROADMAP/11-handoff-to-real-data.md`](ROADMAP/11-handoff-to-real-data.md). The seam is `getPlaymatesRepos()`.

Public routes and admin session workspace paths: [`docs/template/PAGES.md`](docs/template/PAGES.md).

### Known conflicts (scaffold)

- Product docs in `docs/00-foundation`–`docs/10-decisions` remain the product spec; running apps implement them via mocks, not Prisma.
- [`docs/03-data/`](docs/03-data/) is the intended Playmates schema; `packages/db` still has the template PawPair Prisma models. **Prisma does not have Playmates models.**
- [`docs/10-decisions/ADR-006-jabkit-first.md`](docs/10-decisions/ADR-006-jabkit-first.md) is **Amended** (2026-09-12) to a hybrid UI boundary: public-site visual/marketing blocks use JabKit via `@jabkit/cli` into `apps/web/src/components/jabkit`; admin and all form/table primitives stay on `@fe-template/ui`; domain widgets stay app-local; do not add JabKit as an npm workspace package. See [`ROADMAP/00-conventions.md`](ROADMAP/00-conventions.md).

- Apps: `apps/web` (port 9000), `apps/admin` (port 9001)
- Packages: `packages/ui` (`@fe-template/ui`), `packages/db` (`@fe-template/db`), `packages/mocks` (`@fe-template/mocks`), `packages/config` (`@fe-template/config`)
- Auth: Supabase Auth + `@supabase/ssr` in `apps/admin` only
- Database: Prisma 6 on Supabase Postgres (PawPair leftover schema only; Playmates data is `packages/mocks`)
- Lint/Format: Biome at root; ESLint flat config in each app
- Tests: Vitest + Storybook in `apps/web`; Storybook only in `apps/admin`

---

## Mandatory Reading Order

1. Read this file (`/AGENTS.md`).
2. Read the relevant root documentation in `docs/` (use the routing table below).
3. Determine the affected app or package.
4. Read that app or package's local `AGENTS.md`, then its `docs/README.md`.
5. Inspect nearby implementation examples before creating new code.
6. Create a plan before modifying code.
7. Run the required validation commands after implementation.

---

## Context-Based Documentation Routing

| Task type | Read first | Then read |
|---|---|---|
| Repository architecture, dependency flow, or cross-app refactor | `docs/architecture.md` | Affected app/package docs |
| Repository structure, workspace layout, or naming conventions | `docs/repository-structure.md` | Affected local docs |
| Development workflow, commands, or tooling | `docs/development-workflow.md` | Affected app/package docs |
| Frontend conventions (pages, sections, components, hooks) | `docs/frontend-conventions.md` | `apps/<app>/docs/patterns.md` |
| API integration, data fetching, Server Actions, or React Query | `docs/api-and-data-fetching.md` | Affected app/package docs |
| Styling, design tokens, or shared UI primitives | `docs/styling-and-design-system.md` | `packages/ui/docs/README.md` |
| Testing or Storybook | `docs/testing.md` | Relevant app docs |
| Environment variables or secrets handling | `docs/environment-variables.md` | Affected app/package docs |
| Deployment or production builds | `docs/deployment.md` | Affected app docs |
| Dependency choices or shared-package design | `docs/dependency-guidelines.md` | Affected package docs |
| App-specific task | `docs/frontend-conventions.md` and `docs/api-and-data-fetching.md` | `apps/<app>/AGENTS.md` → `apps/<app>/docs/README.md` |
| Package-specific task | `docs/dependency-guidelines.md` and `docs/api-and-data-fetching.md` | `packages/<package>/AGENTS.md` → `packages/<package>/docs/README.md` |
| Cross-app task | `docs/architecture.md` | Every affected `apps/<app>/AGENTS.md` and local docs |
| Playmates domain or product rules | `docs/02-domain/` | `docs/01-product/`, `docs/00-foundation/` |
| Playmates schema, indexes, or RLS | `docs/03-data/` | Intended schema only — `packages/db` Prisma is still PawPair. Prototype data: `packages/mocks` |
| Swap mocks for Prisma / real uploads | `ROADMAP/11-handoff-to-real-data.md` | `packages/mocks/docs/README.md` |
| Playmates admin/public workflows | `docs/04-workflows/` | `docs/05-integrations/` |
| Playmates UI information architecture | `docs/06-ui/` | `docs/frontend-conventions.md` |
| Playmates brand, tokens, or visual identity | `docs/06-ui/branding.md` | `docs/styling-and-design-system.md` |
| Playmates architectural decisions | `docs/10-decisions/` | Relevant product/engineering docs |
| Playmates capability behavior | `openspec/specs/<capability>/spec.md` then `docs/01-product/` | |

For the full documentation index, see `docs/README.md`. Product file list: `docs/FILE_INDEX.md`.

---

## Scope Rules

- Read only the documentation relevant to the current task.
- Avoid loading every documentation file unnecessarily.
- Prefer existing patterns over creating new abstractions.
- Search for existing packages before building duplicate functionality.
- Preserve public APIs unless the task explicitly requires a breaking change.
- Update documentation when architecture, commands, or behavior changes.
- Avoid editing unrelated apps or packages.
- Ask for clarification only when a material requirement cannot be inferred from the repository or the task.
- Do not expose secret values from environment files. Document variable names only.
- When documentation disagrees with implementation, treat the implementation as the current source of truth and record the inconsistency.

---

## Validation Rules

Run the commands that apply to the scope of your change. Always run at least lint and type-check before claiming a task is complete.

| Concern | Repository-wide | Scoped to one app/package |
|---|---|---|
| Install | `pnpm install` | — |
| Dev | `pnpm dev` | `pnpm --filter web dev` / `pnpm --filter admin dev` |
| Build | `pnpm build` | `pnpm --filter web build` / `pnpm --filter admin build` |
| Lint (Biome) | `pnpm lint` | `pnpm lint` (Biome scans the whole repo); `pnpm --filter @fe-template/ui lint` |
| Lint fix (Biome) | `pnpm lint:fix` | `pnpm lint:fix` |
| Format | `pnpm format` | `pnpm format` |
| App lint (ESLint) | `pnpm lint:apps` | `pnpm --filter web lint` / `pnpm --filter admin lint` |
| Type check | `pnpm typecheck` | `pnpm --filter <name> typecheck` |
| Storybook | `pnpm storybook` | `pnpm --filter web storybook` / `pnpm --filter admin storybook` |
| DB generate | `pnpm db:generate` | `pnpm --filter @fe-template/db db:generate` |
| DB migrate | — | `pnpm --filter @fe-template/db db:migrate` |
| DB seed | — | `pnpm --filter @fe-template/db db:seed` |
| DB studio | — | `pnpm --filter @fe-template/db db:studio` |

Makefile shortcuts also exist: `make dev`, `make build`, `make storybook`, `make fix`, `make fix-unsafe`. All support `FILTER=<workspace>`.

---

## Documentation Maintenance

Update documentation whenever you change the corresponding surface area:

- Root docs (`docs/`) — when repository-wide architecture, commands, or conventions change.
- App docs (`apps/<app>/docs/`) — when app-specific behavior, routes, structure, or env vars change.
- Package docs (`packages/<package>/docs/`) — when exported APIs, usage patterns, or commands change.
- Local `AGENTS.md` — when the scope, entry points, or validation rules of an app/package change.

---

## Quick Reference

| Workspace | Filter | Port |
|---|---|---|
| `apps/web` | `web` | 9000 |
| `apps/admin` | `admin` | 9001 |
| `packages/ui` | `@fe-template/ui` | — |
| `packages/db` | `@fe-template/db` | — |
| `packages/mocks` | `@fe-template/mocks` | — |
| `packages/config` | `@fe-template/config` | — |

Key docs:
- `docs/README.md` — combined product + monorepo documentation index
- `docs/FILE_INDEX.md` — numbered product docs plus template engineering paths
- `docs/02-domain/domain-model.md` — Playmates domain
- `docs/03-data/database-schema.md` — intended Playmates schema (not in Prisma; prototype uses `packages/mocks`)
- `ROADMAP/11-handoff-to-real-data.md` — owner handoff from mocks to real data
- `docs/template/PAGES.md` — public routes and admin session workspace paths
- `docs/10-decisions/` — product ADRs
- `docs/llm/CONTEXT.md` — compact stack and folder map
- `docs/llm/PATTERNS.md` — required code patterns
- `docs/template/README.md` — human-facing template guide
- `docs/component-guide.md` — component usage index
