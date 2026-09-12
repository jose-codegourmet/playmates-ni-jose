# Domain Model

## High-level relationships

```text
User/Profile
   |
   +-- manages --> Players
   +-- manages --> Venues
   +-- manages --> Sessions

Venue
   +-- has many --> Courts

Session
   +-- belongs to --> Venue
   +-- optionally uses --> Court
   +-- has many --> Games
   +-- has many --> SessionPlayers

Game
   +-- belongs to --> Session
   +-- has many --> GameTeams
   +-- has many --> GamePlayerAssignments
   +-- has many --> Recordings
   +-- has one/many --> PostDrafts

Recording
   +-- belongs to --> Game
   +-- has many --> ProviderAssets
   +-- has many --> UploadJobs

ProviderAsset
   +-- provider = google_drive | youtube
```

## Why Recording is separate from Game

A game is the sporting event.

A recording is a file capturing that event.

This distinction solves:
- interrupted videos
- one camera missing
- multiple cameras
- multiple parts
- provider retry
- future highlights

## Recommended core entities

- `profiles`
- `players`
- `venues`
- `courts`
- `sessions`
- `session_players`
- `games`
- `game_teams`
- `game_team_players`
- `recordings`
- `provider_assets`
- `upload_jobs`
- `post_drafts`
- `oauth_connections`

## Optional entities

Can be added later:
- `game_scores`
- `tags`
- `player_aliases`
- `session_tags`
- `audit_logs`
- `playlists`
