# Phase 0 — Purge PawPair, rebrand chrome, auth bypass, ADR

Goal: an empty Playmates-branded shell in both apps, plus process docs (ADR, OpenSpec, JabKit exception). No Playmates pages yet.

Depends on: nothing except reading [`00-conventions.md`](00-conventions.md).

PNJ-002 and PNJ-003 live in [`01-openspec.md`](01-openspec.md). Execute them in this phase.

---

### PNJ-001 — Revise ADR-006 and root AGENTS.md for the hybrid UI boundary

**Phase** 0 · **Depends on** none · **Size** S  
**Read first:** [`docs/10-decisions/ADR-006-jabkit-first.md`](../docs/10-decisions/ADR-006-jabkit-first.md), [`AGENTS.md`](../AGENTS.md), [`ROADMAP/00-conventions.md`](00-conventions.md)  
**Create:** none  
**Edit:** `docs/10-decisions/ADR-006-jabkit-first.md`, `AGENTS.md`, `docs/README.md` (the sentence that says do not introduce Jabkit)  
**Delete:** none  
**Do not touch:** application source  

**Steps:**

1. Change ADR-006 status to **Amended**. Add a dated amendment (2026-09-12):
   - Public site visual/marketing blocks: JabKit via `@jabkit/cli` into `apps/web/src/components/jabkit`.
   - Admin and all form/table primitives: `@fe-template/ui`.
   - Domain widgets stay app-local.
   - Do not add JabKit as an npm workspace package.
2. In root `AGENTS.md` Known conflicts, replace “Do not introduce Jabkit” with the hybrid rule and a pointer to `ROADMAP/00-conventions.md`.
3. In `docs/README.md` step 4 (“For UI primitives… do not introduce Jabkit until ADR revised”), point at the amended ADR and the hybrid rule.

**Acceptance:**

- Grep for “do not introduce Jabkit” in `AGENTS.md` and `docs/README.md` returns no leftover contradiction.
- ADR-006 states the hybrid boundary in plain language.

**Validate:** none beyond reading the three files.

---

### PNJ-004 — Delete PawPair public pages, sections, hooks, and mocks

**Phase** 0 · **Depends on** PNJ-001 · **Size** L  
**Read first:** [`docs/llm/PATTERNS.md`](../docs/llm/PATTERNS.md), [`scripts/cleanup-unused.py`](../scripts/cleanup-unused.py), this ticket  
**Create:** stub `apps/web/src/app/page.tsx` that renders a single heading “Playmates ni José” (temporary; Phase 3 replaces it)  
**Edit:** `apps/web/src/app/layout.tsx` (keep Providers, Header, Footer, fonts)  
**Delete:** listed below  
**Do not touch:** `apps/admin`, `packages/ui`, `packages/db`, `apps/web/src/modules/providers`, `apps/web/src/store`, `apps/web/src/app/globals.css` (token work is PNJ-010)

**Steps:**

1. Delete these **app routes** (the `page.tsx` and the route folder):

   - `apps/web/src/app/about`
   - `apps/web/src/app/blog` (including `[slug]` and `grid`)
   - `apps/web/src/app/careers`
   - `apps/web/src/app/contact`
   - `apps/web/src/app/create-profile`
   - `apps/web/src/app/help`
   - `apps/web/src/app/legal` (all children)
   - `apps/web/src/app/otp`
   - `apps/web/src/app/partners`
   - `apps/web/src/app/press`
   - `apps/web/src/app/pricing`
   - `apps/web/src/app/resources`
   - `apps/web/src/app/showcase`
   - `apps/web/src/app/sign-in`
   - `apps/web/src/app/status`
   - `apps/web/src/app/api/blog`
   - `apps/web/src/app/api/pricing`
   - `apps/web/src/app/api/testimonials`

   Keep: `layout.tsx`, `globals.css`, `not-found.tsx`, `favicon.ico`, `page.tsx` (replace contents).

2. Delete the entire `apps/web/src/sections/` tree **except** you may keep `not-found/hero` if `not-found.tsx` uses it. If you keep it, rewrite copy to Playmates. Otherwise write a 10-line `NotFoundHeroSection`.

