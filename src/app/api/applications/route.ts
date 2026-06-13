import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { Application, ApplicationStatus } from "@/lib/types";

function rowToApplication(row: Record<string, unknown>): Application {
  return {
    id: row.id as string,
    jobId: row.job_id as string,
    applicantName: row.applicant_name as string,
    applicantEmail: row.applicant_email as string,
    applicantPhone: (row.applicant_phone as string) || "",
    applicantLinkedIn: (row.applicant_linkedin as string) || "",
    resumeFileName: (row.resume_file_name as string) || "",
    coverNote: (row.cover_note as string) || "",
    status: row.status as ApplicationStatus,
    createdAt: row.created_at as string,
  };
}

// POST /api/applications — submit an application (public)
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.jobId || !body.applicantName || !body.applicantEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const id = `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const row = {
    id,
    job_id: body.jobId,
    applicant_name: body.applicantName,
    applicant_email: body.applicantEmail,
    applicant_phone: body.applicantPhone || "",
    applicant_linkedin: body.applicantLinkedIn || "",
    resume_file_name: body.resumeFileName || "",
    cover_note: body.coverNote || "",
    status: "new",
    created_at: new Date().toISOString(),
  };

  const { error } = await getSupabase().from("applications").insert(row);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id }, { status: 201 });
}

// GET /api/applications?key=... — list all applications (admin only)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (!process.env.ADMIN_PASSWORD || searchParams.get("key") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getSupabase()
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data || []).map(rowToApplication));
}
