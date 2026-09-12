# ADR-001 — Do Not Store Raw Video in Supabase

## Status
Accepted

## Decision

Supabase stores metadata only.

Raw badminton recordings are sent to:
- Google Drive
- YouTube

## Reasons

- videos are large
- duplicate storage is unnecessary
- Supabase is better used for structured app data here
- direct provider upload reduces server bandwidth
- Google Drive gives players downloadable originals
- YouTube provides playback/distribution

## Consequences

Positive:
- lower application storage pressure
- cleaner media architecture
- provider-native playback/download

Negative:
- app depends on Google APIs
- OAuth becomes critical
- upload recovery is more complex
- remote assets and DB metadata can become out of sync

## Rule

Any implementation that adds normal raw-video persistence to Supabase must require a new explicit architecture decision.
