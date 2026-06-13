import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendApprovalRequest } from "@/lib/email";
import { Job, Department, LocationType, RoleLevel, Tier } from "@/lib/types";
import { EXPIRY_DAYS, validateSalaryForTier } from "@/lib/constants";

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
    status: row.status as Job["status"],
    flaggedForNewsletter: row.flagged_for_newsletter as boolean,
    approvalToken: row.approval_token as string,
    createdAt: row.created_at as string,
    expiresAt: row.expires_at as string,
  };
}

export async function GET() {
  const { data, error } = await getSupabase()
    .from("jobs")
    .select("*")
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .order("tier", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const tierOrder: Record<string, number> = { premium: 0, standard: 1, free: 2 };
  const jobs = (data || [])
    .map(rowToJob)
    .sort((a, b) => (tierOrder[a.tier] ?? 3) - (tierOrder[b.tier] ?? 3));

  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Enforce the tier's salary band server-side so the client check can't be bypassed.
  const salaryError = validateSalaryForTier(
    body.tier as Tier,
    Number(body.salaryMin) || 0,
    Number(body.salaryMax) || 0
  );
  if (salaryError) {
    return NextResponse.json({ error: salaryError }, { status: 400 });
  }

  const now = new Date();
  const id = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const approvalToken = crypto.randomUUID();
  const expiresAt = new Date(now.getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const row = {
    id,
    poster_name: body.posterName,
    poster_email: body.posterEmail,
    company_name: body.companyName,
    company_logo: body.companyLogo || "",
    company_website: body.companyWebsite || "",
    title: body.title,
    department: body.department,
    location: body.location,
    location_type: body.locationType,
    role_level: body.roleLevel,
    salary_min: body.salaryMin || 0,
    salary_max: body.salaryMax || 0,
    description: body.description,
    requirements: body.requirements || "",
    external_apply_url: body.externalApplyUrl || "",
    tier: body.tier,
    status: "pending",
    flagged_for_newsletter: body.tier === "premium",
    approval_token: approvalToken,
    created_at: now.toISOString(),
    expires_at: expiresAt,
  };

  const { error } = await getSupabase().from("jobs").insert(row);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const job: Job = rowToJob({ ...row, id, approval_token: approvalToken });

  try {
    await sendApprovalRequest(job);
  } catch (emailErr) {
    console.error("Failed to send approval email:", emailErr);
  }

  return NextResponse.json({ id }, { status: 201 });
}
