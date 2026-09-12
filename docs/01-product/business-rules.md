# Business Rules

## Sessions
- A session must have a date.
- A venue is recommended but can be optional.
- A session can exist before recordings are uploaded.
- A session may contain zero or many games.
- Session number/date naming is presentation logic, not a primary key.

## Games
- A game belongs to exactly one session.
- Game order is explicit.
- Game numbers should usually be unique inside one session.
- Games may be reordered.
- A game may be created before player assignments are known.
- A game can have zero or many recordings.
- A game can be draft even if all videos are uploaded.
- Public visibility should require an explicit publish action.

## Players
- A player may participate in many sessions/games.
- Facebook identity is optional.
- Player records should not require a Facebook URL.
- A player's display name is the main human-facing identifier.
- Players should be archivable instead of hard-deleted when they already have game history.

## Teams
- A game normally has two teams.
- Team/player assignments should be represented separately from recordings.
- Camera Side A/B must never be used to infer team assignment.

## Recordings
- Multiple recordings per side are valid.
- Missing Side A or Side B is valid.
- Each recording has explicit order/part.
- Unassigned recordings are allowed during import.
- Duplicate file names should not be treated as identity.
- A recording should have a stable database UUID.

## Uploads
- Drive and YouTube statuses are independent.
- Failure on one provider must not invalidate success on the other.
- Retry must be idempotent where practical.
- URLs are only considered final after provider confirmation.

## Publication
- Public archive publication is independent from upload completion.
- An admin may decide to publish with only YouTube, only Drive, both, or neither.
- The UI should warn, not hard-fail, when a game has incomplete provider links.

## Deletion
- Deleting database metadata must never silently delete remote Drive/YouTube assets.
- Remote deletion should be an explicit separate action with confirmation.
