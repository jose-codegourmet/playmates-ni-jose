# Error Handling

## Error object

Normalize integration errors to:

- provider
- operation
- error code
- human message
- retryable boolean
- HTTP status if available
- safe provider details
- timestamp

Never send secrets to logs/UI.

## Human messages

Good:
`YouTube upload was interrupted. You can retry without changing the game.`

Bad:
`500 INTERNAL_ERROR`

## Retryable examples

Likely:
- transient network errors
- 5xx provider errors
- rate limiting after backoff
- expired short-lived access token after refresh

Not automatically retryable:
- revoked OAuth permission
- unsupported format
- invalid metadata
- audit/privacy restriction
- local file missing

## User feedback

Every failure should answer:
1. What failed?
2. Which video?
3. Which provider?
4. Was the other provider successful?
5. What should José do next?
