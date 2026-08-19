alter table public.creator_partnerships
  add column if not exists notes text not null default '';
