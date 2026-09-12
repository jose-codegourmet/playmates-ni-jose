# Observability

Keep observability useful and inexpensive.

## Log events

- session_created
- recording_imported
- game_created
- upload_initiated
- upload_completed
- upload_failed
- oauth_connected
- oauth_revoked
- game_published
- session_published
- facebook_post_marked_complete

## Error reporting

Include:
- internal recording ID
- job ID
- provider
- endpoint/operation
- safe error code

Never log:
- refresh token
- access token
- resumable session URL if it grants upload authority
- full OAuth callback secrets

## Admin diagnostics

A simple upload jobs page is more valuable initially than a complex analytics product.

Filters:
- failed
- active
- session
- provider
