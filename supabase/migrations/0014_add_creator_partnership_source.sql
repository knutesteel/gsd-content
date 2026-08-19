alter table public.creator_partnerships
  add column if not exists source text not null default 'SocialCat';

update public.creator_partnerships
set source = 'SocialCat'
where source is distinct from 'SocialCat';
