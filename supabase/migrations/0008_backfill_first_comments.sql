update public.content_items as item
set first_comment = (
  select source.canonical_url
  from public.content_sources as link
  join public.sources as source on source.id = link.source_id
  where link.content_item_id = item.id
  order by source.created_at asc
  limit 1
)
where nullif(item.first_comment, '') is null
  and exists (
    select 1
    from public.content_sources as link
    where link.content_item_id = item.id
  );
