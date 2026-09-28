create table if not exists public.content_translations (
  id uuid primary key default gen_random_uuid(),
  site text not null default 'travel' check (site in ('travel', 'commercial')),
  locale text not null check (locale in ('es', 'ca')),
  entity_type text not null,
  entity_id uuid not null,
  field text not null,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site, locale, entity_type, entity_id, field)
);

create index if not exists content_translations_lookup_idx
  on public.content_translations (site, locale, entity_type, entity_id);

alter table public.content_translations enable row level security;

create policy "Public can read content translations"
  on public.content_translations for select
  using (true);

insert into public.content_translations
  (site, locale, entity_type, entity_id, field, value)
values
  ('travel', 'es', 'category', '1b90598b-9031-4168-b6e6-97f881a5d444', 'name', 'Retratos'),
  ('travel', 'es', 'category', '1b90598b-9031-4168-b6e6-97f881a5d444', 'display_name', 'Retratos'),
  ('travel', 'es', 'category', 'ed5b51f4-48b2-45ea-9181-e1949832420a', 'name', 'Paisajes'),
  ('travel', 'es', 'category', 'ed5b51f4-48b2-45ea-9181-e1949832420a', 'display_name', 'Paisajes'),
  ('travel', 'es', 'category', 'ccb8cb65-fea6-42b9-b308-e41baa60670d', 'name', 'Viajes'),
  ('travel', 'es', 'category', 'ccb8cb65-fea6-42b9-b308-e41baa60670d', 'display_name', 'Viajes y vida cotidiana'),
  ('travel', 'es', 'category', '36d4112a-15bb-4843-8b2a-caa26ca2e098', 'name', 'Naturaleza'),
  ('travel', 'es', 'category', '36d4112a-15bb-4843-8b2a-caa26ca2e098', 'display_name', 'Naturaleza'),

  ('travel', 'ca', 'category', '1b90598b-9031-4168-b6e6-97f881a5d444', 'name', 'Retrats'),
  ('travel', 'ca', 'category', '1b90598b-9031-4168-b6e6-97f881a5d444', 'display_name', 'Retrats'),
  ('travel', 'ca', 'category', 'ed5b51f4-48b2-45ea-9181-e1949832420a', 'name', 'Paisatges'),
  ('travel', 'ca', 'category', 'ed5b51f4-48b2-45ea-9181-e1949832420a', 'display_name', 'Paisatges'),
  ('travel', 'ca', 'category', 'ccb8cb65-fea6-42b9-b308-e41baa60670d', 'name', 'Viatges'),
  ('travel', 'ca', 'category', 'ccb8cb65-fea6-42b9-b308-e41baa60670d', 'display_name', 'Viatges i vida quotidiana'),
  ('travel', 'ca', 'category', '36d4112a-15bb-4843-8b2a-caa26ca2e098', 'name', 'Natura'),
  ('travel', 'ca', 'category', '36d4112a-15bb-4843-8b2a-caa26ca2e098', 'display_name', 'Natura'),

  ('commercial', 'es', 'category', '65a03ec3-5819-4426-945a-465890f83b78', 'name', 'Eventos'),
  ('commercial', 'es', 'category', '65a03ec3-5819-4426-945a-465890f83b78', 'display_name', 'Eventos'),
  ('commercial', 'es', 'category', 'c6580f6d-2ab9-4ed0-abce-f1cb09876341', 'name', 'Festivales'),
  ('commercial', 'es', 'category', 'c6580f6d-2ab9-4ed0-abce-f1cb09876341', 'display_name', 'Festivales y celebraciones'),
  ('commercial', 'es', 'category', 'ce3d9900-d1c0-4de3-ad3f-451be3195e02', 'name', 'Arquitectura'),
  ('commercial', 'es', 'category', 'ce3d9900-d1c0-4de3-ad3f-451be3195e02', 'display_name', 'Arquitectura'),
  ('commercial', 'es', 'category', '7908e25b-04b7-4db6-a351-68e2603e6094', 'name', 'Deportes'),
  ('commercial', 'es', 'category', '7908e25b-04b7-4db6-a351-68e2603e6094', 'display_name', 'Deportes'),

  ('commercial', 'ca', 'category', '65a03ec3-5819-4426-945a-465890f83b78', 'name', 'Esdeveniments'),
  ('commercial', 'ca', 'category', '65a03ec3-5819-4426-945a-465890f83b78', 'display_name', 'Esdeveniments'),
  ('commercial', 'ca', 'category', 'c6580f6d-2ab9-4ed0-abce-f1cb09876341', 'name', 'Festivals'),
  ('commercial', 'ca', 'category', 'c6580f6d-2ab9-4ed0-abce-f1cb09876341', 'display_name', 'Festivals i celebracions'),
  ('commercial', 'ca', 'category', 'ce3d9900-d1c0-4de3-ad3f-451be3195e02', 'name', 'Arquitectura'),
  ('commercial', 'ca', 'category', 'ce3d9900-d1c0-4de3-ad3f-451be3195e02', 'display_name', 'Arquitectura'),
  ('commercial', 'ca', 'category', '7908e25b-04b7-4db6-a351-68e2603e6094', 'name', 'Esports'),
  ('commercial', 'ca', 'category', '7908e25b-04b7-4db6-a351-68e2603e6094', 'display_name', 'Esports')
on conflict (site, locale, entity_type, entity_id, field)
do update set
  value = excluded.value,
  updated_at = now();