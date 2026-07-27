import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { Job, Department, LocationType, RoleLevel, Tier, JobStatus } from "@/lib/types";
import { LOCATION_TYPES, DEPARTMENTS, ROLE_LEVELS } from "@/lib/constants";
import { cleanCompanyName } from "@/lib/extract-job";

function rowToJob(row: Record<string, unknown>): Job {
  return {
    id: row.id as string,
    posterName: row.poster_name as string,
    posterEmail: row.poster_email as string,
    companyName: row.company_name as string,
    companyLogo: (row.company_logo as string) || "",
    companyWebsite: (row.company_website as string) || "",
    title: row.title as string,
    department: row.department as Department,
    location: row.location as string,
    locationType: row.location_type as LocationType,
    roleLevel: row.role_level as RoleLevel,
    salaryMin: row.salary_min as number,
    salaryMax: row.salary_max as number,
    description: row.description as string,
    requirements: (row.requirements as string) || "",
    externalApplyUrl: (row.external_apply_url as string) || "",
    tier: row.tier as Tier,
    status: row.status as JobStatus,
    flaggedForNewsletter: row.flagged_for_newsletter as boolean,
    approvalToken: row.approval_token as string,
    createdAt: row.created_at as string,
    expiresAt: row.expires_at as string,
    referralCode: (row.referral_code as string) || "",
  };
}

function authorized(key: string | null): boolean {
  // Admin password lives in the ADMIN_PASSWORD env var (set in Vercel), not in code.
  return !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
}

// GET /api/admin/jobs?key=... — returns ALL jobs (any status) for the admin panel
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (!authorized(searchParams.get("key"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getSupabase()
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data || []).map(rowToJob));
}

// PATCH /api/admin/jobs — update a job's status, newsletter flag, or the common
// quick-fix fields (company name, title, location, salary) used by the /fix page.
// body: { key, id, status?, flaggedForNewsletter?, companyName?, title?,
//         location?, locationType?, salaryMin?, salaryMax?, department?, roleLevel? }
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  if (!authorized(body.key)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "Missing job id" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.status === "string") updates.status = body.status;
  if (typeof body.flaggedForNewsletter === "boolean") updates.flagged_for_newsletter = body.flaggedForNewsletter;

  // Quick-fix text fields. Only applied when the key is present, so a field left
  // untouched is never blanked. Company name is de-junked (Workday entity codes).
  if (typeof body.companyName === "string" && body.companyName.trim()) {
    updates.company_name = cleanCompanyName(body.companyName);
  }
  if (typeof body.title === "string" && body.title.trim()) {
    updates.title = body.title.trim();
  }
  if (typeof body.location === "string" && body.location.trim()) {
    updates.location = body.location.trim();
  }
  if (typeof body.locationType === "string" && (LOCATION_TYPES as readonly string[]).includes(body.locationType)) {
    updates.location_type = body.locationType;
  }
  if (typeof body.department === "string" && (DEPARTMENTS as readonly string[]).includes(body.department)) {
    updates.department = body.department;
  }
  if (typeof body.roleLevel === "string" && (ROLE_LEVELS as readonly string[]).includes(body.roleLevel)) {
    updates.role_level = body.roleLevel;
  }
  // Salary: a sent value wins, including 0 to clear it back to "not listed".
  if (body.salaryMin !== undefined) updates.salary_min = Math.max(0, Math.round(Number(body.salaryMin) || 0));
  if (body.salaryMax !== undefined) updates.salary_max = Math.max(0, Math.round(Number(body.salaryMax) || 0));

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await getSupabase().from("jobs").update(updates).eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