3. Delete hooks:

   - `apps/web/src/hooks/use-blog-posts`
   - `apps/web/src/hooks/use-pricing-plans`
   - `apps/web/src/hooks/use-testimonials`

4. Delete types/constants/mocks that only serve PawPair:

   - `apps/web/src/constants/blog.ts`
   - `apps/web/src/constants/placeholder-pages.ts`
   - `apps/web/src/lib/blog-category.ts`
   - `apps/web/src/lib/mock/pets.ts`
   - `apps/web/src/types/blog.ts`
   - `apps/web/src/types/pets.ts`
   - `apps/web/src/types/pricing.ts`
   - `apps/web/src/types/testimonials.ts`

5. Replace `apps/web/src/app/page.tsx` with a server component that only renders `<h1>Playmates ni José</h1>` and `DEFAULT_SEO` once PNJ-006 has rewritten seo — if PNJ-006 is not done, inline the title string and fix in PNJ-006.

6. Header/Footer will still link to deleted routes until PNJ-006. After this ticket, **either** make Header/Footer render empty nav **or** do PNJ-006 in the same PR. Prefer doing PNJ-006 immediately after.

7. Optional: `python scripts/cleanup-unused.py` dry-run to catch leftovers. Do not run `--delete` blindly.

**Acceptance:**

- `pnpm --filter web typecheck` passes.
- Visiting `/about` or `/pricing` is a Next 404, not a PawPair page.
- `/` renders the Playmates heading without PawPair sections.

**Validate:** `pnpm lint && pnpm --filter web typecheck`

---

### PNJ-005 — Delete PawPair admin CRUD pages

**Phase** 0 · **Depends on** PNJ-001 · **Size** L  
**Read first:** [`docs/frontend-conventions.md`](../docs/frontend-conventions.md)  
**Create:** stub `apps/admin/src/app/(dashboard)/dashboard/page.tsx` with “Playmates admin” heading  
**Edit:** `apps/admin/src/modules/layout/AdminSidebar.tsx` — temporary nav: Dashboard only  
**Delete:** listed below  
**Do not touch:** `apps/admin/src/lib/supabase/**`, `middleware.ts` (PNJ-007), auth modules (`login`, `otp`, `signup`), `Providers`, sidebar primitive files  

**Steps:**

