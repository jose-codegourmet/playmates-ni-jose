# Provider Assets

A Provider Asset represents the remote copy of a Recording.

## Why this should be a separate table

Do not place a large set of `youtube_*` and `drive_*` columns directly on `recordings`.

A provider table gives cleaner support for:
- multiple providers
- reuploads
- replacement videos
- future services
- provider-specific metadata
- independent lifecycle

## Suggested fields

- `id`
- `recording_id`
- `provider`
- `provider_asset_id`
- `provider_parent_id` optional
- `url`
- `embed_url` optional
- `privacy`
- `title`
- `description`
- `metadata` JSONB
- `status`
- `published_at`
- `created_at`
- `updated_at`

## Provider values

Initial:
- `google_drive`
- `youtube`

Potential later:
- `facebook`
- `vimeo`
- `cloudflare_stream`

## Uniqueness

Recommended unique constraint:

`(recording_id, provider, provider_asset_id)`

If only one active asset per provider is desired, enforce that in application logic or with an `is_active` flag.
