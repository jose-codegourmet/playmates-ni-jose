# MVP Acceptance Criteria

MVP is complete when José can perform this scenario:

## Scenario

José played 10 games and has 21 recordings.

- Most games have one Side A and one Side B.
- Game 4 Side B has two parts.
- Game 8 has only one camera recording.

## Required result

1. José logs in.
2. Creates a Sep 9, 2026 session.
3. Selects a venue.
4. Adds/selects all participants.
5. Drops all 21 videos into the app.
6. Organizes them into 10 games.
7. Game 4 stores Side B Part 1 and Part 2 correctly.
8. Game 8 accepts only one recording without error.
9. José assigns players to each game.
10. App generates titles/descriptions.
11. José uploads all selected videos to Drive.
12. José uploads all selected videos to YouTube.
13. Upload progress is visible.
14. A failed YouTube video can retry without repeating its successful Drive upload.
15. Provider URLs are stored in Supabase.
16. Raw video bytes are not stored in Supabase.
17. José publishes the session.
18. Public visitors can browse the session and games.
19. Each game has generated Facebook-ready text.
20. José can copy the text and manually post/upload to the Facebook Group.

## Non-functional acceptance

- Responsive enough for admin use on laptop.
- Public pages work well on mobile.
- No secret OAuth token appears in client-visible data.
- Build/check passes.
- Existing template conventions are respected.
- Existing Jabkit components are reused.
