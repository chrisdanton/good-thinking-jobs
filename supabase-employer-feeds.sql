-- GOOD JOBS: automated employer feeds (Greenhouse, Lever, Ashby)
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL Editor → New query →
-- paste → Run). It adds one new table (the employers we pull from) and some
-- optional columns on jobs. Existing listings are untouched. Safe to run twice.

CREATE TABLE IF NOT EXISTS employer_sources (
  id TEXT PRIMARY KEY,
  employer_name TEXT NOT NULL,
  logo TEXT DEFAULT '',
  website TEXT DEFAULT '',
  careers_url TEXT DEFAULT '',
  source_type TEXT NOT NULL,              -- greenhouse | lever | ashby
  source_identifier TEXT NOT NULL,        -- board token / site name (Lever EU: "eu:site")
  active BOOLEAN NOT NULL DEFAULT true,
  auto_publish BOOLEAN NOT NULL DEFAULT false,  -- false = imported roles wait in the review queue
  last_sync_at TIMESTAMPTZ,
  last_successful_sync_at TIMESTAMPTZ,
  last_sync_status TEXT DEFAULT '',       -- ok | failed | suspicious_empty
  last_sync_error TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE employer_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access to employer_sources"
  ON employer_sources FOR ALL USING (true) WITH CHECK (true);

-- Imported roles live in the normal jobs table, so they look and behave like any listing.
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS imported BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT '';          -- greenhouse | lever | ashby
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_employer_id TEXT DEFAULT '';   -- employer_sources.id
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS external_job_id TEXT DEFAULT '';      -- the ATS's own id for the role
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_url TEXT DEFAULT '';           -- the role's page on the ATS
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS import_status TEXT DEFAULT '';        -- active | possibly_closed | closed | excluded
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS missed_syncs INTEGER NOT NULL DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_updated_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS manual_override BOOLEAN NOT NULL DEFAULT false; -- admin edited title/location/category; sync won't overwrite
-- Room for paid upgrades later (an imported role can be featured without re-posting).
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS featured_start TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS featured_end TIMESTAMPTZ;

-- One row per role per employer feed, however many times it syncs.
CREATE UNIQUE INDEX IF NOT EXISTS jobs_import_dedupe_idx
  ON jobs(source_type, source_employer_id, external_job_id)
  WHERE imported = true;
CREATE INDEX IF NOT EXISTS jobs_source_employer_idx ON jobs(source_employer_id);
