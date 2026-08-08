create type public.discovery_result_status as enum ('created', 'existing', 'failed');
create type public.business_module as enum ('collaboration', 'channel', 'retail', 'online_sales');
create type public.business_status as enum ('new', 'research', 'in_process', 'active', 'disqualified', 'complete');

alter table public.scheduled_jobs add column run_after timestamptz not null default now();
create index scheduled_jobs_due_idx on public.scheduled_jobs(owner_id, status, run_after) where status = 'queued';

create table public.discovery_batches (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  status public.run_status not null default 'running',
  submitted_count integer not null check (submitted_count > 0),
  created_count integer not null default 0,
  existing_count integer not null default 0,
  failed_count integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.discovery_results (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  batch_id uuid not null references public.discovery_batches(id) on delete cascade,
  submitted_url text not null,
  canonical_url text,
  status public.discovery_result_status not null,
  source_id uuid references public.sources(id) on delete set null,
  content_item_id uuid references public.content_items(id) on delete set null,
  reason text,
  created_at timestamptz not null default now()
);

create table public.business_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  module public.business_module not null,
  name text not null,
  description text,
  status public.business_status not null default 'new',
  website_url text,
  instagram_url text,
  follower_count integer check (follower_count is null or follower_count >= 0),
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, module, name)
);

create table public.business_tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  business_record_id uuid not null references public.business_records(id) on delete cascade,
  title text not null,
  status public.business_status not null default 'new',
  due_at timestamptz,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index discovery_results_batch_idx on public.discovery_results(batch_id, created_at);
create index business_records_module_idx on public.business_records(owner_id, module, sort_order, updated_at desc);
create index business_tasks_record_idx on public.business_tasks(business_record_id, sort_order, created_at);

alter table public.discovery_batches enable row level security;
alter table public.discovery_results enable row level security;
alter table public.business_records enable row level security;
alter table public.business_tasks enable row level security;

grant select, insert, update, delete on public.discovery_batches, public.discovery_results, public.business_records, public.business_tasks to authenticated;

do $$
declare table_name text;
begin
  foreach table_name in array array['discovery_batches','discovery_results','business_records','business_tasks'] loop
    execute format('create policy %I on public.%I for select to authenticated using ((select auth.uid()) = owner_id)', table_name || '_select_own', table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = owner_id)', table_name || '_insert_own', table_name);
    execute format('create policy %I on public.%I for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id)', table_name || '_update_own', table_name);
    execute format('create policy %I on public.%I for delete to authenticated using ((select auth.uid()) = owner_id)', table_name || '_delete_own', table_name);
  end loop;
end $$;

insert into public.business_records(owner_id, module, name, description, status, website_url, notes, sort_order)
select u.id, seed.module::public.business_module, seed.name, seed.description, seed.status::public.business_status, seed.website_url, seed.notes, seed.sort_order
from auth.users u
cross join (values
  ('channel','Meta Creator Marketplace','Find creators and manage commission partnerships through Meta.','research',null,null,10),
  ('channel','Awin','Affiliate network for publisher and creator partnerships.','research','https://www.awin.com/',null,20),
  ('channel','GoAffPro','Affiliate and influencer program management for Shopify.','research','https://goaffpro.com/',null,30),
  ('channel','Shopify Collabs','Shopify creator discovery, invitations, commissions, and payouts.','in_process','https://www.shopify.com/collabs',null,40),
  ('retail','GSD Consignment','Local consignment outreach and placement plan.','research',null,'Initial targets: weed shops, car washes, Apollo Diner, and Uncle Joe''s Diner.',10),
  ('online_sales','Shopify / Printify','Primary direct-to-consumer storefront and print-on-demand channel.','active','https://hankandthesquirrel.myshopify.com/',null,10),
  ('online_sales','Amazon / Printful','Amazon listing and fulfillment through Printful.','in_process','https://sellercentral.amazon.com/','Restart the application under an email other than knutesteel@gmail.com and select the Individual plan.',20)
) as seed(module,name,description,status,website_url,notes,sort_order)
on conflict(owner_id,module,name) do nothing;
