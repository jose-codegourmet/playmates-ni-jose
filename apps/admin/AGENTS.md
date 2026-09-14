# Agent Instructions — `apps/admin`

Local agent instructions for the admin portal. Read `/AGENTS.md` first, then this file.

---

## Scope

`apps/admin` is the internal Playmates portal (session workspace, players, venues, settings). PawPair CRUD pages were removed in PNJ-005. Playmates pages still read `@fe-template/mocks` via `src/lib/playmates.ts`. Prisma in `@fe-template/db` now has the Playmates schema; admin uses it for `Profile` (auth) only until the `getPlaymatesRepos()` swap. Owner swap: [`ROADMAP/11-handoff-to-real-data.md`](../../ROADMAP/11-handoff-to-real-data.md).

Auth: Supabase Auth, or `MOCK_AUTH=true` to bypass the login wall for local demo.

- **Port**: 9001
- **Filter**: `pnpm --filter admin`
- **Package name**: `admin`

---

## Important directories

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js App Router routes |
| `src/app/(dashboard)/` | Dashboard shell and all protected pages |
| `src/app/login/`, `src/app/signup/`, `src/app/otp/`, `src/app/auth/callback/` | Public auth routes |
| `src/app/api/images/route.ts` | Image upload endpoint for Supabase Storage |
| `src/hooks/` | TanStack Query data hook `use-current-user`. Viewport utility `use-mobile.ts` stays a single file. |
| `src/lib/supabase/` | Browser, server, and service-role Supabase clients |
| `src/modules/auth/` | Login, signup, and OTP forms |
| `src/modules/layout/` | AdminSidebar, AdminHeader, sidebar components |
| `src/modules/playmates/dashboard/` | Dashboard widgets (latest sessions, uploads, Facebook, quick create) |
| `src/modules/providers/` | Query client, theme, toaster providers |
| `email-templates/` | Supabase Auth email HTML templates (copied to dashboard) |

---

## Shared packages used

- `@fe-template/ui` — all shared UI primitives (Button, DataTable, Dialog, Form, FileUploader, etc.).
- `@fe-template/mocks` — Playmates prototype data (sessions, games, players, venues, recordings, uploads, posts).
- `@fe-template/db` — Playmates Prisma client. Admin currently uses it for `Profile` / current-user helpers only. Do not query Playmates entities from pages until the repo swap.

---

## Entry points

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Redirects to `/dashboard` |
| `/login` | `src/app/login/page.tsx` | Sign in |
| `/signup` | `src/app/signup/page.tsx` | Sign up |
| `/otp` | `src/app/otp/page.tsx` | OTP confirmation |
| `/auth/callback` | `src/app/auth/callback/route.ts` | Signup email confirmation (PKCE code exchange) |
| `/dashboard` | `src/app/(dashboard)/dashboard/page.tsx` | Playmates dashboard widgets (mock repos) |
| `/sessions` | `src/app/(dashboard)/sessions/page.tsx` | Sessions list (all / draft / published) |
| `/sessions/new` | `src/app/(dashboard)/sessions/new/page.tsx` | Create draft session |
| `/sessions/[id]` | `src/app/(dashboard)/sessions/[id]/page.tsx` | Redirects to `/sessions/[id]/details` |
| `/sessions/[id]/details` | `src/app/(dashboard)/sessions/[id]/details/page.tsx` | Workspace: date, venue, notes |
| `/sessions/[id]/players` | `src/app/(dashboard)/sessions/[id]/players/page.tsx` | Workspace: roster |
| `/sessions/[id]/import` | `src/app/(dashboard)/sessions/[id]/import/page.tsx` | Workspace: import recording metadata |
| `/sessions/[id]/organize` | `src/app/(dashboard)/sessions/[id]/organize/page.tsx` | Workspace: games + recordings |
| `/sessions/[id]/matchups` | `src/app/(dashboard)/sessions/[id]/matchups/page.tsx` | Workspace: Team 1 / Team 2 |
| `/sessions/[id]/upload` | `src/app/(dashboard)/sessions/[id]/upload/page.tsx` | Workspace: mock Drive / YouTube jobs |
| `/sessions/[id]/publish` | `src/app/(dashboard)/sessions/[id]/publish/page.tsx` | Workspace: review, Facebook drafts, publish |
| `/players` | `src/app/(dashboard)/players/page.tsx` | Players list, create/edit dialog, archive |
| `/venues` | `src/app/(dashboard)/venues/page.tsx` | Venues list, create/edit dialog, archive |
| `/venues/[id]` | `src/app/(dashboard)/venues/[id]/page.tsx` | Venue detail, add/archive courts |
| `/settings` | `src/app/(dashboard)/settings/page.tsx` | Settings index (Google + Publishing) |
| `/settings/google` | `src/app/(dashboard)/settings/google/page.tsx` | Google OAuth placeholder (disabled) |
| `/settings/publishing` | `src/app/(dashboard)/settings/publishing/page.tsx` | Facebook Group URL + default hashtags |
| `/profile` | `src/app/(dashboard)/profile/page.tsx` | Admin profile |
| `/api/images` | `src/app/api/images/route.ts` | Upload image to Supabase Storage |

