# Phase 3 — Public site pages

Goal: all IA public routes render from `@fe-template/mocks` public helpers. Private/draft records 404.

Depends on: Phase 1 (PNJ-018) and Phase 2 cards (PNJ-021–025, 039, 040). Header/Footer already Playmates (PNJ-006).

Convention: thin `page.tsx` + sections under `apps/web/src/sections/<page>/<section>/` with `.tsx`, `.stories.tsx`, `.meta.ts`.

Hooks: `apps/web/src/hooks/use-public-sessions/`, `use-public-games/`, `use-public-players/`, `use-public-venues/` — each `server.ts` calls `apps/web/src/lib/playmates.ts`. Client hooks only if a section filters on the client.

---

### PNJ-041 — Finish routes, seo, navigation for real pages

**Phase** 3 · **Depends on** PNJ-006, PNJ-018 · **Size** S  
**Read first:** [`02-metadata.md`](02-metadata.md)  
**Edit:** `apps/web/src/constants/{routes,seo,navigation}.ts`  
**Create:** none  
**Do not touch:** admin  

If PNJ-006 already wrote the final shapes, this ticket is a verify pass: add any missing `PAGE_SEO` keys and `as const` types. Do not reintroduce PawPair keys.

**Acceptance:** `ROUTES.session("2026-09-09") === "/sessions/2026-09-09"`.

**Validate:** web typecheck.

---

### PNJ-042 — Header / Footer compose (optional JabKit)

**Phase** 3 · **Depends on** PNJ-020, PNJ-041 · **Size** M  
**Edit:** `apps/web/src/modules/layout/navigation/header/Header.tsx`, `footer/Footer.tsx` + stories  
**Do not touch:** jabkit installed source except import  

**Steps:**

1. Default path: keep the existing template Header/Footer structure, Playmates links, no tubelight.
2. Optional path: wrap `footer-section` / `tubelight-navbar` **after** install. Pass Playmates link props. If the JabKit footer requires a newsletter form, hide that slot or no-op submit.
3. Mobile: hamburger or the JabKit mobile behavior. One-column. No horizontal overflow.
4. Active link uses pathname.

**Acceptance:** Every public route shows header+footer. Click Sessions → `/sessions` (page may still be stub until PNJ-044).

**Validate:** web typecheck. Browser: resize to 375px.

---

### PNJ-052 — Public data hooks

**Phase** 3 · **Depends on** PNJ-018 · **Size** S  
**Create:**  
`apps/web/src/hooks/use-public-sessions/{server,client,query,types}.ts`  
same for `use-public-games`, `use-public-players`, `use-public-venues`  

**Steps:**

1. `server.ts` functions: `fetchPublicSessions()`, `fetchPublicSession(slug)`, etc. Return `null` for missing/private.
2. `client.ts` only for index filters (sessions list). Query keys: `["public-sessions"]`.
3. Do not fetch private slugs “for SEO”.

**Acceptance:** `fetchPublicSession("2026-09-02")` is `null` if that slug is the draft session.

**Validate:** web typecheck.

---

### PNJ-043 — Home `/`

**Phase** 3 · **Depends on** PNJ-020, PNJ-021, PNJ-022, PNJ-052 · **Size** M  
**Read first:** [`docs/06-ui/public-site.md`](../docs/06-ui/public-site.md) Home  
**Create:**  
- `apps/web/src/app/page.tsx`  
- `apps/web/src/sections/home/hero/HomeHeroSection.*`  
- `apps/web/src/sections/home/latest-sessions/LatestSessionsSection.*`  
- `apps/web/src/sections/home/recent-games/RecentGamesSection.*`  
- `apps/web/src/sections/home/players-strip/PlayersStripSection.*` (optional but wanted)  
**Delete:** the Phase 0 stub heading-only page  

**Steps:**

1. This is an **archive home**, not a marketing landing. No pricing, no testimonials, no app-store CTA.
2. Hero: product name + one sentence + CTA “Browse sessions”. Compose `hero228` **or** a calm custom hero using `@fe-template/ui`. If using `hero228`, replace its dummy copy; do not edit the installed file — wrap it.
3. Latest sessions: 3 `SessionCard`s from public list sorted by date desc.
4. Recent games: flatten public games, take 6, `GameCard`.
5. Optional `count-up` for public session count / game count.
6. Prefetch in the page via server fetch; no PawPair react-query leftovers.

**Acceptance:** `/` shows Sep 9 session. Draft session does not appear. No word “PawPair”.

**Validate:** `pnpm --filter web typecheck`. Browser `/`.

---

### PNJ-044 — Sessions index `/sessions`

**Phase** 3 · **Depends on** PNJ-021, PNJ-052 · **Size** M  
**Create:** `apps/web/src/app/sessions/page.tsx` + sections `hero`, `filters`, `grid`  

**Steps:**

