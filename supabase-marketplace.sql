-- GOOD JOBS: Jobs, Projects and Asks
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL Editor → New query →
-- paste → Run). It adds three optional columns to the existing jobs table. Every
-- existing listing stays exactly as it is and counts as a job. Safe to run twice.

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS marketplace_type TEXT NOT NULL DEFAULT 'job'; -- job | project | ask
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ask_type TEXT DEFAULT '';                     -- sponsor | speaker | partner | venue | collaborator | introduction | other
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS event_date DATE;                               -- optional, for asks tied to an event

CREATE INDEX IF NOT EXISTS jobs_marketplace_type_idx ON jobs(marketplace_type);
