# Pages

Public archive pages live under `apps/web/src/app/` and compose section components only — no large inline JSX in `page.tsx`. Sections live under `apps/web/src/sections/`.

Admin routes live under `apps/admin/src/app/`. There is **no** `/admin` URL prefix — the admin app **is** the admin origin. Playmates mutations go through Server Actions that call `@fe-template/mocks` (`apps/admin/src/lib/playmates.ts`). Prisma in `@fe-template/db` is still PawPair leftover (profile/auth only) — **it does not have Playmates models.**

See [`packages/mocks/docs/README.md`](../../packages/mocks/docs/README.md) and [`ROADMAP/11-handoff-to-real-data.md`](../../ROADMAP/11-handoff-to-real-data.md).

---

## Route Map — `apps/web` (8 public routes)

| Route | File | Page |
| --- | --- | --- |
| `/` | `app/page.tsx` | Archive home |
| `/sessions` | `app/sessions/page.tsx` | Sessions index |
| `/sessions/[sessionSlug]` | `app/sessions/[sessionSlug]/page.tsx` | Session detail |
| `/games/[gameSlug]` | `app/games/[gameSlug]/page.tsx` | Game detail |
| `/players` | `app/players/page.tsx` | Players index |
| `/players/[playerSlug]` | `app/players/[playerSlug]/page.tsx` | Player detail |
| `/venues` | `app/venues/page.tsx` | Venues index |
| `/venues/[venueSlug]` | `app/venues/[venueSlug]/page.tsx` | Venue detail |

Also present (not visitor IA routes):

| Route | File | Page |
| --- | --- | --- |
| `/sitemap.xml` | `app/sitemap.ts` | Public slugs only |
| `/robots.txt` | `app/robots.ts` | Crawl rules |
| `not-found` | `app/not-found.tsx` | Playmates 404 (Home + Sessions) |

Routes and SEO metadata are centralised in:

```text
src/constants/routes.ts
src/constants/seo.ts
```

---

## Page Composition Rule

`page.tsx` files import and render section components in order. Fetch Playmates data in the page (or a `use-public-*` server helper) and pass serializable props. No Prisma.

```tsx
// app/sessions/page.tsx
import { SessionsFiltersSection } from "@/sections/sessions/filters/SessionsFiltersSection";
import { SessionsGridSection } from "@/sections/sessions/grid/SessionsGridSection";
import { SessionsHeroSection } from "@/sections/sessions/hero/SessionsHeroSection";

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

Visual/marketing blocks may come from JabKit (`@/components/jabkit/...`). Form/table primitives stay on `@fe-template/ui`.

---

## Section Folder Map

### Home — `src/sections/home/`

```text
hero/
latest-sessions/
recent-games/
players-strip/
```

### Sessions — `src/sections/sessions/`

```text
hero/
filters/
grid/
```

### Game detail — `src/sections/game-detail/`

```text
header/
recordings/
links/
pager/
```

### Players — `src/sections/players/`

```text
hero/
grid/
```

### Player detail — `src/sections/player-detail/`

```text
header/
sessions/
games/
```

### Venues — `src/sections/venues/`

```text
hero/
grid/
```

### Venue detail — `src/sections/venue-detail/`

```text
header/
session-history/
```

### Not Found — `src/sections/not-found/`

```text
hero/
```

### Shared — `src/sections/_shared/`

```text
game-card/
matchup-label/
player-card/
provider-link-list/
session-card/
status-badge/
venue-card/
youtube-embed/
```

---

## Adding a New Page

1. Create `app/[route]/page.tsx` — compose sections only
2. Add sections under `src/sections/[page-name]/[section-name]/`
3. Each section: `.tsx` + `.stories.tsx` (add `.schema.ts` + `.defaults.ts` only if it is a form)
4. Register the route in `src/constants/routes.ts`
5. Add SEO metadata in `src/constants/seo.ts`
6. Read public data from `@fe-template/mocks` via `src/lib/playmates.ts` — not Prisma
7. Commit with Conventional Commits

---

## Layout — `apps/web`

Global layout is in `app/layout.tsx`. It wraps every page with:

- Redux `Provider`
- TanStack Query `QueryClientProvider`
- `next-themes` `ThemeProvider`
- `Header` (navigation)
- `Footer`

Header, footer, and sidebar live in `src/modules/layout/`; the provider tree lives in `src/modules/providers/`. Individual pages do not repeat header/footer markup.

---

## Admin Route Map

Admin pages are Server Components. Playmates reads/writes go through `@fe-template/mocks` (`getPlaymatesRepos`). Mutations live in co-located `actions.ts`. Everything under `(dashboard)` is gated by `apps/admin/middleware.ts` (Supabase session, or `MOCK_AUTH=true`). `/` is not the dashboard: `app/page.tsx` redirects to `/dashboard`.

| Route | File | Page |
| --- | --- | --- |
| `/` | `app/page.tsx` | Redirects to `/dashboard` |
| `/login` | `app/login/page.tsx` | Supabase email/password sign-in (outside the shell) |
| `/signup` | `app/signup/page.tsx` | Public self-signup |
| `/otp` | `app/otp/page.tsx` | OTP confirmation |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Latest sessions, uploads, failed jobs, Facebook queue |
| `/sessions` | `app/(dashboard)/sessions/page.tsx` | Sessions list |
| `/sessions/new` | `app/(dashboard)/sessions/new/page.tsx` | Create draft session |
| `/players` | `app/(dashboard)/players/page.tsx` | Players list, create/edit, archive |
| `/venues` | `app/(dashboard)/venues/page.tsx` | Venues list, create/edit, archive |
| `/venues/[id]` | `app/(dashboard)/venues/[id]/page.tsx` | Venue courts |
| `/settings` | `app/(dashboard)/settings/page.tsx` | Settings index |
| `/settings/google` | `app/(dashboard)/settings/google/page.tsx` | Google OAuth placeholder (disabled) |
| `/settings/publishing` | `app/(dashboard)/settings/publishing/page.tsx` | Facebook Group URL + default hashtags |
| `/profile` | `app/(dashboard)/profile/page.tsx` | Signed-in admin profile |

---

## Admin session workspace paths

`/sessions/[id]` redirects to `/sessions/[id]/details`. The stepper is `[id]/layout.tsx` + `session-workspace-nav.tsx`.

| Route | File | Step |
| --- | --- | --- |
| `/sessions/[id]` | `app/(dashboard)/sessions/[id]/page.tsx` | Redirect → details |
| `/sessions/[id]/details` | `app/(dashboard)/sessions/[id]/details/page.tsx` | Date, venue, notes |
| `/sessions/[id]/players` | `app/(dashboard)/sessions/[id]/players/page.tsx` | Roster |
| `/sessions/[id]/import` | `app/(dashboard)/sessions/[id]/import/page.tsx` | Import recording metadata |
| `/sessions/[id]/organize` | `app/(dashboard)/sessions/[id]/organize/page.tsx` | Games + recordings |
| `/sessions/[id]/matchups` | `app/(dashboard)/sessions/[id]/matchups/page.tsx` | Team 1 / Team 2 |
| `/sessions/[id]/upload` | `app/(dashboard)/sessions/[id]/upload/page.tsx` | Mock Drive / YouTube jobs |
| `/sessions/[id]/publish` | `app/(dashboard)/sessions/[id]/publish/page.tsx` | Review, Facebook drafts, publish |

Setup and auth details: [`apps/admin/README.md`](../../apps/admin/README.md). Prototype data: [`packages/mocks/docs/README.md`](../../packages/mocks/docs/README.md).