1. Delete dashboard feature folders:

   - `apps/admin/src/app/(dashboard)/community-growth-chart.tsx`
   - `apps/admin/src/app/(dashboard)/recent-activity.tsx`
   - `apps/admin/src/app/(dashboard)/contacts`
   - `apps/admin/src/app/(dashboard)/pets`
   - `apps/admin/src/app/(dashboard)/posts`
   - `apps/admin/src/app/(dashboard)/pricing-plans`
   - `apps/admin/src/app/(dashboard)/testimonials`
   - `apps/admin/src/app/(dashboard)/users`

   Keep: `dashboard/page.tsx` (replace), `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `profile/` (optional keep — useful for later; if it imports Prisma User, stub it to the mock user).

2. Delete hooks that only served those pages: `use-contacts`, `use-pets`, `use-posts`, `use-pricing-plans`, `use-testimonials`, `use-users`. Keep `use-current-user` and `use-mobile`.

3. If `profile` or `use-current-user` imports Prisma, guard with a TODO and return mock data when `MOCK_AUTH` is set (full bypass is PNJ-007 — coordinate so typecheck passes).

4. Sidebar `NAV_ITEMS` = `[{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon }]`. Brand text: “Playmates Admin”. Remove `PawPrintIcon` as the product mark; use a simple circle or `CircleDot` until a real mark exists.

**Acceptance:**

- `/pets`, `/posts`, `/users` 404 inside admin.
- `/dashboard` renders.
- Typecheck does not reference deleted modules.

**Validate:** `pnpm lint && pnpm --filter admin typecheck`

---

### PNJ-006 — Rebrand layout, fonts, routes, seo, navigation

**Phase** 0 · **Depends on** PNJ-004, PNJ-005 · **Size** M  
**Read first:** [`02-metadata.md`](02-metadata.md) Track B  
**Create:** optional `apps/web/public/images/brand/og-playmates.png` (solid color 1200×630 is fine)  
**Edit:**  
- `apps/web/src/app/layout.tsx`  
- `apps/web/src/constants/routes.ts`  
- `apps/web/src/constants/seo.ts`  
- `apps/web/src/constants/navigation.ts`  
- `apps/web/src/modules/layout/navigation/header/Header.tsx` (+ stories)  
- `apps/web/src/modules/layout/footer/Footer.tsx` (+ stories)  
- `apps/admin/src/app/(dashboard)/layout.tsx` `TITLES`  
- `apps/admin/src/modules/layout/AdminSidebar.tsx`  
- `apps/admin/src/app/login/page.tsx` copy  
**Delete:** leftover PawPair image references on chrome if they 404  
**Do not touch:** JabKit install (PNJ-009), token merge (PNJ-010)

**Steps:**

1. Set root metadata to `DEFAULT_SEO` from [`02-metadata.md`](02-metadata.md).
2. Rewrite `ROUTES`, `PAGE_SEO`, `NAV_LINKS` to the Playmates set. Header links: Home, Sessions, Players, Venues. Footer: same plus a one-line credit “Archive by José”.
3. Sessions/Players/Venues links may 404 until Phase 3. That is OK. Do not recreate PawPair pages to avoid 404s.
4. Admin titles map as in `02-metadata.md`. Sidebar label “Playmates Admin”.
5. Login page title/description: “Playmates ni José — Admin”. Remove PawPair / pet copy.
6. Grep `PawPair` and `pawpair` under `apps/`. Remaining hits should only be comments pointing at history or `docs/about-example-site` (leave those docs).

**Acceptance:**

- Grep `PawPair` in `apps/web/src` and `apps/admin/src` is empty (or only a changelog comment).
- Header shows four Playmates links.

**Validate:** `pnpm lint && pnpm --filter web typecheck && pnpm --filter admin typecheck`

---

### PNJ-007 — `MOCK_AUTH=true` admin bypass

**Phase** 0 · **Depends on** PNJ-005 · **Size** M  
**Read first:** `apps/admin/middleware.ts`, `apps/admin/src/lib/supabase/**`, `apps/admin/src/hooks/use-current-user/**`  
**Create:** `apps/admin/src/lib/auth/mock-user.ts` exporting `MOCK_ADMIN_USER`  
**Edit:** `apps/admin/middleware.ts`, `use-current-user` server+client, `.env.example` (root and/or `apps/admin`)  
**Delete:** none  
**Do not touch:** Supabase project, real keys  

**Steps:**

1. Add to `.env.example`:

   ```bash
   # Admin only. When true, middleware skips Supabase session and injects a fake admin.
   MOCK_AUTH=true
   ```

2. `MOCK_ADMIN_USER`: `{ id: "00000000-0000-0000-0000-000000000001", email: "jose@local.dev", name: "José", role: "ADMIN" }`.

3. Middleware: if `process.env.MOCK_AUTH === "true"`, skip `getUser()`, do not redirect to `/login`, still allow `/login` to render (no force-redirect to dashboard unless you want convenience — prefer: mock user can open `/dashboard` without login, `/login` still visible).

4. `use-current-user` server fetch: if `MOCK_AUTH`, return `MOCK_ADMIN_USER` without Prisma/Supabase.

5. Do not log tokens. Do not put the flag in `NEXT_PUBLIC_*` unless you must read it on the client — prefer a small server action `getAuthMode()` or bake the mock user into the RSC layout. If the client hook needs a user, have the dashboard layout pass it as props **or** use `NEXT_PUBLIC_MOCK_AUTH=true` **only** as a mirror of the server flag, documented as non-secret.

6. Write a 5-line comment at the top of middleware explaining this is a prototype escape hatch.

**Acceptance:**

- With `MOCK_AUTH=true` and **no** valid Supabase env, `pnpm --filter admin dev` → `/dashboard` renders without redirect loop.
- With `MOCK_AUTH` unset/false, existing redirect-to-login behavior remains (may fail if env missing — that is OK).

**Validate:** `pnpm --filter admin typecheck`

---

### PNJ-008 — Document the JabKit `src/components` exception

**Phase** 0 · **Depends on** PNJ-001 · **Size** XS  
**Read first:** [`docs/frontend-conventions.md`](../docs/frontend-conventions.md), [`docs/llm/PATTERNS.md`](../docs/llm/PATTERNS.md), [`docs/styling-and-design-system.md`](../docs/styling-and-design-system.md)  
**Create:** none  
**Edit:** those three docs + `apps/web/AGENTS.md` (short pointer)  
**Delete:** none  
**Do not touch:** code  

**Steps:**

1. Add a subsection: the only allowed `apps/web/src/components/` tree is `jabkit/` written by `@jabkit/cli`. Domain UI stays in `sections/` and `modules/`.
2. Admin never grows `src/components/`.
3. Point at `ROADMAP/00-conventions.md` for the CLI recipe.

**Acceptance:** Docs no longer say “never create apps/*/src/components” without the exception.

