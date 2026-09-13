# `apps/admin` — Playmates admin portal

Purpose, routes, features, and commands for the admin portal.

---

## Purpose

`apps/admin` is the internal Playmates portal. Admins create sessions, organize games and recordings, simulate Drive/YouTube uploads, generate Facebook drafts, and publish to the public archive. It uses Supabase Auth (or `MOCK_AUTH=true` for local demo).

- **Primary users**: Internal admins
- **Port**: 9001
- **Filter**: `admin`

Playmates data is `@fe-template/mocks` via `src/lib/playmates.ts`. **Prisma does not have Playmates models** (`@fe-template/db` is leftover PawPair, used only for profile / current-user). Owner swap: [`ROADMAP/11-handoff-to-real-data.md`](../../../ROADMAP/11-handoff-to-real-data.md).

---

## Main responsibilities

- Dashboard widgets (latest sessions, unfinished uploads, failed jobs, awaiting Facebook, quick create).
- Session list + create draft.
- Session workspace (details → roster → import → organize → matchups → upload → publish).
- Players and venues (create, edit, archive; venue courts).
- Settings placeholders (Google OAuth disabled; Facebook Group URL + default hashtags).
- Auth (login, signup, OTP) and admin profile.

---

## Technology

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19, `@fe-template/ui`, Tailwind CSS 4 |
| Auth | Supabase Auth via `@supabase/ssr`; `MOCK_AUTH=true` bypass |
| Data | `@fe-template/mocks` (Playmates). Prisma only for leftover profile/user |
| Tables | TanStack Table / `@fe-template/ui` `DataTable` |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` |
| State | TanStack Query + next-themes |

---

## Routes and entry points

There is **no** `/admin` prefix — this app **is** the admin origin.

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Redirects to `/dashboard` |
| `/login` | `src/app/login/page.tsx` | Sign in |
| `/signup` | `src/app/signup/page.tsx` | Sign up |
| `/otp` | `src/app/otp/page.tsx` | OTP confirmation |
| `/auth/callback` | `src/app/auth/callback/route.ts` | Signup email confirmation callback |
| `/dashboard` | `src/app/(dashboard)/dashboard/page.tsx` | Playmates dashboard widgets |
| `/sessions` | `src/app/(dashboard)/sessions/page.tsx` | Sessions list (admin sees drafts) |
| `/sessions/new` | `src/app/(dashboard)/sessions/new/page.tsx` | Create draft session |
| `/players` | `src/app/(dashboard)/players/page.tsx` | Players list, create/edit, archive |
| `/venues` | `src/app/(dashboard)/venues/page.tsx` | Venues list, create/edit, archive |
| `/venues/[id]` | `src/app/(dashboard)/venues/[id]/page.tsx` | Venue courts (add / archive) |
| `/settings` | `src/app/(dashboard)/settings/page.tsx` | Settings index (Google + Publishing) |
| `/settings/google` | `src/app/(dashboard)/settings/google/page.tsx` | Google OAuth placeholder (disabled) |
| `/settings/publishing` | `src/app/(dashboard)/settings/publishing/page.tsx` | Facebook Group URL + default hashtags |
| `/profile` | `src/app/(dashboard)/profile/page.tsx` | Admin profile |
| `/api/images` | `src/app/api/images/route.ts` | Image upload (Supabase Storage leftover) |

### Session workspace paths

`/sessions/[id]` redirects to details. Stepper lives in `[id]/layout.tsx`.

| Route | File | Step |
|---|---|---|
| `/sessions/[id]` | `src/app/(dashboard)/sessions/[id]/page.tsx` | Redirect → details |
| `/sessions/[id]/details` | `src/app/(dashboard)/sessions/[id]/details/page.tsx` | Date, venue, notes |
| `/sessions/[id]/players` | `src/app/(dashboard)/sessions/[id]/players/page.tsx` | Roster |
| `/sessions/[id]/import` | `src/app/(dashboard)/sessions/[id]/import/page.tsx` | Import recording metadata |
| `/sessions/[id]/organize` | `src/app/(dashboard)/sessions/[id]/organize/page.tsx` | Games + recordings |
| `/sessions/[id]/matchups` | `src/app/(dashboard)/sessions/[id]/matchups/page.tsx` | Team 1 / Team 2 |
| `/sessions/[id]/upload` | `src/app/(dashboard)/sessions/[id]/upload/page.tsx` | Mock Drive / YouTube |
| `/sessions/[id]/publish` | `src/app/(dashboard)/sessions/[id]/publish/page.tsx` | Review, Facebook drafts, publish |

Canonical map: [`docs/template/PAGES.md`](../../../docs/template/PAGES.md).

---

## Important directories

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js routes, API routes, and layouts |
| `src/app/(dashboard)/` | Protected dashboard shell and pages |
| `src/app/(dashboard)/sessions/[id]/` | Session workspace steps |
| `src/hooks/` | `use-current-user` (auth); viewport `use-mobile.ts` |
| `src/lib/playmates.ts` | `getPlaymatesRepos` from `@fe-template/mocks` |
| `src/lib/supabase/` | Browser, server, and service-role Supabase clients |
| `src/modules/auth/` | Login, signup, OTP forms |
| `src/modules/layout/` | AdminSidebar, AdminHeader, sidebar |
| `src/modules/playmates/` | Domain widgets (dashboard, organize, upload, publish, …) |
| `src/modules/providers/` | Query client, theme, toaster providers |
| `email-templates/` | Supabase Auth email HTML |

---

## Shared packages consumed

- `@fe-template/ui` — all shared UI primitives.
- `@fe-template/mocks` — Playmates prototype data. See [`packages/mocks/docs/README.md`](../../../packages/mocks/docs/README.md).
- `@fe-template/db` — leftover PawPair Prisma for profile / current-user only.

---

## External services

- **Supabase Auth** — session-based auth, login/signup/OTP. Bypassed when `MOCK_AUTH=true`.
- **Supabase Storage** — leftover `admin-uploads` image route; Playmates videos are **not** uploaded.
- **Mock Drive / YouTube** — `packages/mocks` upload simulator. No OAuth tokens. Real providers: [`ROADMAP/11-handoff-to-real-data.md`](../../../ROADMAP/11-handoff-to-real-data.md).

---

## Environment variables

| Variable | Purpose | Required? |
|---|---|---|
| `MOCK_AUTH` | When `"true"`, middleware treats the request as authenticated | Recommended for local demo |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (browser + middleware + server) | Yes if not using mock auth |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | Yes if not using mock auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role for admin invites | Yes for user invite |
| `DATABASE_URL` | Prisma runtime (profile leftover only) | Yes if hitting Prisma helpers |
| `DIRECT_URL` | Prisma direct connection for migrations | Yes for migrations — **do not** migrate Playmates models in this prototype |

---

## Scripts

| Script | Command | Purpose |
|---|---|---|
| Dev | `pnpm --filter admin dev` | Start dev server on port 9001 |
| Build | `pnpm --filter admin build` | Production build |
| Start | `pnpm --filter admin start` | Start built app on port 9001 |
| Type check | `pnpm --filter admin typecheck` | `tsc --noEmit` |
| Lint | `pnpm --filter admin lint` | ESLint |
| Storybook | `pnpm --filter admin storybook` | Storybook on port 6007 |

---

## Local docs

- `apps/admin/docs/architecture.md` — auth, rendering, data flow
- `apps/admin/docs/development.md` — setup, first admin login, debugging
- `apps/admin/docs/patterns.md` — CRUD patterns and file references

---

## Common task routing

| Task | Read next |
|---|---|
| New CRUD page | `apps/admin/docs/patterns.md`, `docs/api-and-data-fetching.md` |
| Auth change | `apps/admin/docs/architecture.md`, `docs/api-and-data-fetching.md` |
| New form | `apps/admin/docs/patterns.md`, `docs/frontend-conventions.md` |
| Playmates data / mocks | `packages/mocks/docs/README.md`, `ROADMAP/11-handoff-to-real-data.md` |
| Shared UI change | `packages/ui/docs/README.md` |