---

## Validation commands

| Concern | Command |
|---|---|
| Dev | `pnpm --filter admin dev` |
| Build | `pnpm --filter admin build` |
| Type check | `pnpm --filter admin typecheck` |
| Lint (ESLint) | `pnpm --filter admin lint` |
| Biome (repo-wide) | `pnpm lint` |
| Storybook | `pnpm --filter admin storybook` |

---

## Restrictions and boundaries

- All routes under `(dashboard)` are protected by `middleware.ts` by session presence only. Unauthenticated `/api/*` requests are not redirected to `/login`; the route handler returns JSON. A TODO in `middleware.ts` notes that `User.role === ADMIN` enforcement is not yet wired.
- `(dashboard)/layout.tsx` is a client component (pathname → header title). There are two 404 files (`app/not-found.tsx` and `(dashboard)/not-found.tsx`) plus `loading.tsx` / `error.tsx` at the app root and `(dashboard)` group. See `apps/admin/docs/architecture.md`.
- `@fe-template/db` and `src/lib/supabase/admin.ts` are server-only. Never import them from client components. Playmates pages still use `@fe-template/mocks` (`src/lib/playmates.ts`). Real-data swap: [`ROADMAP/11-handoff-to-real-data.md`](../../ROADMAP/11-handoff-to-real-data.md).
- Forms use `react-hook-form` + `zod` + `@hookform/resolvers`. Follow the existing `.schema.ts` and `.defaults.ts` pattern in auth modules.
- Shared UI wiring must remain in place: `transpilePackages` in `next.config.ts` and the `@source` directive in `globals.css`.
- The empty directory `src/login/` is not used. Use `src/app/login/`.
- Signup email confirmation uses `/auth/callback` (public middleware route) to exchange the Supabase auth code for a session.

---

## Common task routing

| Task | Read next |
|---|---|
| New CRUD page | `apps/admin/docs/patterns.md`, `docs/api-and-data-fetching.md` |
| New auth flow | `apps/admin/docs/architecture.md`, `docs/api-and-data-fetching.md` |
| New table or dialog | `apps/admin/docs/patterns.md`, `docs/component-guide.md` |
| New form | `docs/frontend-conventions.md`, inspect `src/modules/auth/login-form/` |
| Image upload | `src/lib/upload-image.ts`, `src/app/api/images/route.ts` |
| Playmates data / mocks | `packages/mocks/docs/README.md`, `ROADMAP/11-handoff-to-real-data.md` |
| Database change | `packages/db/AGENTS.md`, `packages/db/docs/development.md` |

---

## Documentation maintenance

Update this file and `apps/admin/docs/` when:
- A new route is added.
- Auth or role enforcement changes.
- A new shared package is consumed.
- A new environment variable is required.
- The validation commands change.
