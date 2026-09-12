# Session Model

## Definition

A Session is the main organizational unit for one play date/event.

## Suggested fields

- `id`
- `session_date`
- `title`
- `slug`
- `venue_id`
- `court_id` optional
- `notes`
- `status`
- `visibility`
- `drive_folder_id`
- `drive_folder_url`
- `created_by`
- `created_at`
- `updated_at`
- `published_at`

## Status

Suggested:
- `draft`
- `organizing`
- `uploading`
- `ready`
- `published`
- `archived`

Status should describe workflow convenience, not be relied on as the only source of truth for individual upload state.

## Session players

Store participating players through a join table rather than a JSON array.

This allows:
- player history
- filtering
- statistics later
- efficient public player pages

A player may be part of the session without appearing in every game.
