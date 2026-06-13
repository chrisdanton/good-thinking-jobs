import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { sendApprovalRequest } from "@/lib/email";
import { Job, Department, LocationType, RoleLevel, Tier } from "@/lib/types";

function rowToJob(d: Record<string, unknown>): Job {
  return {
    id: d.id as string,
    posterName: d.poster_name as string,
    posterEmail: d.poster_email as string,
    companyName: d.company_name as string,
    companyLogo: (d.company_logo as string) || "",
    companyWebsite: (d.company_website as string) || "",
    title: d.title as string,
    department: d.department as Department,
    location: d.location as string,
    locationType: d.location_type as LocationType,
    roleLevel: d.role_level as RoleLevel,
    salaryMin: d.salary_min as number,
    salaryMax: d.salary_max as number,
    description: d.description as string,
    requirements: (d.requirements as string) || "",
    externalApplyUrl: (d.external_apply_url as string) || "",
    tier: d.tier as Tier,
    status: d.status as Job["status"],
    flaggedForNewsletter: d.flagged_for_newsletter as boolean,
    approvalToken: d.approval_token as string,
    createdAt: d.created_at as string,
    expiresAt: d.expires_at as string,
  };
}

// GET /api/checkout/confirm?session_id=... — verifies payment and publishes the
// listing into the review queue. Safe to call more than once (idempotent).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    return NextResponse.json({ paid: false }, { status: 200 });
  }

  const jobId = session.metadata?.jobId;
  if (!jobId) {
    return NextResponse.json({ error: "No job linked to this session" }, { status: 400 });
  }

  const { data, error } = await getSupabase().from("jobs").select("*").eq("id", jobId).single();
  if (error || !data) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Only move forward + notify the first time payment is confirmed.
  if (data.status === "awaiting_payment") {
    await getSupabase().from("jobs").update({ status: "pending" }).eq("id", jobId);
    const job = rowToJob({ ...data, status: "pending" });
    try {
      await sendApprovalRequest(job);
    } catch (e) {
      console.error("Approval email failed:", e);
    }
  }

  const job = rowToJob({ ...data, status: "pending" });
  return NextResponse.json({
    paid: true,
    job: {
      title: job.title,
      companyName: job.companyName,
      posterEmail: job.posterEmail,
      tier: job.tier,
    },
  });
}
