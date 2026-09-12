# Assumptions and Open Questions

The application can be implemented with these defaults unless José changes them.

## Current assumptions

- The app begins as a single-owner product administered by José.
- Public users can browse without logging in.
- Supabase provides PostgreSQL and authentication.
- The app uses the in-repo [fe-multi-web-template](https://github.com/jose-codegourmet/fe-multi-web-template) monorepo (Next.js 16, `apps/web` + `apps/admin`, `@fe-template/ui`, Prisma). [`ADR-006`](../10-decisions/ADR-006-jabkit-first.md) still records a Jabkit-first preference; this scaffold implements the template UI instead and does not add Jabkit.
- Raw media does not pass through permanent application storage.
- Google Drive and YouTube use José's Google account initially.
- A session corresponds to a real play date.
- A game belongs to exactly one session.
- A recording belongs to exactly one game once assigned.
- A recording can be unassigned temporarily during import.
- A game can have any number of recordings.
- Side labels start with `A`, `B`, and `UNASSIGNED`, but the schema should permit future custom camera labels.
- Player matchup data can be edited after upload.
- Public visibility is controlled in Supabase rather than inferred from YouTube privacy alone.
- Facebook remains a copy/manual-upload workflow for MVP.

## Product decisions that can be changed later

- Whether public visitors can download Drive files directly.
- Whether YouTube videos default to public, unlisted, or private.
- Whether recordings upload to both Drive and YouTube automatically or providers can be toggled individually.
- Whether a single Google OAuth connection is owner-only or each future admin can connect their own.
- Whether individual courts need their own database table.
- Whether score/winner tracking belongs in MVP.
- Whether game titles are generated automatically.

## Questions that should not block MVP

These can be represented as configurable values:

- exact public site branding
- exact Facebook caption style
- exact YouTube title format
- exact Drive folder naming format
- default YouTube privacy level
