alter table public.instagram_connections
  add column if not exists instagram_user_id text,
  add column if not exists media_count integer,
  add column if not exists access_token_encrypted text,
  add column if not exists token_expires_at timestamptz,
  add column if not exists granted_scopes text[] not null default '{}',
  add column if not exists connection_status text not null default 'disconnected',
  add column if not exists last_sync_started_at timestamptz,
  add column if not exists last_sync_error text;

do $$ begin
  alter table public.instagram_connections
    add constraint instagram_connections_status_check
    check (connection_status in ('connected','disconnected','error'));
exception when duplicate_object then null;
end $$;

alter table public.instagram_media
  add column if not exists instagram_media_id text,
  add column if not exists raw_insights jsonb not null default '{}'::jsonb;

create unique index if not exists instagram_media_owner_external_id_idx
  on public.instagram_media(owner_id, instagram_media_id)
  where instagram_media_id is not null;

create table if not exists public.instagram_account_daily (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  connection_id uuid not null references public.instagram_connections(id) on delete cascade,
  snapshot_date date not null,
  followers_count integer not null default 0,
  media_count integer not null default 0,
  views bigint not null default 0,
  reach bigint not null default 0,
  accounts_engaged bigint not null default 0,
  total_interactions bigint not null default 0,
  likes bigint not null default 0,
  comments bigint not null default 0,
  replies bigint not null default 0,
  saves bigint not null default 0,
  shares bigint not null default 0,
  follows bigint not null default 0,
  unfollows bigint not null default 0,
  profile_links_taps bigint not null default 0,
  raw_metrics jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique(owner_id, snapshot_date)
);

create table if not exists public.instagram_media_insights_daily (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  instagram_media_id text not null,
  snapshot_date date not null,
  views bigint not null default 0,
  reach bigint not null default 0,
  saved bigint not null default 0,
  shares bigint not null default 0,
  total_interactions bigint not null default 0,
  like_count integer not null default 0,
  comments_count integer not null default 0,
  engagement_rate numeric not null default 0,
  raw_metrics jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique(owner_id, instagram_media_id, snapshot_date)
);

create table if not exists public.instagram_sync_runs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  connection_id uuid not null references public.instagram_connections(id) on delete cascade,
  status text not null default 'running' check (status in ('running','succeeded','failed')),
  media_synced integer not null default 0,
  error_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists instagram_account_daily_owner_date_idx
  on public.instagram_account_daily(owner_id, snapshot_date desc);
create index if not exists instagram_account_daily_connection_idx
  on public.instagram_account_daily(connection_id);
create index if not exists instagram_media_daily_owner_date_idx
  on public.instagram_media_insights_daily(owner_id, snapshot_date desc);
create index if not exists instagram_sync_runs_owner_started_idx
  on public.instagram_sync_runs(owner_id, started_at desc);
create index if not exists instagram_sync_runs_connection_idx
  on public.instagram_sync_runs(connection_id);
create index if not exists instagram_media_content_item_idx
  on public.instagram_media(content_item_id)
  where content_item_id is not null;

alter table public.instagram_account_daily enable row level security;
alter table public.instagram_media_insights_daily enable row level security;
alter table public.instagram_sync_runs enable row level security;

revoke all on public.instagram_account_daily, public.instagram_media_insights_daily, public.instagram_sync_runs from anon;
grant select, insert, update, delete on public.instagram_account_daily, public.instagram_media_insights_daily, public.instagram_sync_runs to authenticated;
grant select, insert, update, delete on public.instagram_account_daily, public.instagram_media_insights_daily, public.instagram_sync_runs to service_role;

do $$ declare t text; begin
  foreach t in array array['instagram_account_daily','instagram_media_insights_daily','instagram_sync_runs'] loop
    execute format('create policy %I on public.%I for select to authenticated using ((select auth.uid()) = owner_id)', t||'_select_own', t);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = owner_id)', t||'_insert_own', t);
    execute format('create policy %I on public.%I for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id)', t||'_update_own', t);
    execute format('create policy %I on public.%I for delete to authenticated using ((select auth.uid()) = owner_id)', t||'_delete_own', t);
  end loop;
exception when duplicate_object then null;
end $$;
