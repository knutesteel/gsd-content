create extension if not exists pgcrypto;

create type public.content_status as enum ('new', 'auto_added', 'generated', 'posted', 'archived');
create type public.run_status as enum ('queued', 'running', 'succeeded', 'failed', 'cancelled');
create type public.asset_kind as enum ('image', 'carousel_slide', 'thumbnail', 'source_file', 'export');

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  identifier text not null,
  parent_id uuid references public.content_items(id) on delete set null,
  variation_number integer check (variation_number is null or variation_number > 0),
  title text,
  status public.content_status not null default 'new',
  content_type text,
  panel_count integer check (panel_count is null or panel_count > 0),
  overview text,
  content text,
  caption text,
  generation_prompt text,
  score numeric,
  priority integer,
  is_favorite boolean not null default false,
  instagram_url text,
  publishing_notes text,
  generated_at timestamptz,
  posted_at timestamptz,
  archived_at timestamptz,
  record_version integer not null default 1 check (record_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, identifier)
);

create table public.content_versions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  snapshot jsonb not null,
  change_reason text,
  created_at timestamptz not null default now(),
  unique (content_item_id, version_number)
);

create table public.status_history (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  from_status public.content_status,
  to_status public.content_status not null,
  reason text,
  created_at timestamptz not null default now()
);

create table public.generation_runs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  idempotency_key text not null,
  status public.run_status not null default 'queued',
  prompt text not null,
  output jsonb,
  error_message text,
  promoted_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (owner_id, idempotency_key)
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  canonical_url text not null,
  website text,
  title text,
  summary text,
  strongest_comment text,
  discovered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (owner_id, canonical_url)
);

create table public.content_sources (
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  primary key (content_item_id, source_id)
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  content_item_id uuid references public.content_items(id) on delete cascade,
  kind public.asset_kind not null,
  storage_path text not null,
  slide_number integer check (slide_number is null or slide_number > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (owner_id, storage_path)
);

create table public.activity_events (
  id bigint generated always as identity primary key,
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  content_item_id uuid references public.content_items(id) on delete cascade,
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.metrics (
  id bigint generated always as identity primary key,
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  metric_name text not null,
  metric_value numeric not null,
  measured_at timestamptz not null,
  notes text,
  unique (owner_id, metric_name, measured_at)
);

create table public.scheduled_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  job_type text not null,
  idempotency_key text not null,
  status public.run_status not null default 'queued',
  input jsonb not null default '{}'::jsonb,
  result jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (owner_id, idempotency_key)
);

create table public.app_settings (
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  setting_key text not null,
  setting_value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (owner_id, setting_key)
);

create index content_items_status_idx on public.content_items(owner_id, status);
create index content_items_posted_idx on public.content_items(owner_id, posted_at desc) where posted_at is not null;
create index content_items_parent_idx on public.content_items(parent_id, variation_number);
create index generation_runs_item_idx on public.generation_runs(content_item_id, created_at desc);
create index activity_events_item_idx on public.activity_events(content_item_id, created_at desc);

alter table public.content_items enable row level security;
alter table public.content_versions enable row level security;
alter table public.status_history enable row level security;
alter table public.generation_runs enable row level security;
alter table public.sources enable row level security;
alter table public.content_sources enable row level security;
alter table public.assets enable row level security;
alter table public.activity_events enable row level security;
alter table public.metrics enable row level security;
alter table public.scheduled_jobs enable row level security;
alter table public.app_settings enable row level security;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

do $$
declare table_name text;
begin
  foreach table_name in array array['content_items','content_versions','status_history','generation_runs','sources','content_sources','assets','activity_events','metrics','scheduled_jobs','app_settings']
  loop
    execute format('create policy %I on public.%I for select to authenticated using ((select auth.uid()) = owner_id)', table_name || '_select_own', table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = owner_id)', table_name || '_insert_own', table_name);
    execute format('create policy %I on public.%I for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id)', table_name || '_update_own', table_name);
    execute format('create policy %I on public.%I for delete to authenticated using ((select auth.uid()) = owner_id)', table_name || '_delete_own', table_name);
  end loop;
end $$;

insert into storage.buckets (id, name, public)
values ('content-assets', 'content-assets', false)
on conflict (id) do nothing;

create policy content_assets_select_own on storage.objects for select to authenticated
using (bucket_id = 'content-assets' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy content_assets_insert_own on storage.objects for insert to authenticated
with check (bucket_id = 'content-assets' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy content_assets_update_own on storage.objects for update to authenticated
using (bucket_id = 'content-assets' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'content-assets' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy content_assets_delete_own on storage.objects for delete to authenticated
using (bucket_id = 'content-assets' and (storage.foldername(name))[1] = (select auth.uid())::text);
