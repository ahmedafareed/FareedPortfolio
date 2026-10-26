-- Commercial portfolio update: add Portrait + Editorial categories
-- and translation rows for category labels.
-- Run after commercial_schema.sql and content_translations.sql.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM commercial_portfolio_categories
    WHERE name = 'portraits'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM commercial_portfolio_categories
    WHERE name = 'portrait'
  ) THEN
    UPDATE commercial_portfolio_categories
    SET
      name = 'portrait',
      display_name = 'Portrait',
      updated_at = NOW()
    WHERE name = 'portraits';
  END IF;
END $$;

WITH missing_categories AS (
  SELECT
    category.name,
    category.display_name,
    category.sort_rank
  FROM (
    VALUES
      ('portrait', 'Portrait', 1),
      ('editorial', 'Editorial', 2)
  ) AS category(name, display_name, sort_rank)
  WHERE NOT EXISTS (
    SELECT 1
    FROM commercial_portfolio_categories existing
    WHERE existing.name = category.name
  )
),
base_sort AS (
  SELECT COALESCE(MAX(sort_order), 0) AS max_sort
  FROM commercial_portfolio_categories
)
INSERT INTO commercial_portfolio_categories (name, display_name, description, sort_order)
SELECT
  missing_categories.name,
  missing_categories.display_name,
  NULL,
  base_sort.max_sort + missing_categories.sort_rank
FROM missing_categories
CROSS JOIN base_sort;

UPDATE commercial_portfolio_categories
SET
  display_name = 'Portrait',
  updated_at = NOW()
WHERE name = 'portrait'
  AND display_name <> 'Portrait';

UPDATE commercial_portfolio_categories
SET
  display_name = 'Editorial',
  updated_at = NOW()
WHERE name = 'editorial'
  AND display_name <> 'Editorial';

INSERT INTO public.content_translations (site, locale, entity_type, entity_id, field, value)
SELECT
  'commercial',
  translations.locale,
  'category',
  categories.id,
  translations.field,
  translations.value
FROM commercial_portfolio_categories categories
JOIN (
  VALUES
    ('portrait', 'es', 'name', 'Retrato'),
    ('portrait', 'es', 'display_name', 'Retrato'),
    ('portrait', 'ca', 'name', 'Retrat'),
    ('portrait', 'ca', 'display_name', 'Retrat'),
    ('editorial', 'es', 'name', 'Editorial'),
    ('editorial', 'es', 'display_name', 'Editorial'),
    ('editorial', 'ca', 'name', 'Editorial'),
    ('editorial', 'ca', 'display_name', 'Editorial')
) AS translations(category_name, locale, field, value)
  ON categories.name = translations.category_name
ON CONFLICT (site, locale, entity_type, entity_id, field)
DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();