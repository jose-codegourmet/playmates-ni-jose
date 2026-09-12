# Naming Conventions

Naming should be generated but editable.

## Session folder name

Recommended default:

`YYYY-MM-DD`

Example:

`2026-09-09`

If José prefers his existing display convention, the UI may display:

`09-09-26`

while still using ISO dates internally.

## Recording display name

Recommended:

`Game {gameNumber} - Side {side} - Part {part}`

Examples:

- `Game 1 - Side A`
- `Game 1 - Side B`
- `Game 2 - Side B - Part 1`
- `Game 2 - Side B - Part 2`

## Google Drive filename

Keep original extension.

Examples:

`2026-09-09 - Game 01 - Side A.mp4`

`2026-09-09 - Game 02 - Side B - Part 02.mov`

## YouTube title

Default template:

`{date} | Game {gameNumber} | {team1} vs {team2} | {sideLabel}`

Example:

`Sep 9, 2026 | Game 3 | José & Carlo vs Mika & Marco | Side A`

If players are unknown:

`Sep 9, 2026 | Game 3 | Side A`

## Public slug

Prefer stable human-readable slugs plus IDs where necessary.

Examples:

- `/sessions/2026-09-09`
- `/games/2026-09-09-game-3`
- `/players/jose`
- `/venues/venue-slug`

Slug collisions must be handled automatically.
