# Phased Implementation Plan

## Phase 0 — Repository reconnaissance

Agent must:
- read `AGENTS.md`
- read existing repository docs
- identify template conventions
- inspect Jabkit usage
- inspect auth/database setup
- document conflicts before changing architecture

Output:
- implementation plan
- affected routes/modules
- migration plan

## Phase 1 — Foundation

Implement:
- Supabase auth/admin guard
- players CRUD
- venues/courts CRUD
- sessions CRUD
- public/private visibility primitives

Do not implement video upload yet.

## Phase 2 — Game domain

Implement:
- games
- teams
- team player assignments
- session roster
- game ordering

## Phase 3 — Recording import/organize

Implement:
- drag/drop
- local file metadata
- recording rows
- unassigned area
- game grouping
- sides
- parts
- drag/reorder

This phase should be polished before provider automation.

## Phase 4 — Google connection

Implement:
- OAuth
- secure token handling
- connected account settings

## Phase 5 — Google Drive upload

Implement:
- session folders
- resumable direct upload
- progress
- provider asset persistence
- failure/retry

## Phase 6 — YouTube upload

Implement:
- upload
- title/description generation
- privacy
- progress
- provider asset persistence
- retry

## Phase 7 — Publish workflow

Implement:
- review checklist
- public session/game pages
- YouTube links/embeds
- Drive links
- publish/unpublish

## Phase 8 — Facebook draft workflow

Implement:
- generated per-game post
- copy button
- edit/save version
- mark posted
- optional post URL field

## Phase 9 — Quality improvements

Implement:
- pairing suggestions by timestamp
- bulk matchup helpers
- upload queue tuning
- search/filter
- job diagnostics

## Phase 10 — Later

Potential:
- stats
- highlights
- playlists
- richer player profiles
- multi-admin
