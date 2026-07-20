import { getSupabase } from "@/lib/supabase";
import { Department, LocationType, RoleLevel } from "@/lib/types";
import {
  CURATED_POSTER_NAME,
  CURATED_POSTER_EMAIL,
  CURATED_EXPIRY_DAYS,
  DEPARTMENTS,
  LOCATION_TYPES,
  ROLE_LEVELS,
} from "@/lib/constants";

// Publishing a curated listing (one GOOD THINKING sources itself, rather than a
// paid submission). Shared by the /admin curate panel and the phone share
// endpoint so both produce identical rows.

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export interface CuratedInput {
  title?: unknown;
  companyName?: unknown;
  companyWebsite?: unknown;
  location?: unknown;
  locationType?: unknown;
  department?: unknown;
  roleLevel?: unknown;
  salaryMin?: unknown;
  salaryMax?: unknown;
  description?: unknown;
  requirements?: unknown;
  externalApplyUrl?: unknown;
}

export type PublishResult =
  | { ok: true; id: string }
  | { ok: false; error: string; status: number };

// Inserts a curated job. Skips payment/salary rules and the approval email — the
// job goes live immediately, tagged as GOOD THINKING-sourced, with "Apply"
// pointing at the original listing.
export async function publishCuratedJob(body: CuratedInput): Promise<PublishResult> {
  const title = String(body.title || "").trim();
  const companyName = String(body.companyName || "").trim();
  const applyUrl = String(body.externalApplyUrl || "").trim();

  if (!title || !companyName) {
    return { ok: false, error: "Title and company name are required.", status: 400 };
  }
  if (!/^https?:\/\//i.test(applyUrl)) {
    return { ok: false, error: "An apply link (the original job URL) is required.", status: 400 };
  }

  const now = new Date();
  const id = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const approvalToken = crypto.randomUUID();
  const expiresAt = new Date(now.getTime() + CURATED_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const row = {
    id,
    poster_name: CURATED_POSTER_NAME,
    poster_email: CURATED_POSTER_EMAIL,
    company_name: companyName,
    company_logo: "",
    company_website: String(body.companyWebsite || "").trim(),
    title,
    department: oneOf<Department>(body.department, DEPARTMENTS, "Other"),
    location: String(body.location || "").trim() || "Remote",
    location_type: oneOf<LocationType>(body.locationType, LOCATION_TYPES, "Remote"),
    role_level: oneOf<RoleLevel>(body.roleLevel, ROLE_LEVELS, "Senior"),
    salary_min: Math.max(0, Math.round(Number(body.salaryMin) || 0)),
    salary_max: Math.max(0, Math.round(Number(body.salaryMax) || 0)),
    description: String(body.description || "").trim(),
    requirements: String(body.requirements || "").trim(),
    external_apply_url: applyUrl,
    tier: "free",
    status: "active",
    flagged_for_newsletter: false,
    approval_token: approvalToken,
    created_at: now.toISOString(),
    expires_at: expiresAt,
  };

  const { error } = await getSupabase().from("jobs").insert(row);
  if (error) {
    return { ok: false, error: error.message, status: 500 };
  }

  return { ok: true, id };
}

// True if a job with this apply link is already on the board. Used by the phone
// share endpoint so re-sharing the same posting doesn't create a duplicate.
export async function findExistingByApplyUrl(applyUrl: string): Promise<string | null> {
  const { data } = await getSupabase()
    .from("jobs")
    .select("id")
    .eq("external_apply_url", applyUrl)
    .neq("status", "removed")
    .limit(1);
  return data?.[0]?.id ?? null;
}
