import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendApprovedEmail } from "@/lib/email";
import { Job, Department, LocationType, RoleLevel, Tier } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  if (!id || !token) {
    return new NextResponse("Missing parameters.", { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("approval_token", token)
    .single();

  if (error || !data) {
    return new NextResponse("Invalid or expired link.", { status: 404 });
  }

  if (data.status === "active") {
    return new NextResponse(alreadyHandledPage("approved"), { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  const { error: updateError } = await getSupabase()
    .from("jobs")
    .update({ status: "active" })
    .eq("id", id);

  if (updateError) {
    return new NextResponse("Failed to approve job.", { status: 500 });
  }

  const job: Job = {
    id: data.id,
    posterName: data.poster_name,
    posterEmail: data.poster_email,
    companyName: data.company_name,
    companyLogo: data.company_logo || "",
    companyWebsite: data.company_website || "",
    title: data.title,
    department: data.department as Department,
    location: data.location,
    locationType: data.location_type as LocationType,
    roleLevel: data.role_level as RoleLevel,
    salaryMin: data.salary_min,
    salaryMax: data.salary_max,
    description: data.description,
    requirements: data.requirements || "",
    externalApplyUrl: data.external_apply_url || "",
    tier: data.tier as Tier,
    status: "active",
    flaggedForNewsletter: data.flagged_for_newsletter,
    approvalToken: data.approval_token,
    createdAt: data.created_at,
    expiresAt: data.expires_at,
  };

  try {
    await sendApprovedEmail(job);
  } catch (err) {
    console.error("Failed to send approved email:", err);
  }

  return new NextResponse(successPage(job), { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

function successPage(job: Job) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getgoodthinking.com";
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Job Approved · GOOD THINKING Jobs</title>
<style>@font-face{font-family:"Trade Gothic";src:url("${BASE_URL}/fonts/TradeGothic-Bold.otf") format("opentype");font-weight:700;} body{font-family:'Helvetica Neue',Arial,sans-serif;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:40px;box-sizing:border-box;} .card{max-width:480px;text-align:center;} .badge{background:#F9FF00;color:#111;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;padding:10px 20px;display:inline-block;margin-bottom:32px;} h1{font-family:"Trade Gothic",'Helvetica Neue',Arial,sans-serif;font-size:42px;font-weight:700;text-transform:uppercase;letter-spacing:-.02em;margin:0 0 16px;} p{font-size:15px;color:rgba(255,255,255,.7);line-height:1.75;margin:0 0 32px;} a{display:inline-block;background:#F9FF00;color:#111;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:13px 28px;text-decoration:none;}</style>
</head>
<body><div class="card">
  <div class="badge">GOOD THINKING JOBS</div>
  <h1>Approved &amp; Live.</h1>
  <p><strong>${job.title}</strong> at <strong>${job.companyName}</strong> is now published. The poster has been notified.</p>
  <a href="${BASE_URL}/jobs/${job.id}">View Listing →</a>
</div></body></html>`;
}

function alreadyHandledPage(action: string) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getgoodthinking.com";
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Already ${action} · GOOD THINKING Jobs</title>
<style>@font-face{font-family:"Trade Gothic";src:url("${BASE_URL}/fonts/TradeGothic-Bold.otf") format("opentype");font-weight:700;} body{font-family:'Helvetica Neue',Arial,sans-serif;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:40px;box-sizing:border-box;} .card{max-width:480px;text-align:center;} .badge{background:#F9FF00;color:#111;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;padding:10px 20px;display:inline-block;margin-bottom:32px;} h1{font-family:"Trade Gothic",'Helvetica Neue',Arial,sans-serif;font-size:42px;font-weight:700;text-transform:uppercase;letter-spacing:-.02em;margin:0 0 16px;} p{font-size:15px;color:rgba(255,255,255,.7);line-height:1.75;margin:0;}</style>
</head>
<body><div class="card">
  <div class="badge">GOOD THINKING JOBS</div>
  <h1>Already ${action}.</h1>
  <p>This listing has already been ${action}. No further action needed.</p>
</div></body></html>`;
}
