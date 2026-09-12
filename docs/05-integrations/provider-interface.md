# Provider Adapter Interface

Keep provider-specific logic behind a common internal contract.

Conceptually:

```ts
interface MediaProvider {
  initiateUpload(...)
  getUploadStatus(...)
  finalizeUpload(...)
  getAsset(...)
  updateMetadata?(...)
  deleteAsset?(...)
}
```

Providers:
- Google Drive
- YouTube

Benefits:
- independent retries
- cleaner upload orchestration
- future Facebook/Vimeo/other provider additions
- easier testing at integration boundary

Provider adapters should return normalized values:
- provider
- provider asset ID
- URL
- status
- provider metadata

Do not force Drive and YouTube to have identical transport mechanics.
