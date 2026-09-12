# Import and Pairing Workflow

## Goal

Make organizing 10–20+ recordings fast.

## Manual-first MVP

The first version should prioritize a very good manual grouping UI rather than complex AI.

Recommended interaction:

- drag all files
- display ordered file cards/rows
- create Game 1, Game 2, ...
- keyboard/mouse assign to Side A or Side B
- drag recordings between games
- auto-increment part numbers

## Helpful heuristics

Without requiring AI, the app can suggest pairings using:
- file timestamp proximity
- duration similarity
- original file ordering
- source device if detectable
- previous side assignment pattern

Example:
If Phone A files and Phone B files have similar start times, suggest they belong to the same game.

## Confidence

Suggestions must be visibly suggestions.

Never silently publish based on inferred grouping.

## Interrupted video behavior

If Side B has another clip starting shortly after Side B Part 1 ends while Side A remains continuous, suggest:

- same game
- Side B
- next part number

## Single-camera sessions

Allow the whole session to use:
- only Side A
- generic `Main`
- custom camera labels later

The architecture should not require two devices.
