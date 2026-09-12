# End-to-End Session to Publish Workflow

## Phase 1 — Create session

Admin enters:
- date
- venue/court
- optional session title
- optional notes
- participating players

System creates draft session.

## Phase 2 — Import recordings

Admin drags local video files into an import workspace.

For each browser file, capture:
- filename
- MIME type
- size
- last modified time
- duration if available
- optional creation timestamp if accessible

Create temporary import entries and/or recording rows.

## Phase 3 — Organize

UI presents recordings sorted by:
1. captured/local timestamp if reliable
2. filename
3. manual ordering

Admin creates or confirms game groups.

Example:

```text
Game 1
  Side A
    IMG_1001.MOV
  Side B
    IMG_2001.MOV

Game 2
  Side A
    IMG_1002.MOV
  Side B
    IMG_2002.MOV
    IMG_2003.MOV
```

Admin can:
- move recording between games
- change side
- reorder parts
- create new game
- merge/split groupings
- leave a recording unassigned

## Phase 4 — Assign players

For each game:
- choose Team 1 players
- choose Team 2 players
- optional winner/result
- optional notes

Provide bulk/reuse helpers because the same players often play consecutive games.

## Phase 5 — Review generated metadata

Generate:
- Drive filenames
- YouTube titles
- YouTube descriptions
- Facebook post draft

Admin can edit before upload.

## Phase 6 — Upload

For each selected recording:
- initiate Google Drive resumable upload
- upload directly from browser
- initiate YouTube resumable/media upload
- upload directly or using appropriate Google upload protocol
- track progress independently

The UI must show provider-level status.

## Phase 7 — Save remote identities

After each provider confirms:
- save provider asset ID
- save URL
- save metadata
- mark upload job completed

## Phase 8 — Publish archive

Admin reviews games.

A game can be marked public even if one provider is missing, after a warning.

## Phase 9 — Facebook manual step

For each game, show:

- copy post button
- YouTube links
- Drive links
- optional "Open Facebook Group" link configured in app settings

Admin manually uploads the game videos to Facebook and pastes the generated copy.

## Phase 10 — Session complete

Session page becomes the permanent archive entry.
