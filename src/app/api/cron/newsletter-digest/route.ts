import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendNewsletterDigest } from "@/lib/email";
import { Job, Department, LocationType, RoleLevel, Tier, JobStatus } from "@/lib/types";

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
  };
}

// GET /api/cron/newsletter-digest
// Triggered every Friday by Vercel Cron (see vercel.json), which sends
// `Authorization: Bearer <CRON_SECRET>`. Can also be triggered manually for
// testing with ?key=<ADMIN_PASSWORD>.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const key = new URL(req.url).searchParams.get("key");
  const cronOk = !!process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`;
  const manualOk = !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
  if (!cronOk && !manualOk) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabase();
  const [featuredRes, pendingRes] = await Promise.all([
    sb.from("jobs").select("*").eq("status", "active").eq("flagged_for_newsletter", true).order("created_at", { ascending: false }),
    sb.from("jobs").select("*").eq("status", "pending").eq("tier", "premium").order("created_at", { ascending: false }),
  ]);

  if (featuredRes.error) {
    return NextResponse.json({ error: featuredRes.error.message }, { status: 500 });
  }

  const featured = (featuredRes.data || []).map(rowToJob);
  const pendingPremium = (pendingRes.data || []).map(rowToJob);

  try {
    await sendNewsletterDigest(featured, pendingPremium);
  } catch (err) {
    console.error("Failed to send newsletter digest:", err);
    return NextResponse.json({ error: "Failed to send digest" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, featured: featured.length, pendingPremium: pendingPremium.length });
}
