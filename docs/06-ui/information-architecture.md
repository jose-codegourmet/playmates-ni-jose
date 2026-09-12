# Information Architecture

## Public routes

Suggested:

```text
/
 /sessions
 /sessions/[sessionSlug]
 /games/[gameSlug]
 /players
 /players/[playerSlug]
 /venues
 /venues/[venueSlug]
```

## Admin routes

```text
/admin
/admin/sessions
/admin/sessions/new
/admin/sessions/[id]
/admin/sessions/[id]/import
/admin/sessions/[id]/organize
/admin/sessions/[id]/publish

/admin/players
/admin/players/[id]

/admin/venues
/admin/venues/[id]

/admin/settings
/admin/settings/google
/admin/settings/publishing
```

## Admin dashboard

Show:
- latest sessions
- unfinished uploads
- failed jobs
- sessions awaiting Facebook posting
- quick create session

## Navigation priorities

Admin:
1. Sessions
2. Players
3. Venues
4. Uploads / Jobs
5. Settings

Public:
1. Sessions
2. Players
3. Venues