**Validate:** none.

---

### PNJ-009 — `jabkit init` inside `apps/web`

**Phase** 0 · **Depends on** PNJ-008 · **Size** S  
**Read first:** [`00-conventions.md`](00-conventions.md) JabKit CLI skill  
**Create:** `apps/web/jabkit.config.json`, CLI-generated skill file  
**Edit:** `apps/web/AGENTS.md` only if the CLI appended a section — keep it  
**Delete:** none  
**Do not touch:** `apps/admin`, do not run init at repo root  

**Steps:**

1. `cd apps/web && npx @jabkit/cli@0.1.2 init`
2. Set config exactly as in `00-conventions.md` (`registry` = `https://jabkit.joseadrianbuctuanon.dev`).
3. Confirm `apps/web/tsconfig.json` has `"@/*": ["./src/*"]`.
4. Do **not** `add` components yet.
5. If init created `apps/web/.github/skills/jabkit-component/SKILL.md`, leave it. Optionally add one sentence: “Also read `/ROADMAP/00-conventions.md`.”

**Acceptance:**

- `apps/web/jabkit.config.json` exists and parses as JSON.
- No JabKit files under repo-root `.github/skills` unless they were already there.
- `npx @jabkit/cli@0.1.2 add button --dry-run` from `apps/web` prints destinations under `src/components/jabkit/`.

**Validate:** dry-run only.

---

### PNJ-010 — Reconcile `--jk-*` tokens with existing Tailwind 4 theme

**Phase** 0 · **Depends on** PNJ-009 · **Size** M  
**Read first:** `apps/web/src/app/globals.css`, `packages/ui` token CSS, JabKit theming docs conceptually (`--jk-*`)  
**Create:** comment block in `globals.css` titled “JabKit token bridge”  
**Edit:** `apps/web/src/app/globals.css`  
**Delete:** none  
**Do not touch:** `packages/ui` tokens in a breaking way; admin `globals.css` unless a variable is shared  

**Steps:**

1. Read current `:root` / `.dark` variables in `apps/web/src/app/globals.css`.
2. Fetch one registry item that includes `cssVars` (e.g. `https://jabkit.joseadrianbuctuanon.dev/r/button.json`) and list the `--jk-*` keys.
3. Map `--jk-background`, `--jk-foreground`, `--jk-primary`, `--jk-muted`, `--jk-border`, `--jk-ring` (and any others present) to the existing semantic tokens (`--background`, `--foreground`, `--primary`, …) via `var()`.
4. Decide light/dark: both apps already use `class` dark mode + next-themes. Keep that. JabKit `.dark` block must sit next to the existing `.dark` block, not replace it.
5. Do not hardcode hex in components. Bridge in CSS only.
6. Add a short note to `docs/styling-and-design-system.md`: JabKit blocks use `--jk-*`; we alias them.

**Acceptance:**

- After PNJ-019 installs `button`, a story or a temporary render of `<Button>Test</Button>` from JabKit is readable in light and dark (contrast not broken).
- Existing `@fe-template/ui` Button on the same page still looks like the template.

**Validate:** `pnpm --filter web typecheck`

---

## Phase 0 exit checklist

- [ ] ADR + AGENTS hybrid rule
- [ ] OpenSpec init + 10 specs (PNJ-002, PNJ-003)
- [ ] PawPair web/admin features gone
- [ ] Chrome says Playmates ni José
- [ ] `MOCK_AUTH=true` opens admin dashboard
- [ ] `jabkit.config.json` present
- [ ] Token bridge documented
