-- Commercial site duplicated tables
-- Run after original (travel) schema is in place.
-- These tables mirror structure; adjust constraints/indexes as needed.

create table if not exists commercial_portfolio_categories (
  like portfolio_categories including all
);

create table if not exists commercial_portfolio_images (
  like portfolio_images including all
);

create table if not exists commercial_awards (
  like awards including all
);

create table if not exists commercial_exhibitions (
  like exhibitions including all
);

create table if not exists commercial_site_settings (
  like site_settings including all
);

-- Optionally: seed minimal settings for commercial
insert into commercial_site_settings (key, value, description, type)
select key, value, description, type from site_settings
on conflict (key) do nothing;

-- Example: differentiate hero/tagline for commercial
-- update commercial_site_settings set value = 'COMMERCIAL | AVAILABLE FOR ASSIGNMENTS' where key = 'site_tagline';
