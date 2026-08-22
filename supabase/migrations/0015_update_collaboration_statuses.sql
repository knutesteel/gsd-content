alter table public.creator_partnerships
  drop constraint if exists creator_partnerships_status_check;

update public.creator_partnerships
set status = 'active', updated_at = now()
where status = 'accepted';

alter table public.creator_partnerships
  add constraint creator_partnerships_status_check
  check (status in ('new', 'contacted', 'in_process', 'active', 'rejected', 'disqualified'));
