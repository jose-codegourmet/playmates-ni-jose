# RLS and Security

## Security goals

- Public users can read only records explicitly marked public/published.
- Only authenticated admin users can mutate app data.
- OAuth secrets and refresh tokens must never be exposed to public/browser database queries.
- Service-role credentials must never run in client code.

## Suggested RLS model

### Public-readable tables
Potentially:
- players
- venues
- sessions
- games
- teams/player memberships
- recordings
- provider_assets

Only expose rows connected to published/public games or sessions.

### Admin-only writes
All insert/update/delete operations should require authenticated admin role.

## Public data minimization

Do not expose:
- admin email
- OAuth connection internals
- upload session URLs
- provider tokens
- internal errors containing credentials
- private notes if they are intended for admin only

If player notes can contain private information, separate:
- `public_bio`
- `admin_notes`

## OAuth token storage

Prefer:
- encrypted server-side storage
- managed secret storage
- a backend-only table inaccessible to normal client roles

Never store a Google refresh token in:
- localStorage
- a public Supabase table
- client-readable environment variables

## File uploads

The browser may send video bytes directly to Google resumable upload endpoints after the server creates an authorized upload session.

This avoids:
- routing multi-GB video through Vercel functions
- server request timeout limits
- duplicate application bandwidth

The server should still control authorization and initiation.
