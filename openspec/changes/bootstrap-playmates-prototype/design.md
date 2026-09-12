## Context

Playmates is being bootstrapped on a PawPair monorepo (Next.js apps at `apps/web` and `apps/admin`). Product docs already describe sessions, games, recordings, and publication; the running apps do not. This design describes how the prototype should be built when later tickets implement the ten capabilities. Agent and file-placement rules live in [`ROADMAP/00-conventions.md`](../../../ROADMAP/00-conventions.md) and win when a later ticket does not explicitly override them.

## Goals / Non-Goals

**Goals:**

- Replace PawPair surfaces with a mock-backed Playmates archive (public) and session workspace (admin).
- Keep capability behavior specified here so implementers do not invent pairing, publish, or upload rules.
- Let José complete the Sep 9 2026 MVP scenario against in-memory data.

**Non-Goals:**

- Real Supabase Playmates schema, migrations, or RLS.
- Real Google Drive / YouTube OAuth or byte uploads.
- Posting to Facebook.
- Extending the existing PawPair Prisma models.

## Decisions

### Hybrid UI boundary

Public marketing and visual blocks come from **JabKit** installed via `@jabkit/cli` inside `apps/web` only. Admin primitives stay on **`@fe-template/ui`**. Domain widgets (recording board, matchup editor, upload matrix, Facebook preview) are app-local. Never introduce Jabkit as an npm workspace package; never install JabKit into admin. Details: `ROADMAP/00-conventions.md`.

### In-memory repository

Data access for the prototype is:

```text
page / Server Action  →  packages/mocks repository  →  in-memory Map store
```

Server Components and Server Actions import the mocks package. Client components receive serializable props or call Server Actions. Do not import Prisma for Playmates entities. Metadata persists in the mock store; browser `File` objects do not survive reload.

### MOCK_AUTH

When `process.env.MOCK_AUTH === "true"`, admin middleware treats the request as authenticated and user helpers return a fake admin `{ id, email, name, role: "ADMIN" }`. Supabase client files stay on disk. Document the variable name in `.env.example` only.

### Admin routes have no `/admin` prefix

The admin app **is** the admin origin (`apps/admin`, port 9001). Information-architecture paths written as `/admin/sessions` become `/sessions` inside that app. Public archive routes live on `apps/web` (port 9000): `/`, `/sessions`, `/sessions/[sessionSlug]`, `/games/[gameSlug]`, `/players`, `/players/[playerSlug]`, `/venues`, `/venues/[venueSlug]`.

### Soft workflow and independent providers

Creating a session does not publish it. Completing an upload does not publish. Drive and YouTube jobs are independent; retrying one MUST NOT reset the other. Camera Side A/B MUST NOT infer Team 1/2. The system MUST NOT require exactly two recordings per game.

## Risks / Trade-offs

- In-memory state resets on server restart; seed data (later tickets) must reconstruct the MVP scenario.
- Lost `File` handles after refresh will confuse testers unless the UI always shows “reselect file”.
- Keeping PawPair Prisma on disk while mocks own Playmates entities can confuse contributors — conventions forbid extending Prisma for this roadmap.
- Hybrid UI (JabKit + `@fe-template/ui`) requires cwd-correct CLI use; wrong `jabkit init` pollutes the monorepo root.
