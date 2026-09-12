# Business Model

## Product type

Playmates ni José is initially a **personal/community media product**, not a commercial SaaS.

Its main economic value is time saved, better organization, and a durable archive for badminton players.

## Primary value

For José:
- substantially reduce repetitive video publishing work
- preserve all recordings in a searchable structure
- avoid manually managing links
- create a player and venue database once and reuse it
- create consistent posts and titles

For playmates:
- easily find their games
- have access to YouTube viewing links
- have access to Google Drive copies
- browse games by session/player/date
- avoid asking José for old files repeatedly

## Cost model

The app should minimize infrastructure cost by keeping large media outside Supabase.

Expected cost centers:
- application hosting, likely Vercel
- Supabase database/auth
- Google Drive storage plan if needed
- YouTube usage subject to API quotas and account/platform rules
- domain name if used

## Future monetization possibilities

Not required for MVP, but the architecture should avoid blocking:
- private clubs
- multiple organizers
- club subscriptions
- branded club pages
- player premium archives
- storage add-ons
- tournament/session management

Do not introduce billing tables or tenancy complexity until there is a real need.
