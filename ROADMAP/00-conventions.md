# Agent conventions (read before any ticket)

If a later ticket contradicts this file, this file wins except where a ticket explicitly says “override conventions for this ticket only”.

## Repository facts

- Monorepo: pnpm workspaces + Turborepo.
- Apps: `apps/web` (port 9000), `apps/admin` (port 9001).
- Shared UI primitives today: `@fe-template/ui` (shadcn / Base UI).
- Shared Prisma today: `@fe-template/db` — **PawPair models. Do not extend them for Playmates.**
- Lint: Biome at root (`pnpm lint`). Each app also has ESLint (`pnpm --filter web lint`).
- Pages in `apps/web` are thin shells. JSX lives in `apps/web/src/sections/<page>/<section>/`.
- Admin dashboard pages live under `apps/admin/src/app/(dashboard)/`. Client tables/forms sit next to the page.

## UI boundary (hybrid — confirmed)

| Surface | Library | How you get it |
|---|---|---|
| Public site marketing/visual blocks (hero, gallery, footer, navbar, count-up, cards with motion) | **JabKit** | `npx @jabkit/cli add <name>` from **inside `apps/web`** |
| Admin primitives (tables, forms, dialogs, sheets, sidebar, command palette, progress, empty, file uploader, skeleton) | **`@fe-template/ui`** | `import { Button, DataTable, Form } from "@fe-template/ui"` |
| Domain widgets (recording board, matchup editor, upload matrix, Facebook preview) | **App-local** | `apps/admin/src/modules/...` or `apps/web/src/sections/...` composed on top of the two libraries |

### Before creating any visual UI

1. Search JabKit catalogue: `https://jabkit.joseadrianbuctuanon.dev/r/index.json` or the names in [`05-phase-2-component-library.md`](05-phase-2-component-library.md).
2. If it is a generic admin control, search `@fe-template/ui` (`packages/ui/src/components/`).
3. Only then write a domain component.
4. Never copy a JabKit atom into `packages/ui`. Never recreate `apps/*/src/components/ui/`.

### Carved exception: `apps/web/src/components/jabkit/`

[`docs/llm/PATTERNS.md`](../docs/llm/PATTERNS.md) says “never create `apps/*/src/components/` for something shared”. JabKit’s CLI **must** write there. That is the only allowed `src/components` tree in `apps/web`. Do not put Playmates domain components in that folder. Ticket PNJ-008 documents the exception in `docs/frontend-conventions.md`.

Admin must **not** run `jabkit init`. Admin stays on `@fe-template/ui`.

## JabKit CLI skill (mandatory)

Treat the JabKit CLI as a skill. Do not hand-copy components from `https://github.com/jose-codegourmet/jabkit`.

### Facts (verified 2026-09-12)

- npm package: `@jabkit/cli@0.1.2`
- bin name: `jabkit`
- Published registry: `https://jabkit.joseadrianbuctuanon.dev` (`/r/index.json` returns HTTP 200)
- CLI requires `jabkit.config.json` in `process.cwd()`. **Always `cd apps/web` first.**
- `jabkit init` writes:
  - `apps/web/jabkit.config.json`
  - `.github/skills/jabkit-component/SKILL.md` **relative to cwd** → `apps/web/.github/skills/jabkit-component/SKILL.md`
  - appends `## UI components (JabKit)` to `AGENTS.md` **relative to cwd** → `apps/web/AGENTS.md` (creates if missing)
- `add` fetches `{registry}/r/{name}.json`, walks `registryDependencies`, rewrites `@/components/jabkit` imports to the config alias, unions npm deps, runs `pnpm add` in cwd.
- Without `--force`, existing destination files throw.
- `upgrade` is a stub. Do not use it.

### Init recipe (PNJ-009 — run once)

```bash
cd apps/web
npx @jabkit/cli@0.1.2 init
```

Then **edit** `jabkit.config.json` to this exact shape (do not leave `src/components/jabkit` if you prefer the path below — use this path; it is the CLI default and the exception we documented):

```json
{
  "componentsDir": "src/components/jabkit",
  "alias": "@/components/jabkit",
  "registry": "https://jabkit.joseadrianbuctuanon.dev",
  "formatter": "biome",
  "theme": { "mode": "class", "provider": "next-themes" }
}
```

