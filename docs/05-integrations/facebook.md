# Facebook Group Workflow

## MVP boundary

Do not build the product around unofficial automation that logs into Facebook and simulates browser clicks.

The app should treat Facebook Group publishing as a **manual final step** unless an official supported Meta API is available for the exact use case at implementation time.

## What the app automates

For each game, generate:

```text
Game 3 — Sep 9, 2026

José & Carlo
vs
Mika & Marco

YouTube:
Side A: <url>
Side B: <url>

Google Drive:
Side A: <url>
Side B: <url>
```

When a side has multiple parts:

```text
Side B — Part 1: <url>
Side B — Part 2: <url>
```

## Admin UI

Per game:
- preview caption
- edit caption
- copy caption
- copy all links
- optional `Open Playmates ni José Facebook Group`
- manual checkbox/status: `Posted to Facebook`

## Facebook posting status

Store only app metadata such as:
- `facebook_posted_at`
- `facebook_post_url` optional
- `facebook_post_notes`

Do not pretend the app verified a post unless it actually has a supported API signal.

## Future

If Meta later exposes an official group publishing path usable by this app, add it as a provider adapter rather than rewriting the domain model.
