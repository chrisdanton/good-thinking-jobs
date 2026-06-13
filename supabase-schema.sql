-- GOOD THINKING Jobs — Supabase schema
-- Run this in the Supabase SQL editor after creating your project

CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  poster_name TEXT NOT NULL,
  poster_email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo TEXT DEFAULT '',
  company_website TEXT DEFAULT '',
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  location_type TEXT NOT NULL,
  role_level TEXT NOT NULL,
  salary_min INTEGER DEFAULT 0,
  salary_max INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  requirements TEXT DEFAULT '',
  external_apply_url TEXT DEFAULT '',
  tier TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'pending',
  flagged_for_newsletter BOOLEAN DEFAULT false,
  approval_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX jobs_status_idx ON jobs(status);
CREATE INDEX jobs_approval_token_idx ON jobs(approval_token);

-- Allow public read of active jobs (no auth required for job browsing)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active jobs are publicly readable"
  ON jobs FOR SELECT
  USING (status = 'active' AND expires_at > NOW());

CREATE POLICY "Service role has full access"
  ON jobs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Applications (on-site applications for Premium listings)
CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT DEFAULT '',
  applicant_linkedin TEXT DEFAULT '',
  resume_file_name TEXT DEFAULT '',
  cover_note TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX applications_job_id_idx ON applications(job_id);

-- Applications are private: no public access, service role only.
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to applications"
  ON applications FOR ALL
  USING (true)
  WITH CHECK (true);
