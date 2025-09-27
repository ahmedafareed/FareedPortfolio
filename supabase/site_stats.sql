-- Table: site_stats
CREATE TABLE IF NOT EXISTS site_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site text NOT NULL, -- 'travel' or 'commercial'
    label text NOT NULL,
    value integer NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Index for fast lookup by site
CREATE INDEX IF NOT EXISTS idx_site_stats_site ON site_stats(site);

-- Example row:
-- INSERT INTO site_stats (site, label, value, sort_order) VALUES ('travel', 'PROJECTS', 30, 1);
-- INSERT INTO site_stats (site, label, value, sort_order) VALUES ('travel', 'YEARS of Experience', 8, 2);
-- INSERT INTO site_stats (site, label, value, sort_order) VALUES ('commercial', 'PROJECTS', 30, 1);
-- INSERT INTO site_stats (site, label, value, sort_order) VALUES ('commercial', 'YEARS of Experience', 8, 2);
