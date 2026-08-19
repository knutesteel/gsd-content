alter table public.creator_partnerships
  add column if not exists is_following boolean not null default false,
  add column if not exists followed_at timestamptz,
  add column if not exists dm_sent_count integer not null default 0 check (dm_sent_count >= 0),
  add column if not exists dm_received_count integer not null default 0 check (dm_received_count >= 0),
  add column if not exists unread_dm_count integer not null default 0 check (unread_dm_count >= 0),
  add column if not exists last_dm_sent_at timestamptz,
  add column if not exists last_dm_received_at timestamptz,
  add column if not exists last_dm_read_at timestamptz;

create index if not exists creator_partnerships_owner_unread_idx
  on public.creator_partnerships(owner_id, unread_dm_count)
  where unread_dm_count > 0;
