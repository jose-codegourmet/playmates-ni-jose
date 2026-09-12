# Google Drive Integration

## Purpose

Google Drive holds downloadable/source copies of recordings.

## Folder strategy

Recommended:

```text
Playmates ni Jose/
  2026/
    2026-09-09/
      Game 01/
        2026-09-09 - Game 01 - Side A.mov
        2026-09-09 - Game 01 - Side B.mov
      Game 02/
        ...
```

A flatter structure is also acceptable if José prefers fewer folders.

## Session folder

Store on `sessions`:
- `drive_folder_id`
- `drive_folder_url`

## Upload method

Use **resumable uploads** for badminton videos because they are large and interruptions are realistic.

Google Drive's current official documentation recommends resumable upload for large files and interrupted networks.

## Recommended browser/server responsibility

Server:
- gets/refreshes OAuth access
- creates/identifies destination folder
- initiates authorized upload session
- returns only what the browser needs

Browser:
- streams/chunks local video directly to Google
- shows progress

This prevents Vercel/server functions from proxying huge files.

## Post-upload

Save:
- Drive file ID
- folder ID
- web view/download URL as appropriate
- filename
- MIME type
- size
- provider metadata

## Permissions

The app should not automatically make all Drive files world-public without an explicit policy.

Possible defaults:
- anyone with link
- restricted
- domain-specific later

Make this configurable.

## Deletion

Never delete a remote Drive file just because a recording row is deleted.

Provide a separate action:
`Delete from Google Drive`
with confirmation.
