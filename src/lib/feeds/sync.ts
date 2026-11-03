// Runs one employer feed sync against the database. Server-only.
import { getSupabase } from "@/lib/supabase";
import { CURATED_POSTER_EMAIL, CURATED_POSTER_NAME } from "@/lib/constants";
import { fetchFeed, toDepartment, toRoleLevel, type NormalizedJob, type SourceType } from "./providers";
import { looksSuspiciouslyEmpty, planSync, type ImportedRow } from "./plan";

export interface EmployerSource {
  id: string;
  employer_name: string;
  logo: string;
  website: string;
  careers_url: string;
  source_type: SourceType;
  source_identifier: string;
  active: boolean;
  auto_publish: boolean;
  last_sync_at: string | null;
  last_successful_sync_at: string | null;
  last_sync_status: string;
  last_sync_error: string;
  notes: string;
}

// Imported roles stay up while they keep appearing in the feed. If syncing ever
// stops altogether, they still drop off on their own after this many days.
const IMPORTED_TTL_DAYS = 21;

export interface SyncResult {
  ok: boolean;
  status: "ok" | "failed" | "suspicious_empty";
  error?: string;
  added: number;
  refreshed: number;
  possiblyClosed: number;
  closed: number;
  reopened: number;
  skippedIrrelevant: number;
}

const ttl = (now: Date) => new Date(now.getTime() + IMPORTED_TTL_DAYS * 86400_000).toISOString();

function newRow(src: EmployerSource, j: NormalizedJob, now: Date) {
  return {
    id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    poster_name: CURATED_POSTER_NAME,
    poster_email: CURATED_POSTER_EMAIL,
    company_name: src.employer_name,
    company_logo: src.logo || "",
    company_website: src.website || "",
    title: j.title,
    department: toDepartment(j.title, j.department),
    location: j.location || (j.locationType === "Remote" ? "Remote" : ""),
    location_type: j.locationType,
    role_level: toRoleLevel(j.title),
    salary_min: j.salaryCurrency && j.salaryCurrency !== "USD" ? 0 : j.salaryMin,
    salary_max: j.salaryCurrency && j.salaryCurrency !== "USD" ? 0 : j.salaryMax,
    description: j.description.slice(0, 20000),
    requirements: "",
    external_apply_url: j.applyUrl,
    tier: "free",
    status: src.auto_publish ? "active" : "pending",
    flagged_for_newsletter: false,
    approval_token: crypto.randomUUID(),
    created_at: now.toISOString(),
    expires_at: ttl(now),
    marketplace_type: "job",
    imported: true,
    source_type: src.source_type,
    source_employer_id: src.id,
    external_job_id: j.externalId,
    source_url: j.sourceUrl,
    import_status: "active",
    missed_syncs: 0,
    last_seen_at: now.toISOString(),
    source_updated_at: j.updatedAt || j.publishedAt || null,
  };
}

async function record(src: EmployerSource, now: Date, status: SyncResult["status"], error = "") {
  const updates: Record<string, unknown> = {
    last_sync_at: now.toISOString(),
    last_sync_status: status,
    last_sync_error: error.slice(0, 500),
  };
  if (status === "ok") updates.last_successful_sync_at = now.toISOString();
  await getSupabase().from("employer_sources").update(updates).eq("id", src.id);
}

export async function syncSource(src: EmployerSource, now = new Date()): Promise<SyncResult> {
  const empty = { added: 0, refreshed: 0, possiblyClosed: 0, closed: 0, reopened: 0, skippedIrrelevant: 0 };
  const db = getSupabase();

  // 1. Fetch. Any failure stops here: nothing is changed or closed.
  let feed: NormalizedJob[];
  try {
    feed = await fetchFeed(src.source_type, src.source_identifier, src.employer_name);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await record(src, now, "failed", msg);
    return { ok: false, status: "failed", error: msg, ...empty };
  }

  const { data: rows, error: readErr } = await db
    .from("jobs")
    .select("id, external_job_id, import_status, missed_syncs, status, manual_override")
    .eq("imported", true)
    .eq("source_employer_id", src.id);
  if (readErr) {
    await record(src, now, "failed", readErr.message);
    return { ok: false, status: "failed", error: readErr.message, ...empty };
  }
  const existing = (rows || []) as ImportedRow[];

  if (looksSuspiciouslyEmpty(existing, feed)) {
    await record(src, now, "suspicious_empty", "Feed came back empty; kept existing roles open.");
    return { ok: false, status: "suspicious_empty", error: "Feed came back empty", ...empty };
  }

  // 2. Decide, then apply.
  const plan = planSync(existing, feed);
  const result: SyncResult = { ok: true, status: "ok", ...empty, skippedIrrelevant: plan.skippedIrrelevant };

  if (plan.insert.length) {
    const { error } = await db.from("jobs").insert(plan.insert.map((j) => newRow(src, j, now)));
    if (error) {
      await record(src, now, "failed", error.message);
      return { ok: false, status: "failed", error: error.message, ...empty };
    }
    result.added = plan.insert.length;
  }

  for (const { row, job, reopen } of plan.seen) {
    const u: Record<string, unknown> = {
      last_seen_at: now.toISOString(),
      missed_syncs: 0,
      import_status: "active",
      expires_at: ttl(now),
      external_apply_url: job.applyUrl,
      source_url: job.sourceUrl,
      source_updated_at: job.updatedAt || job.publishedAt || null,
    };
    if (!row.manual_override) {
      u.title = job.title;
      u.location = job.location || (job.locationType === "Remote" ? "Remote" : "");
      u.location_type = job.locationType;
      u.description = job.description.slice(0, 20000);
    }
    if (reopen) {
      u.status = src.auto_publish ? "active" : "pending";
      result.reopened++;
    } else {
      result.refreshed++;
    }
    await db.from("jobs").update(u).eq("id", row.id);
  }

  for (const { row, close } of plan.missed) {
    const u: Record<string, unknown> = { missed_syncs: (row.missed_syncs || 0) + 1 };
    if (close) {
      u.import_status = "closed";
      u.status = "removed";
      result.closed++;
    } else {
      u.import_status = "possibly_closed";
      result.possiblyClosed++;
    }
    await db.from("jobs").update(u).eq("id", row.id);
  }

  await record(src, now, "ok");
  return result;
}

export async function listSources(): Promise<{ sources: EmployerSource[]; setupNeeded: boolean; error?: string }> {
  const { data, error } = await getSupabase().from("employer_sources").select("*").order("employer_name");
  if (error) {
    const setupNeeded = /employer_sources|relation|does not exist|schema cache/i.test(error.message);
    return { sources: [], setupNeeded, error: error.message };
  }
  return { sources: (data || []) as EmployerSource[], setupNeeded: false };
}

export async function syncAllActive(): Promise<{ employer: string; result: SyncResult }[]> {
  const { sources } = await listSources();
  const out = [];
  for (const s of sources.filter((x) => x.active)) {
    out.push({ employer: s.employer_name, result: await syncSource(s) });
  }
  return out;
}
