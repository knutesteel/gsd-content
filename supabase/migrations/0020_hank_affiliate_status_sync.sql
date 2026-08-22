alter table public.creator_partnerships
  add column if not exists hank_affiliate_id uuid;

create unique index if not exists creator_partnerships_hank_affiliate_id_key
  on public.creator_partnerships (hank_affiliate_id)
  where hank_affiliate_id is not null;

create or replace function public.verify_hank_affiliate_sync_secret(candidate text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from vault.decrypted_secrets
    where name = 'hank_affiliate_status_sync'
      and decrypted_secret = candidate
  );
$$;

revoke all on function public.verify_hank_affiliate_sync_secret(text) from public, anon, authenticated;
grant execute on function public.verify_hank_affiliate_sync_secret(text) to service_role;

comment on column public.creator_partnerships.hank_affiliate_id is
  'Stable link to the matching affiliate record in the Hank Supabase project.';

