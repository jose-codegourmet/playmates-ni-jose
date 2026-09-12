# Application Architecture

## Suggested stack

Use the repository's established stack first.

Expected:
- Next.js
- TypeScript
- Supabase PostgreSQL
- Supabase Auth
- Jabkit
- Vercel
- Google OAuth
- Google Drive API
- YouTube Data API

## Architecture layers

### UI
Next.js pages/routes and Jabkit components.

### Application/domain
Functions/services for:
- sessions
- games
- players
- pairing
- metadata generation
- publication rules

### Database
Supabase PostgreSQL.

### Integration adapters
- Drive adapter
- YouTube adapter

### Upload orchestration
Tracks independent provider upload jobs.

## Critical media architecture

Do **not**:

```text
Browser -> Vercel API -> Supabase Storage -> Google
```

Prefer:

```text
Browser
  -> App server: authorize/initiate
  -> Google resumable endpoint: upload bytes directly
  -> App server/database: save result metadata
```

## Server responsibilities

- authenticate admin
- authorize actions
- refresh OAuth tokens
- create upload sessions
- save provider results
- protect secrets
- perform small metadata API calls

## Browser responsibilities

- hold selected local File objects
- upload bytes directly to authorized provider endpoints
- show progress
- organize recordings
- report completion/failure

## Supabase responsibilities

- structured data
- relationships
- publication state
- upload state
- provider metadata
- public queries under RLS
