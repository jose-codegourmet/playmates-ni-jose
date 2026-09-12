# Prompt — Public Archive + Publishing

Implement the publish flow and public archive.

Requirements:
- session/game publish controls
- public RLS/query behavior
- sessions index
- session detail
- game detail
- players index/detail
- venues index/detail
- ordered recording display
- YouTube embed/open actions
- Google Drive links
- incomplete-provider warnings in admin
- no private draft leakage

Facebook:
- generate one editable draft per game
- include matchup, date, YouTube links, Drive links
- correctly include multiple parts
- copy-to-clipboard
- optional `posted` status and post URL
- do not automate Facebook login/group posting

Use Jabkit for general UI.
Public pages should be mobile-friendly.
Admin remains optimized for laptop workflows.
