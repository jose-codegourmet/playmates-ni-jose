# ADR-005 — Direct-to-Provider Large File Upload

## Status
Accepted

## Decision

For large media bytes, prefer:

```text
Browser -> Google provider upload endpoint
```

after secure server-side authorization/initiation.

Avoid:

```text
Browser -> Next.js/Vercel server -> Google
```

for the full video body.

## Reason

Direct upload:
- avoids request body/time limits
- avoids duplicate bandwidth
- enables better progress
- is appropriate for resumable upload protocols

## Security condition

The application server remains responsible for admin authorization and secret/token handling.
