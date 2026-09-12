# Suggested Supabase Database Schema

This is a logical schema. Adapt naming to the repository's existing conventions.

## profiles

```sql
id uuid primary key references auth.users(id)
display_name text
role text not null default 'admin'
created_at timestamptz default now()
updated_at timestamptz default now()
```

## players

```sql
id uuid primary key default gen_random_uuid()
display_name text not null
slug text unique
nickname text
facebook_name text
facebook_url text
notes text
is_archived boolean not null default false
created_at timestamptz default now()
updated_at timestamptz default now()
```

## venues

```sql
id uuid primary key default gen_random_uuid()
name text not null
slug text unique
address text
notes text
is_archived boolean not null default false
created_at timestamptz default now()
updated_at timestamptz default now()
```

## courts

```sql
id uuid primary key default gen_random_uuid()
venue_id uuid not null references venues(id)
name text not null
sort_order integer not null default 0
is_archived boolean not null default false
```

## sessions

```sql
id uuid primary key default gen_random_uuid()
session_date date not null
title text
slug text unique
venue_id uuid references venues(id)
court_id uuid references courts(id)
notes text
status text not null default 'draft'
visibility text not null default 'private'
drive_folder_id text
drive_folder_url text
created_by uuid references profiles(id)
published_at timestamptz
created_at timestamptz default now()
updated_at timestamptz default now()
```

## session_players

```sql
session_id uuid references sessions(id) on delete cascade
player_id uuid references players(id)
primary key (session_id, player_id)
```

## games

```sql
id uuid primary key default gen_random_uuid()
session_id uuid not null references sessions(id) on delete cascade
game_number integer
sort_order integer not null default 0
title text
notes text
status text not null default 'draft'
visibility text not null default 'private'
winner_team_no integer
published_at timestamptz
created_at timestamptz default now()
updated_at timestamptz default now()
```

Recommended:
```sql
unique(session_id, game_number)
```

## game_teams

```sql
id uuid primary key default gen_random_uuid()
game_id uuid not null references games(id) on delete cascade
team_no integer not null
label text
unique(game_id, team_no)
```

## game_team_players

```sql
game_team_id uuid references game_teams(id) on delete cascade
player_id uuid references players(id)
sort_order integer not null default 0
primary key (game_team_id, player_id)
```

## recordings

```sql
id uuid primary key default gen_random_uuid()
session_id uuid not null references sessions(id) on delete cascade
game_id uuid references games(id) on delete set null
original_filename text not null
display_name text
camera_side text not null default 'UNASSIGNED'
part_number integer not null default 1
sort_order integer not null default 0
mime_type text
size_bytes bigint
duration_seconds numeric
captured_at timestamptz
local_last_modified_at timestamptz
checksum text
notes text
status text not null default 'imported'
created_at timestamptz default now()
updated_at timestamptz default now()
```

## provider_assets

```sql
id uuid primary key default gen_random_uuid()
recording_id uuid not null references recordings(id) on delete cascade
provider text not null
provider_asset_id text not null
provider_parent_id text
url text
embed_url text
privacy text
title text
description text
metadata jsonb not null default '{}'::jsonb
status text not null default 'created'
published_at timestamptz
created_at timestamptz default now()
updated_at timestamptz default now()
```

## upload_jobs

```sql
id uuid primary key default gen_random_uuid()
recording_id uuid not null references recordings(id) on delete cascade
provider text not null
status text not null default 'queued'
progress_percent numeric
bytes_uploaded bigint
total_bytes bigint
attempt_count integer not null default 0
resumable_session_ref text
last_error_code text
last_error_message text
started_at timestamptz
completed_at timestamptz
created_at timestamptz default now()
updated_at timestamptz default now()
```

Important: do not persist reusable sensitive upload session URLs if they should remain secret. Prefer encrypted/server-only storage or ephemeral state.

## post_drafts

```sql
id uuid primary key default gen_random_uuid()
game_id uuid not null references games(id) on delete cascade
platform text not null default 'facebook_group'
title text
body text not null
version integer not null default 1
created_at timestamptz default now()
updated_at timestamptz default now()
```

## oauth_connections

Store OAuth connection metadata, but **never plaintext refresh tokens in browser-accessible columns**.

Fields:
- `id`
- `profile_id`
- `provider`
- `provider_account_id`
- `email`
- `scopes`
- encrypted/secure token reference
- expiry metadata
- timestamps

Use an established encrypted server-side secret strategy.
