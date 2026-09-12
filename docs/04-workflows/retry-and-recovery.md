# Retry and Recovery

Video uploads are long-running and can fail.

## Provider independence

For every recording:

```text
Drive   ✅ Complete
YouTube ❌ Failed
```

Retry YouTube without re-uploading to Drive.

## Failure categories

- expired access token
- revoked OAuth consent
- quota exceeded
- network interruption
- resumable session expired
- local source file unavailable after reload
- provider processing failure
- invalid metadata
- unsupported file
- user cancellation

## Required UI actions

- retry provider
- cancel pending upload
- reconnect Google account
- reselect local source file
- copy error details
- skip provider
- resume when provider supports it

## Page reload

A web app cannot assume it still owns the local `File` object after reload.

Persist:
- metadata
- remote progress where safe
- upload job state

But when bytes are still needed, prompt:
`Reselect IMG_1234.MOV to continue this upload.`

Future enhancement:
- File System Access API where supported
- local helper/uploader desktop app

## Idempotency

Before starting a duplicate upload:
- check whether a completed provider asset already exists
- require explicit replacement/reupload if it does
