# Recording Model

## Definition

A Recording is one local video file imported into the session workspace.

## Suggested fields

- `id`
- `game_id` nullable while unassigned
- `session_id`
- `original_filename`
- `display_name`
- `camera_side`
- `part_number`
- `sort_order`
- `mime_type`
- `size_bytes`
- `duration_seconds` nullable
- `captured_at` nullable
- `local_last_modified_at` nullable
- `checksum` optional
- `notes`
- `status`
- `created_at`
- `updated_at`

## `camera_side`

Recommended values initially:
- `A`
- `B`
- `UNASSIGNED`

Prefer text or a lookup table over a rigid Postgres enum if custom sides may be introduced later.

## Part numbering

Part numbers are scoped to:

`game + camera_side`

Example:

Game 2:
- Side A / Part 1
- Side B / Part 1
- Side B / Part 2

## Important rule

The database should never enforce:
- exactly one Side A recording
- exactly one Side B recording
- exactly two recordings per game

## Local file lifecycle

A selected browser `File` object is temporary and cannot be recovered after page reload unless the browser supports persistent file handles and the application explicitly implements that.

Therefore:
- metadata can be saved immediately
- unfinished local uploads should clearly indicate that the source file must be reselected after a full refresh unless persistent handles are implemented
- do not pretend the server has a file that only existed in the browser
