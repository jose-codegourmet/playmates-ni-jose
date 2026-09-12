# Game and Team Model

## Game

Suggested fields:
- `id`
- `session_id`
- `game_number`
- `sort_order`
- `title`
- `notes`
- `status`
- `visibility`
- `winner_team_no` optional
- `created_at`
- `updated_at`
- `published_at`

## Team representation

Use two team records per normal game:

- Team 1
- Team 2

Do not encode player IDs directly into fixed `player_1`, `player_2`, `player_3`, `player_4` columns.

Use:

`game_teams`
- `id`
- `game_id`
- `team_no`
- `label`

`game_team_players`
- `game_team_id`
- `player_id`
- `sort_order`

This supports:
- doubles
- singles
- unusual formats
- future substitutions or team labels

## Display matchup

Generate from team memberships.

Example:

`José & Carlo vs Mika & Marco`

If players are missing:

`Team 1 vs Team 2`

## Winner/result

Winner tracking should remain optional in MVP.

If included, reference `team_no` or team ID rather than duplicating player names.
