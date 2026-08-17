-- GOOD THINKING Jobs — engagement tracking
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL Editor → New query →
-- paste → Run). It adds a table that records a row every time someone views a
-- job or clicks through to apply, so we can report traffic, top jobs, and
-- click-through rate. Safe to run once; it creates only new things.

CREATE TABLE IF NOT EXISTS job_events (
  id BIGSERIAL PRIMARY KEY,
  job_id TEXT NOT NULL,                 -- which job the event is about
  type TEXT NOT NULL,                   -- 'view' or 'apply_click'
  visitor_id TEXT DEFAULT '',           -- anonymous per-browser id (for unique-visitor counts)
  referrer TEXT DEFAULT '',             -- where the visitor came from, if known
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_events_job_id_idx ON job_events(job_id);
CREATE INDEX IF NOT EXISTS job_events_type_idx ON job_events(type);
CREATE INDEX IF NOT EXISTS job_events_created_at_idx ON job_events(created_at);

-- Events are written only by the server (service role) and never read publicly.
ALTER TABLE job_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to job_events"
  ON job_events FOR ALL
  USING (true)
  WITH CHECK (true);