Add a tsconfig path in `apps/web/tsconfig.json` if `@/*` does not already map to `./src/*` (it does today). Confirm:

```json
"paths": { "@/*": ["./src/*"] }
```

### Add recipe (every JabKit install ticket)

```bash
cd apps/web
npx @jabkit/cli@0.1.2 add <name> --dry-run
npx @jabkit/cli@0.1.2 add <name>
```

Rules:

1. Dry-run first. Read the file list and npm deps. Report overwrite risks in the ticket notes.
2. Install **pristine**. Do not edit files in the same step as `add`.
3. A later step in the same ticket (or the next ticket) may wrap/compose the installed block. Do not rewrite the installed source to remove `--jk-*` tokens.
4. If `add` wants to append `:root` / `.dark` `--jk-*` variables to `apps/web/src/app/globals.css`, stop if PNJ-010 is not done. Token reconciliation comes first.
5. If a file already exists and you are not doing a deliberate refresh, do **not** pass `--force`.
6. Never run `add --all`.
7. After install: `pnpm --filter web typecheck`.

### After `init`, do not hand-edit

- Do not rewrite the generated skill file except to point agents at this ROADMAP.
- If `init` appended a JabKit section to `apps/web/AGENTS.md`, keep it. Also keep the root `AGENTS.md` JabKit policy that PNJ-001 writes.

### Catalogue search (when a ticket says “pick a JabKit block”)

1. Fetch `https://jabkit.joseadrianbuctuanon.dev/r/index.json`.
2. Prefer the **exact name** listed in [`05-phase-2-component-library.md`](05-phase-2-component-library.md).
3. If that name 404s, pick the closest `marketing` or `atoms` entry and record the substitution in the ticket.

## File placement

| Kind | Location | Import |
|---|---|---|
| JabKit installed source | `apps/web/src/components/jabkit/<name>/` | `@/components/jabkit/...` |
| Public page | `apps/web/src/app/<route>/page.tsx` | thin compose only |
| Public section | `apps/web/src/sections/<page>/<section>/` | `@/sections/...` |
| Public chrome | `apps/web/src/modules/layout/` | Header, Footer |
| Public/admin hooks | `apps/<app>/src/hooks/use-<name>/{client,server,query,types}.ts` | per-app |
| Admin page | `apps/admin/src/app/(dashboard)/<route>/page.tsx` | Server Component |
| Admin mutation | colocated `actions.ts` with `"use server"` | calls `packages/mocks` |
| Admin domain widget | `apps/admin/src/modules/<feature>/` | not `packages/ui` |
| Shared primitives | `packages/ui/src/components/<kebab>/` | `@fe-template/ui` — **do not add Playmates domain widgets here** |
| Mock layer | `packages/mocks/` | `@fe-template/mocks` (name in PNJ-011) |

### Naming

- Folders: kebab-case.
- Component files: PascalCase.
- Hooks folders: `use-<name>/`.
- Tickets: `PNJ-###`.
- Routes: the paths in [`docs/06-ui/information-architecture.md`](../docs/06-ui/information-architecture.md). Admin in this repo has **no** `/admin` prefix — the admin app **is** the admin origin. So IA `/admin/sessions` becomes `/sessions` inside `apps/admin`.

## Section-per-page (web)

`page.tsx` only imports sections and metadata. Example:

```tsx
export default function SessionsPage() {
  return (
    <>
      <SessionsHeroSection />
      <SessionsFiltersSection />
      <SessionsGridSection />
    </>
  );
}
```

Each section folder:

```text
apps/web/src/sections/sessions/grid/SessionsGridSection.tsx
apps/web/src/sections/sessions/grid/SessionsGridSection.stories.tsx
apps/web/src/sections/sessions/grid/SessionsGridSection.meta.ts
```

`.usecase.md` is recommended, not required, at the app level.

## Domain component files (admin + shared widgets)

Every new domain component gets:

```text
ComponentName.tsx
ComponentName.types.ts
ComponentName.meta.ts
ComponentName.stories.tsx
```

See [`02-metadata.md`](02-metadata.md) for the `meta.ts` shape. Forms also get `.schema.ts` + `.defaults.ts` (zod). Admin forms use `react-hook-form`. Web forms do **not** add `react-hook-form`.

## Data access in the prototype

```text
page / action  →  packages/mocks repository  →  in-memory Map store
```

