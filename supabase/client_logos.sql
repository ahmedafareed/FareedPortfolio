create table if not exists public.client_logos (
  id uuid primary key default gen_random_uuid(),
  site text not null default 'commercial' check (site in ('travel', 'commercial')),
  title text not null,
  image_url text not null,
  storage_path text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_logos_site_sort_order_idx
  on public.client_logos (site, sort_order, created_at);

alter table public.client_logos enable row level security;

create policy "Public can read client logos"
  on public.client_logos for select
  using (true);