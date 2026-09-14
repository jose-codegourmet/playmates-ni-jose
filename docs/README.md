# Playmates ni José — Documentation

This folder is the source of truth for **Playmates ni José** (product/domain) and for **how to work in this monorepo** (template engineering docs from [fe-multi-web-template](https://github.com/jose-codegourmet/fe-multi-web-template)).

**Which docs to read**

- **Product, domain, schema, workflows, ADRs** → numbered folders `00-foundation` … `10-decisions` (and [`FILE_INDEX.md`](FILE_INDEX.md)).
- **How to code in this monorepo** (commands, conventions, UI primitives, Prisma starter) → the engineering files below, `docs/llm/`, `docs/template/`, and each app/package `AGENTS.md`.

Do not read every file for every task.

The product has two surfaces:

1. **Public site** — lets players and viewers browse sessions, games, participants, venues/courts, and published YouTube/Google Drive links.
2. **Private admin dashboard** — lets José manage players, venues, sessions, games, recordings, upload/publishing jobs, and generated Facebook post copy.

## Core product idea

José normally records badminton games from two phones:

- **Side A** — one camera/view.
- **Side B** — the other camera/view.

A game usually has one Side A recording and one Side B recording, but the data model **must not assume exactly two files**.

Examples:

- Game 1 → Side A = 1 file, Side B = 1 file
- Game 2 → Side A = 1 file, Side B = 2 files because recording was interrupted
- Game 3 → only one recording exists
- Game 4 → Side A = 3 parts, Side B = 1 part

The app should make these cases easy instead of treating them as errors.

## Critical architecture rule

**Do not store raw video files in Supabase Storage or the application database.**

The application stores only metadata such as:

- players
- courts/venues
- sessions
- games
- team/player assignments
- recording metadata
- Google Drive file/folder IDs and URLs
- YouTube video IDs and URLs
- publish status
- generated Facebook post text
- timestamps and errors

The actual large video files are uploaded to:

- **Google Drive**
- **YouTube**

## Facebook

The Facebook Group portion should be treated as a **manual final step** unless an official Meta API supported by the account/app becomes available.

The app should still generate a complete Facebook-ready post per game containing:

- game label/title
- player names
- YouTube links
- Google Drive links
- optional notes
- optional hashtags

The admin can copy the generated content and manually upload/post the game videos to the Facebook Group.

## How an implementation agent should use these docs

Before coding:

1. Read the repository's [`AGENTS.md`](../AGENTS.md).
2. Use this file to pick the next documents (product vs monorepo).
3. For product work, start with:
   - [`01-product/`](01-product/) (business rules and roles — there is no `product-overview.md`)
   - [`02-domain/domain-model.md`](02-domain/domain-model.md)
   - [`03-data/database-schema.md`](03-data/database-schema.md)
   - [`04-workflows/session-to-publish.md`](04-workflows/session-to-publish.md)
   - [`05-integrations/google-drive.md`](05-integrations/google-drive.md)
   - [`05-integrations/youtube.md`](05-integrations/youtube.md)
   - [`06-ui/information-architecture.md`](06-ui/information-architecture.md)
4. For UI primitives, follow the hybrid rule in the amended [`10-decisions/ADR-006-jabkit-first.md`](10-decisions/ADR-006-jabkit-first.md): JabKit for public-site visual/marketing blocks (`@jabkit/cli` → `apps/web/src/components/jabkit`); `@fe-template/ui` for admin and all form/table primitives; domain widgets stay app-local. Operational detail: [`ROADMAP/00-conventions.md`](../ROADMAP/00-conventions.md).
5. Do not replace established monorepo conventions without a documented reason.
6. Create a plan before implementing a large feature.

Starter apps still ship **PawPair** marketing content and Prisma models. Playmates schema and routes are not implemented yet.

## Product documentation map

- `00-foundation/` — goals, scope, terminology, assumptions
- `01-product/` — business/product behavior
- `02-domain/` — domain entities and rules
- `03-data/` — suggested Supabase schema and security
- `04-workflows/` — end-to-end admin workflows
- `05-integrations/` — Google/YouTube/Facebook integration boundaries
- `06-ui/` — public/admin UX, [brand identity](06-ui/branding.md) (Jabkit notes remain; implementation uses `@fe-template/ui`)
- `07-engineering/` — product architecture, uploads, jobs, errors, observability
- `08-implementation/` — phased delivery plan and acceptance criteria
- `09-ai-prompts/` — prompts for coding agents
- `10-decisions/` — important architectural decisions

Full product file list: [`FILE_INDEX.md`](FILE_INDEX.md).

---

## Start here (monorepo)

1. `/AGENTS.md` — primary navigation and rules for all AI agents.
2. This file — choose product docs or engineering docs based on the task.
3. The relevant app or package `AGENTS.md` and `docs/README.md`.
4. Implementation examples in the relevant app or package.

## Apps and packages

| Workspace | Local docs | Local agent instructions |
|---|---|---|
| `apps/web` | `apps/web/docs/README.md` | `apps/web/AGENTS.md` |
| `apps/admin` | `apps/admin/docs/README.md` | `apps/admin/AGENTS.md` |
| `packages/ui` | `packages/ui/docs/README.md` | `packages/ui/AGENTS.md` |
| `packages/db` | `packages/db/docs/README.md` | `packages/db/AGENTS.md` |
| `packages/mocks` | `packages/mocks/docs/README.md` | `packages/mocks/AGENTS.md` |
| `packages/config` | `packages/config/docs/README.md` | `packages/config/AGENTS.md` |

## Root documentation (monorepo)

| Document | Purpose | Read when |
|---|---|---|
| `docs/architecture.md` | Monorepo architecture, app/package graph, dependency flow, data flow | You need the big picture or are changing cross-app boundaries |
| `docs/repository-structure.md` | Directory layout, workspace names, key config files | You need to know where something lives |
| `docs/development-workflow.md` | All commands, Husky, Biome, commitlint, Makefile shortcuts | You are running, linting, formatting, or type-checking code |
| `docs/frontend-conventions.md` | Pages, sections, components, hooks, forms, routes | You are changing UI code in any app |
| `docs/api-and-data-fetching.md` | TanStack Query, Prisma, Server Actions, API routes | You are adding or changing data fetching |
| `docs/styling-and-design-system.md` | Tailwind 4, design tokens, `@fe-template/ui`, `cn()` | You are changing styles, themes, or shared UI |
| `docs/state-management.md` | Redux, TanStack Query, theme state | You are changing state or providers |
| `docs/environment-variables.md` | Env var names, ownership, pooled vs direct DB URLs | You are adding env vars or configuring services |
| `docs/testing.md` | Vitest, Storybook, test commands | You are adding or running tests |
| `docs/deployment.md` | Build, Vercel, outputs, production commands | You are changing build or deployment behavior |
| `docs/dependency-guidelines.md` | When to add dependencies to root, apps, or packages | You are adding or reorganizing dependencies |
| `docs/documentation-guidelines.md` | How to write and maintain this docs system | You are adding new apps, packages, or docs |

## Template / LLM / example-site docs

| Path | Purpose | Read when |
|---|---|---|
| `docs/llm/CONTEXT.md` | Compact stack and folder map | You need a quick overview of the monorepo |
| `docs/llm/PATTERNS.md` | Required code patterns | You are writing new components, hooks, or pages |
| `docs/llm/PROMPTS.md` | Copy-paste prompts for scaffolding | You are scaffolding a new feature |
| `docs/template/README.md` | Human-facing template guide | You need setup steps or layout conventions |
| `docs/template/PAGES.md` | Web route map and admin route map | You are adding or changing starter routes |
| `docs/template/COMPONENTS.md` | Component folder conventions | You are adding components or sections |
| `docs/template/HOOKS.md` | Hook folder conventions | You are adding a `use-*` hook |
| `docs/component-guide.md` | LLM-oriented component index | You need to pick the right UI primitive |
| `docs/about-example-site/` | PawPair brand/content (starter only) | You are editing the current example marketing site |
| `docs/superpowers/plans/` | Historical template plans | You need context on past template work |
| `docs/superpowers/specs/` | Historical template specs | You need context on past template work |

## Task routing (monorepo)

| Task type | Read first | Then read |
|---|---|---|
| Playmates domain or product rules | `docs/02-domain/`, `docs/01-product/` | Relevant ADRs in `docs/10-decisions/` |
| Playmates schema or RLS | `docs/03-data/` | `packages/db` docs (starter Prisma is still PawPair) |
| Playmates workflows | `docs/04-workflows/` | `docs/05-integrations/` |
| Playmates public/admin IA | `docs/06-ui/` | `docs/frontend-conventions.md` |
| Playmates brand or visual identity | `docs/06-ui/branding.md` | `docs/styling-and-design-system.md` |
| Repository architecture | `docs/architecture.md` | Relevant app or package docs |
| App feature (starter code) | `docs/frontend-conventions.md`, `docs/api-and-data-fetching.md` | `apps/<app>/AGENTS.md` → `apps/<app>/docs/README.md` |
| Shared UI primitive | `docs/frontend-conventions.md`, `docs/styling-and-design-system.md` | `packages/ui/AGENTS.md` → `packages/ui/docs/README.md` |
| Database change (starter Prisma) | `docs/api-and-data-fetching.md`, `packages/db/docs/development.md` | `packages/db/AGENTS.md` |
| Testing | `docs/testing.md` | Relevant app docs |
| Deployment | `docs/deployment.md` | Relevant app docs |
| Documentation | `docs/documentation-guidelines.md` | `docs/templates/` |

## Documentation templates

| Template | Path |
|---|---|
| App documentation | `docs/templates/app-documentation-template.md` |
| Package documentation | `docs/templates/package-documentation-template.md` |
| Local `AGENTS.md` | `docs/templates/local-agents-template.md` |
