create index business_tasks_owner_idx on public.business_tasks(owner_id);
create index discovery_batches_owner_idx on public.discovery_batches(owner_id);
create index discovery_results_owner_idx on public.discovery_results(owner_id);
create index discovery_results_source_idx on public.discovery_results(source_id) where source_id is not null;
create index discovery_results_content_idx on public.discovery_results(content_item_id) where content_item_id is not null;
