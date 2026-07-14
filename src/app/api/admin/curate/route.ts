import { NextRequest, NextResponse } from "next/server";
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

function authorized(key: string | null | undefined): boolean {
  return !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

// POST /api/admin/curate  body: { key, ...jobFields }
// Publishes a curated listing directly (admin only). Unlike /api/jobs this skips
// payment/salary rules and the approval email — the job goes live immediately,
// tagged as GOOD THINKING-sourced, with "Apply" pointing at the original listing.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!authorized(body.key)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const title = String(body.title || "").trim();
  const companyName = String(body.companyName || "").trim();
  const applyUrl = String(body.externalApplyUrl || "").trim();

  if (!title || !companyName) {
    return NextResponse.json({ error: "Title and company name are required." }, { status: 400 });
  }
  if (!/^https?:\/\//i.test(applyUrl)) {
    return NextResponse.json({ error: "An apply link (the original job URL) is required." }, { status: 400 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id }, { status: 201 });
}
