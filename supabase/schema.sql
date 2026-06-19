create extension if not exists pgcrypto;

create table if not exists gm_keys (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  display_name text not null,
  is_superuser boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table gm_keys add column if not exists username text;
alter table gm_keys add column if not exists is_superuser boolean not null default false;

create table if not exists labels (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  x numeric not null,
  y numeric not null,
  type text not null default 'location',
  visibility text not null default 'public',
  destroyed boolean not null default false,
  icon text,
  region text,
  tags text[] not null default '{}',
  linked_dungeons text[] not null default '{}',
  linked_npcs text[] not null default '{}',
  linked_events text[] not null default '{}',
  linked_factions text[] not null default '{}',
  created_by uuid references gm_keys(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gm_notes (
  id uuid primary key default gen_random_uuid(),
  label_id uuid not null references labels(id) on delete cascade,
  note_type text not null,
  title text not null,
  body text not null,
  tags text[] not null default '{}',
  created_by uuid references gm_keys(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table gm_notes add column if not exists tags text[] not null default '{}';
alter table labels add column if not exists destroyed boolean not null default false;

create index if not exists labels_visibility_idx on labels (visibility);
create index if not exists labels_type_idx on labels (type);
create index if not exists gm_notes_label_id_idx on gm_notes (label_id);
create unique index if not exists gm_keys_username_idx on gm_keys (username);

alter table gm_keys enable row level security;
alter table labels enable row level security;
alter table gm_notes enable row level security;

drop policy if exists "Public labels are readable" on labels;
create policy "Public labels are readable"
  on labels
  for select
  to anon, authenticated
  using (visibility = 'public');

drop policy if exists "GM notes are server-only" on gm_notes;
drop policy if exists "GM keys are server-only" on gm_keys;

-- Writes and GM-only reads are intentionally handled by Next.js API routes
-- using SUPABASE_SERVICE_ROLE_KEY. Do not expose that key to the browser.
--
-- Example GM key:
-- insert into gm_keys (id, username, display_name, is_superuser)
-- values ('00000000-0000-4000-8000-000000000000', 'your_username', 'Your Display Name', true);
