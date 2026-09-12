# Upload Architecture

## Problem

Badminton videos can be hundreds of MB or several GB.

Proxying them through a Next.js/Vercel server creates:
- bandwidth duplication
- timeout risk
- memory/body-size problems
- unnecessary cost

## Design

### Step 1
Browser selects local file.

### Step 2
Application creates/updates Recording metadata.

### Step 3
Browser calls secure app endpoint:
`POST /api/uploads/drive/initiate`

Server:
- verifies admin
- obtains Google access token
- creates Drive resumable session
- returns safe session data

### Step 4
Browser uploads to Google directly with progress.

### Step 5
Browser sends completion result to app server.

### Step 6
App persists ProviderAsset + UploadJob completion.

Repeat independently for YouTube.

## Concurrency

Do not upload 20 videos to both providers simultaneously.

Recommended configurable worker pool:
- 1–2 large active files per provider initially

Show pending queue.

## Cancellation

Where transport supports cancellation:
- use `AbortController`
- mark job cancelled
- allow restart

## Progress

Store UI progress frequently in memory.

Persist database progress less frequently to avoid excessive writes.

## Resuming

Provider resume mechanics should be implemented where safely possible, but the app must also handle:
- browser closed
- upload URL expired
- local File object lost

Do not promise perfect resume across browser restarts in MVP.
