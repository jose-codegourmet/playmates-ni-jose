# Admin Session Workspace

A session should behave like a multi-step workspace rather than many disconnected CRUD forms.

## Header

- date
- title
- venue
- status
- save state
- publish state

## Recommended steps

1. Details
2. Players
3. Import
4. Organize
5. Matchups
6. Upload
7. Review & Publish

Allow navigation between steps after data exists.

## Import screen

Large drag/drop zone.

After selection:
- list file name
- size
- duration
- likely source grouping
- current assigned game/side
- import validation errors

## Organize screen

The most important custom UX.

Desktop layout suggestion:

```text
Unassigned Files     Game Workspace

IMG_1001.mov         Game 1
IMG_2001.mov           Side A
IMG_1002.mov             IMG_1001.mov
IMG_2002.mov           Side B
                         IMG_2001.mov

                     Game 2
                       Side A
                       Side B
```

Support drag/drop.

## Upload screen

Matrix view:

| Recording | Drive | YouTube |
|---|---|---|
| G1 Side A | 72% | queued |
| G1 Side B | complete | 40% |
| G2 Side A | failed | complete |

Do not hide partial failures.

## Publish screen

Show one card per game:
- matchup
- recording links
- YouTube state
- Drive state
- public visibility
- Facebook draft
- copy button
