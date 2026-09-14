# Handoff — what the owner wires later

This file is **not** a work order for prototype agents. Do not implement anything here during PNJ-001–PNJ-081.

The prototype is done when mocks + pages work. The owner (you) owns database, OAuth, and real uploads.

## Single adapter seam

Replace the **implementations**, not the UI.

| Keep | Replace |
|---|---|
| `PlaymatesRepos` interfaces in `packages/mocks/src/repositories/types.ts` | Move interfaces to `packages/db` or `packages/domain` if you prefer |
| Every Server Action signature | Action **bodies** that call Prisma instead of `getPlaymatesRepos()` |
| `naming.ts` pure functions | Unchanged |
| Pages, sections, domain components | Unchanged |

Suggested end state:

```text
packages/mocks/src/memory/*     → delete or keep as test double
packages/db/prisma/schema/*     → Playmates models from docs/03-data
packages/db/src/prisma-repos.ts → implements PlaymatesRepos
apps/*/src/lib/playmates.ts     → import getPlaymatesRepos from @fe-template/db
```

`getPlaymatesRepos()` is the one function to swap. Do not scatter `prisma.session.findMany` across 40 pages if you can avoid it.

## Disk file to delete

`packages/mocks/.data/store.json` exists only so web (9000) and admin (9001) share state. Prisma + Postgres replace it. Delete the file, the gitignore rule, and the read/write helpers.

## Database (owner)

Follow [`docs/03-data/database-schema.md`](../docs/03-data/database-schema.md), [`docs/03-data/indexes-and-constraints.md`](../docs/03-data/indexes-and-constraints.md), [`docs/03-data/rls-and-security.md`](../docs/03-data/rls-and-security.md).

- **Done:** `packages/db/prisma/schema/` now holds the Playmates models (multi-file Prisma). Initial migration `20260914132156_init_playmates` is applied to the hosted Supabase project. `Profile.id` FKs to `auth.users`.
- **Open:** implement `packages/db/src/prisma-repos.ts` against `PlaymatesRepos` and repoint `apps/*/src/lib/playmates.ts`.
- **Open:** RLS policies from `docs/03-data/rls-and-security.md` (Prisma currently connects as the database owner and bypasses RLS).
- Do not store video bytes (ADR-001).
- Do not enforce two recordings per game (ADR-002).

## Auth (owner)

- Remove `MOCK_AUTH` from production.
- Keep Supabase Auth on admin.
- Link `profiles.id` to `auth.users`.
- Enforce admin role in middleware (the TODO already in `apps/admin/middleware.ts`).

## Google OAuth + Drive + YouTube (owner)

Settings → Google page is a placeholder (PNJ-059). Implement using [`docs/05-integrations/google-oauth.md`](../docs/05-integrations/google-oauth.md), [`google-drive.md`](../docs/05-integrations/google-drive.md), [`youtube.md`](../docs/05-integrations/youtube.md), [`docs/07-engineering/upload-architecture.md`](../docs/07-engineering/upload-architecture.md).

Replace `upload-simulator.ts` with resumable upload. Keep the **job state machine** and the UploadMatrix UI.

Tokens: server-only, never in `store.json` or client props.

## Facebook (owner)

Still manual (ADR-003). No Graph API unless you later change the ADR. The generate/copy/mark-posted UI stays.

## File handles

Real upload needs the browser `File` (or File System Access API). The reselect banner is already specified. Do not invent server-side copies of the video.

## Optional later (not prototype)

- Timestamp pairing suggestions
- Copy previous as smarter rematch
- Scores / winners as first-class public UI
- Package rename `@fe-template/*` → `@playmates/*`
- Publishing JabKit wrappers back upstream
