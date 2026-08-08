create or replace function public.save_content_item(
  p_id uuid,
  p_expected_version integer,
  p_title text,
  p_status public.content_status,
  p_content_type text,
  p_panel_count integer,
  p_overview text,
  p_content text,
  p_caption text,
  p_generation_prompt text,
  p_score numeric,
  p_priority integer,
  p_is_favorite boolean,
  p_instagram_url text,
  p_publishing_notes text,
  p_reason text default 'Content edited'
) returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_old public.content_items%rowtype;
  v_new public.content_items%rowtype;
  v_now timestamptz := now();
begin
  select * into v_old
  from public.content_items
  where id = p_id and owner_id = (select auth.uid());

  if not found then
    return jsonb_build_object('result', 'failed', 'reason', 'Content item not found');
  end if;

  if v_old.record_version <> p_expected_version then
    return jsonb_build_object('result', 'conflict', 'reason', 'This item was changed after you opened it', 'current_version', v_old.record_version);
  end if;

  insert into public.content_versions(owner_id, content_item_id, version_number, snapshot, change_reason)
  values (v_old.owner_id, v_old.id, v_old.record_version, to_jsonb(v_old), nullif(p_reason, ''))
  on conflict (content_item_id, version_number) do nothing;

  update public.content_items set
    title = nullif(p_title, ''), status = p_status, content_type = nullif(p_content_type, ''),
    panel_count = p_panel_count, overview = nullif(p_overview, ''), content = nullif(p_content, ''),
    caption = nullif(p_caption, ''), generation_prompt = nullif(p_generation_prompt, ''), score = p_score,
    priority = p_priority, is_favorite = p_is_favorite, instagram_url = nullif(p_instagram_url, ''),
    publishing_notes = nullif(p_publishing_notes, ''),
    generated_at = case when p_status = 'generated' and v_old.status <> 'generated' then v_now else generated_at end,
    posted_at = case when p_status = 'posted' and v_old.status <> 'posted' then v_now when p_status <> 'posted' then null else posted_at end,
    archived_at = case when p_status = 'archived' and v_old.status <> 'archived' then v_now when p_status <> 'archived' then null else archived_at end,
    record_version = record_version + 1, updated_at = v_now
  where id = p_id and owner_id = (select auth.uid()) and record_version = p_expected_version
  returning * into v_new;

  if not found then
    return jsonb_build_object('result', 'conflict', 'reason', 'This item changed while it was being saved');
  end if;

  if v_old.status is distinct from v_new.status then
    insert into public.status_history(owner_id, content_item_id, from_status, to_status, reason)
    values (v_new.owner_id, v_new.id, v_old.status, v_new.status, nullif(p_reason, ''));
  end if;

  insert into public.activity_events(owner_id, content_item_id, event_type, details)
  values (v_new.owner_id, v_new.id, 'content_saved', jsonb_build_object('version', v_new.record_version, 'reason', p_reason));

  return jsonb_build_object('result', 'saved', 'version', v_new.record_version, 'identifier', v_new.identifier);
end;
$$;

create or replace function public.create_content_item(p_title text default null)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_identifier text;
  v_item public.content_items%rowtype;
begin
  perform pg_advisory_xact_lock(hashtext((select auth.uid())::text || ':content_identifier'));
  select coalesce(max((regexp_match(identifier, '^([0-9]+)$'))[1]::integer), 0) + 1
    into v_identifier from public.content_items
    where owner_id = (select auth.uid()) and identifier ~ '^[0-9]+$';

  insert into public.content_items(owner_id, identifier, title)
  values ((select auth.uid()), v_identifier, nullif(p_title, '')) returning * into v_item;
  insert into public.status_history(owner_id, content_item_id, to_status, reason)
  values (v_item.owner_id, v_item.id, v_item.status, 'Content item created');
  insert into public.activity_events(owner_id, content_item_id, event_type, details)
  values (v_item.owner_id, v_item.id, 'content_created', jsonb_build_object('identifier', v_item.identifier));
  return jsonb_build_object('result', 'created', 'id', v_item.id, 'identifier', v_item.identifier);
end;
$$;

create or replace function public.duplicate_content_item(p_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_source public.content_items%rowtype;
  v_parent_id uuid;
  v_root_identifier text;
  v_variation integer;
  v_item public.content_items%rowtype;
begin
  select * into v_source from public.content_items where id = p_id and owner_id = (select auth.uid());
  if not found then return jsonb_build_object('result', 'failed', 'reason', 'Content item not found'); end if;

  v_parent_id := coalesce(v_source.parent_id, v_source.id);
  select identifier into v_root_identifier from public.content_items where id = v_parent_id;
  perform pg_advisory_xact_lock(hashtext((select auth.uid())::text || ':' || v_root_identifier));
  select coalesce(max(variation_number), 0) + 1 into v_variation
    from public.content_items where owner_id = (select auth.uid()) and parent_id = v_parent_id;

  insert into public.content_items(owner_id, identifier, parent_id, variation_number, title, status, content_type,
    panel_count, overview, content, caption, generation_prompt, score, priority, is_favorite)
  values (v_source.owner_id, v_root_identifier || '-' || v_variation, v_parent_id, v_variation,
    coalesce(v_source.title, 'Variation') || ' — Variation ' || v_variation, 'new', v_source.content_type,
    v_source.panel_count, v_source.overview, v_source.content, v_source.caption, v_source.generation_prompt,
    v_source.score, v_source.priority, false) returning * into v_item;
  insert into public.status_history(owner_id, content_item_id, to_status, reason)
  values (v_item.owner_id, v_item.id, v_item.status, 'Duplicated from ' || v_source.identifier);
  insert into public.activity_events(owner_id, content_item_id, event_type, details)
  values (v_item.owner_id, v_item.id, 'content_duplicated', jsonb_build_object('source_identifier', v_source.identifier));
  return jsonb_build_object('result', 'created', 'id', v_item.id, 'identifier', v_item.identifier);
end;
$$;

revoke execute on function public.save_content_item(uuid, integer, text, public.content_status, text, integer, text, text, text, text, numeric, integer, boolean, text, text, text) from public, anon;
revoke execute on function public.create_content_item(text) from public, anon;
revoke execute on function public.duplicate_content_item(uuid) from public, anon;
grant execute on function public.save_content_item(uuid, integer, text, public.content_status, text, integer, text, text, text, text, numeric, integer, boolean, text, text, text) to authenticated;
grant execute on function public.create_content_item(text) to authenticated;
grant execute on function public.duplicate_content_item(uuid) to authenticated;
