# Google OAuth

Google OAuth is shared by Drive and YouTube integrations but scopes should remain minimal.

## Goals

- José connects his Google account from admin settings.
- Server stores a secure renewable authorization connection.
- Browser never receives long-lived refresh tokens.
- Access can be revoked/reconnected.

## Suggested flow

1. Admin clicks `Connect Google`.
2. Server starts OAuth authorization.
3. Google redirects to application callback.
4. Server validates state.
5. Server stores provider account metadata.
6. Refresh token is stored securely/encrypted.
7. Admin sees connected email/account.
8. Upload APIs obtain short-lived access tokens as needed.

## Scopes

Use only scopes necessary for:
- creating/uploading Drive files/folders
- uploading YouTube videos

Review current Google documentation before implementation because OAuth verification and scope classification can change.

## Settings UI

Show:
- connected Google account
- connection status
- granted capabilities
- reconnect
- disconnect

Do not expose tokens.
