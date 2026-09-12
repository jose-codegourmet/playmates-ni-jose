# Indexes and Constraints

## Suggested indexes

### sessions
- `session_date desc`
- `venue_id`
- `visibility`
- `status`

### games
- `(session_id, sort_order)`
- `(session_id, game_number)`
- `visibility`

### session_players
- `player_id`

### game_team_players
- `player_id`

### recordings
- `(session_id, sort_order)`
- `(game_id, camera_side, part_number)`
- `status`

### provider_assets
- `(recording_id, provider)`
- `(provider, provider_asset_id)`

### upload_jobs
- `(recording_id, provider)`
- `status`
- `created_at desc`

## Constraints

Use DB constraints for facts that must always be true:
- non-null ownership relationships
- unique game number per session, if game numbers are required
- unique team number per game
- valid foreign keys

Do not use rigid constraints for workflow assumptions that may vary:
- exactly 4 players
- exactly 2 recordings
- exactly 2 cameras
- all games must have scores
- all recordings must have both provider URLs