- Server Components and Server Actions import `@fe-template/mocks` (or whatever export PNJ-011 sets).
- `"use client"` files receive serializable props or call Server Actions. They do **not** import the in-memory store directly if that store uses Node-only globals — go through actions or a thin client hook that hits an action.
- Do **not** import `prisma` from `@fe-template/db` for Playmates entities.
- Existing PawPair Prisma usage may remain only until PNJ-005 deletes those pages.

## Auth bypass

When `process.env.MOCK_AUTH === "true"`:

- `apps/admin/middleware.ts` treats the request as authenticated.
- `useCurrentUser` / server user helpers return a fake admin `{ id, email, name, role: "ADMIN" }`.
- Supabase client files stay on disk. Do not delete them.

Document `MOCK_AUTH` in `.env.example` (name only, no secrets).

## Brand copy

Replace every user-visible “PawPair” string on routes we keep. After the purge, the remaining chrome is Header, Footer, root layout metadata, admin sidebar label, login page. Product name: **Playmates ni José**. Tagline direction: badminton session archive, not a dating app.

Fonts: you may keep Manrope + Fraunces or switch to a single grotesque + a display serif. Do not introduce a third font family without a ticket.

## Motion

Framer Motion is **scroll-reveal only** on the public site (`ScrollReveal` from `@fe-template/ui` or JabKit’s own reveal). No page transitions, no looping bounce, no autoplay video except a muted decorative hero if a JabKit hero requires it. Honor `prefers-reduced-motion`.

Admin: no decorative motion. Drag/drop is interaction, not decoration.

## Forms

- Admin: `react-hook-form` + `zod` + `@hookform/resolvers` + `@fe-template/ui` `Form*` primitives.
- Web: local state + zod if needed. No RHF.

## Tables

Admin lists use `DataTable` from `@fe-template/ui`. Do not write a raw `<table>` for entity lists.

## Images

- `next/image` for rasters.
- No third-party hotlinked photos in components.
- Placeholder session/player images: solid token background + initials, or files under `apps/web/public/images/` that we add. Do not keep PawPair pet photos on Playmates pages.

## Git / commits

Do not commit unless the human asks. If they ask: Conventional Commits, no `--no-verify`, no force push.

## Forbidden actions

- Creating Prisma Playmates models or running `db:migrate` / `db:push` for this roadmap.
- Uploading bytes to Drive, YouTube, or Supabase Storage.
- `npx jabkit add --all`.
- `jabkit init` at the monorepo root (wrong `AGENTS.md` / wrong config cwd).
- Installing JabKit into `apps/admin`.
- Adding Jabkit as an npm workspace package and importing from it. Source-copy via CLI only.
- Using the npm package named `openspec` (0.0.0). Use `@fission-ai/openspec`.
- Storing OAuth refresh tokens anywhere.
- Hard-deleting players that appear in the seed history — archive flag only.
- Inferring Team 1 / Team 2 from camera Side A / Side B.
- Enforcing “exactly two recordings per game” in UI or types.
- Pretending a browser `File` survives a full reload. Show “reselect file” when the mock job needs bytes and the handle is gone.
- Introducing a second component library (MUI, Chakra, Jabkit-as-npm, etc.).
- Editing `ROADMAP/` to weaken these rules while implementing tickets.

## Validation commands

| Concern | Command |
|---|---|
| Whole-repo lint | `pnpm lint` |
| Lint fix | `pnpm lint:fix` |
| Typecheck all | `pnpm typecheck` |
| Web | `pnpm --filter web typecheck` and `pnpm --filter web lint` |
| Admin | `pnpm --filter admin typecheck` and `pnpm --filter admin lint` |
| Mocks package | `pnpm --filter @fe-template/mocks typecheck` (after PNJ-011) |
| Dev web | `pnpm --filter web dev` → http://localhost:9000 |
| Dev admin | `pnpm --filter admin dev` → http://localhost:9001 |

Do not run `pnpm build` on every ticket. Phase 7 tickets do.

## When docs disagree with code

Implementation wins. After you change behavior, update the nearest `AGENTS.md` or app doc in the same ticket if the ticket lists that path under **Edit**. Product docs in `docs/00-foundation`–`docs/10-decisions` stay as the product truth; do not “fix” them to match a shortcut you took.
