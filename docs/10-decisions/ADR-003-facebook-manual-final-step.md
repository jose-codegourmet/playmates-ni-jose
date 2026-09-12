# ADR-003 — Facebook Is a Manual Final Step

## Status
Accepted for MVP

## Decision

The app generates Facebook Group post content but does not use unofficial browser automation to publish posts.

## Reason

Facebook Group API capabilities and permissions are platform-controlled and may not support this workflow reliably. Browser automation would be fragile and could create account/policy risk.

## App responsibility

- generate complete post text
- generate links
- provide copy button
- optionally open group link
- let admin mark post complete

## Future

Revisit only if an official supported Meta API exists for the required account/group context.