1. Filters (client section): date (input type=date or year-month), player (select of public players), venue (select). Filter in memory.
2. Grid of `SessionCard`. Empty: `@fe-template/ui` `Empty` “No published sessions match”.
3. Metadata from `PAGE_SEO.sessions`.

**Acceptance:** Filtering venue to the second venue hides Sep 9 if it is at Smash Court. Reset shows it again.

**Validate:** web typecheck + browser filter.

---

### PNJ-045 — Session detail `/sessions/[sessionSlug]`

**Phase** 3 · **Depends on** PNJ-022, PNJ-023, PNJ-052 · **Size** M  
**Create:** `apps/web/src/app/sessions/[sessionSlug]/page.tsx` + sections `header`, `players`, `games`  

**Steps:**

1. `generateMetadata` from session. `notFound()` if null.
2. Header: date, title, venue, notes.
3. Players: links to `/players/[slug]`.
4. Games: ordered `GameCard` list.
5. Do not show admin status badges on the public page.

**Acceptance:** `/sessions/2026-09-09` lists 10 games. `/sessions/2026-09-02` (draft) is 404. `/sessions/does-not-exist` is 404.

**Validate:** web typecheck + browser.

---

### PNJ-046 — Game page `/games/[gameSlug]`

**Phase** 3 · **Depends on** PNJ-025, PNJ-039, PNJ-040, PNJ-052 · **Size** L  
**Read first:** public-site Game page  
**Create:** `apps/web/src/app/games/[gameSlug]/page.tsx` + sections `header`, `recordings`, `links`, `pager`  

**Steps:**

1. Resolve slug via `formatGameSlug` data (seed must set `Game.slug` or you derive consistently — **set `slug` on Game in the mock type** if missing: add field in PNJ-012 if you forgot; do it here with a small type add in mocks).
2. Header: matchup, session date, venue, link back to session.
3. Recordings section: group by side, then `part_number` asc. Label “Side B · Part 2”. Embed YouTube when `embed_url` present; otherwise show filename + Drive link.
4. Multi-part: visual sequence (Part 1 above Part 2), never a flat unordered list.
5. Prev/next: adjacent `game_number` in the same session, only if that game is public.
6. `notFound()` if game private or missing.

**Acceptance:** `/games/2026-09-09-game-4` shows two Side B parts in order. Game 8 shows a single recording without an empty Side B error.

**Validate:** web typecheck + browser both games.

---

### PNJ-047 — Players index `/players`

**Phase** 3 · **Depends on** PNJ-023, PNJ-052 · **Size** S  
**Create:** `app/players/page.tsx` + `sections/players/grid`  

List public-facing players who appear on at least one public game or session. Archived players who still have public history **may** appear. Compose `team17` optionally.

**Acceptance:** José is listed. A player who exists only on the draft session is hidden.

**Validate:** web typecheck.

---

### PNJ-048 — Player detail `/players/[playerSlug]`

**Phase** 3 · **Depends on** PNJ-021, PNJ-022, PNJ-052 · **Size** M  
**Create:** `app/players/[playerSlug]/page.tsx` + sections `header`, `sessions`, `games`  

Show display name, nickname, recent public sessions, recent public games. No stats, no teammate graph.

**Acceptance:** `/players/jose` works (use the actual seed slug). Unknown slug 404.

**Validate:** web typecheck.

---

### PNJ-049 — Venues index `/venues`

**Phase** 3 · **Depends on** PNJ-024, PNJ-052 · **Size** S  
**Create:** `app/venues/page.tsx` + grid section  

Venues that have at least one public session.

**Validate:** web typecheck.

---

### PNJ-050 — Venue detail `/venues/[venueSlug]`

**Phase** 3 · **Depends on** PNJ-021, PNJ-052 · **Size** S  
**Create:** `app/venues/[venueSlug]/page.tsx` + header + session history  

**Acceptance:** Smash Court slug shows Sep 9. Private-only venue 404s or shows empty history — prefer 404 if it has zero public sessions.

**Validate:** web typecheck.

---

### PNJ-051 — `sitemap.ts`, `robots.ts`, dynamic metadata audit

**Phase** 3 · **Depends on** PNJ-043–PNJ-050 · **Size** S  
**Create:** `apps/web/src/app/sitemap.ts`, `apps/web/src/app/robots.ts`  
**Edit:** each dynamic `page.tsx` if `generateMetadata` missing  

**Steps:**

1. Sitemap URLs: `/`, `/sessions`, `/players`, `/venues`, plus each public session/game/player/venue slug.
2. `robots.ts`: `allow: /`.
3. Open Graph title/description on home and session.

**Acceptance:** Grep `generateMetadata` or `export const metadata` on every public `page.tsx`. Sitemap function does not include the draft session slug.

**Validate:** web typecheck.

---

## Phase 3 exit checklist

- [ ] 8 public routes live
- [ ] Draft session hidden
- [ ] Game 4 parts ordered
- [ ] No PawPair sections remain
- [ ] SEO constants + sitemap
