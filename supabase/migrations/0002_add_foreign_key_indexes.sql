create index activity_events_owner_idx
  on public.activity_events(owner_id);

create index assets_content_item_idx
  on public.assets(content_item_id)
  where content_item_id is not null;

create index content_sources_owner_idx
  on public.content_sources(owner_id);

create index content_sources_source_idx
  on public.content_sources(source_id);

create index content_versions_owner_idx
  on public.content_versions(owner_id);

create index status_history_content_item_idx
  on public.status_history(content_item_id);

create index status_history_owner_idx
  on public.status_history(owner_id);
