begin;

drop index if exists public.instagram_media_owner_external_id_idx;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'instagram_media_owner_external_id_key'
      and conrelid = 'public.instagram_media'::regclass
  ) then
    alter table public.instagram_media
      add constraint instagram_media_owner_external_id_key
      unique (owner_id, instagram_media_id);
  end if;
end
$$;

commit;
