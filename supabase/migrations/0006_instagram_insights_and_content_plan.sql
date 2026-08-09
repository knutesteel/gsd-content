create table if not exists public.instagram_connections (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null unique references auth.users(id) on delete cascade default auth.uid(),
  instagram_username text, facebook_page_name text, followers_count integer, last_synced_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.instagram_media (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(), content_item_id uuid references public.content_items(id) on delete set null,
  caption text, media_type text, media_product_type text, media_url text, thumbnail_url text, permalink text, published_at timestamptz,
  views bigint not null default 0, reach bigint not null default 0, like_count integer not null default 0, comments_count integer not null default 0,
  saved bigint not null default 0, shares bigint not null default 0, total_interactions bigint not null default 0, engagement_rate numeric not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.instagram_profiles (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(), username text not null,
  display_name text, biography text, profile_url text, profile_picture_url text, followers_count integer, relationship_type text not null check (relationship_type in ('following','followers')),
  collaboration_status text not null default 'explore', analysis_status text not null default 'not_reviewed', fit_score numeric, fit_label text, content_analysis text,
  imported_at timestamptz not null default now(), unique(owner_id,username,relationship_type)
);
create table if not exists public.instagram_saved_items (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(), instagram_url text not null,
  shortcode text, media_type text, title text, content_overview text, saved_at timestamptz, review_status text not null default 'not_reviewed', imported_at timestamptz not null default now(), unique(owner_id,instagram_url)
);
create index if not exists instagram_media_owner_published_idx on public.instagram_media(owner_id,published_at desc);
create index if not exists instagram_profiles_owner_relationship_idx on public.instagram_profiles(owner_id,relationship_type,fit_score desc);
alter table public.instagram_connections enable row level security;
alter table public.instagram_media enable row level security;
alter table public.instagram_profiles enable row level security;
alter table public.instagram_saved_items enable row level security;
grant select,insert,update,delete on public.instagram_connections,public.instagram_media,public.instagram_profiles,public.instagram_saved_items to authenticated;
do $$ declare t text; begin foreach t in array array['instagram_connections','instagram_media','instagram_profiles','instagram_saved_items'] loop
  execute format('create policy %I on public.%I for select to authenticated using ((select auth.uid()) = owner_id)',t||'_select_own',t);
  execute format('create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = owner_id)',t||'_insert_own',t);
  execute format('create policy %I on public.%I for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id)',t||'_update_own',t);
  execute format('create policy %I on public.%I for delete to authenticated using ((select auth.uid()) = owner_id)',t||'_delete_own',t);
end loop; end $$;
