# YouTube Integration

## Purpose

YouTube is the primary easy-to-watch publishing destination.

## Upload

Use the YouTube Data API's video upload endpoint.

Current Google documentation supports media upload and large videos. API quotas and verification rules can change, so implementation should read the current API documentation before release.

## Important current platform consideration

Google's current documentation states that uploads from certain unverified API projects may be restricted to private viewing until the API project completes the required audit/verification process.

Therefore, implementation must not assume that setting `public` in metadata always makes a new app's upload publicly visible.

## Recommended metadata per recording

Title:
`Sep 9, 2026 | Game 3 | José & Carlo vs Mika & Marco | Side A`

Description can include:
- Playmates ni José
- session date
- venue
- game number
- players
- Drive link
- public app game URL

## Privacy

Configurable default:
- private
- unlisted
- public

For early development, use private/unlisted.

## Provider state

Track:
- queued
- uploading
- uploaded
- processing
- published
- failed

## Save

After successful insert:
- YouTube video ID
- canonical URL
- title
- privacy
- timestamps

## Playlist later

Possible enhancement:
- create one playlist per session
- add all recordings in game order
