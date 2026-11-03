// Employer feeds admin API (password = ADMIN_PASSWORD, same as the rest of /admin).
//
//   GET    ?key=                          employers, their imported roles, health, clicks
//   POST   { key, action: "preview", careersUrl, sourceType?, identifier? }   dry run, saves nothing
//   POST   { key, action: "add", employerName, careersUrl, website?, logo?, sourceType?, identifier?, autoPublish? }
//   POST   { key, action: "sync", id }    refresh one employer now
//   POST   { key, action: "job", jobId, op: "publish" | "exclude" | "restore" | "feature" | "unfeature" }
//   PATCH  { key, id, active?, autoPublish?, employerName?, notes?, logo?, website? }
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { detectSource, fetchFeed, isRelevant, toDepartment, type SourceType } from "@/lib/feeds/providers";
import { listSources, syncSource, type EmployerSource } from "@/lib/feeds/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(key: unknown): boolean {
  return !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
}
const SOURCE_TYPES: SourceType[] = ["greenhouse", "lever", "ashby"];

function resolveSource(body: Record<string, unknown>) {
  const manualType = SOURCE_TYPES.includes(body.sourceType as SourceType) ? (body.sourceType as SourceType) : null;
  const manualId = String(body.identifier || "").trim();
  if (manualType && manualId) return { sourceType: manualType, identifier: manualId };
  return detectSource(String(body.careersUrl || ""));
}

export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key");
  if (!authorized(key)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sources, setupNeeded, error } = await listSources();
  if (setupNeeded) return NextResponse.json({ setupNeeded: true, sources: [], jobs: [] });
  if (error) return NextResponse.json({ error }, { status: 500 });

  const db = getSupabase();
  const { data: jobs } = await db
    .from("jobs")
    .select("id, title, company_name, location, department, status, import_status, source_type, source_employer_id, tier, flagged_for_newsletter, external_apply_url, created_at, last_seen_at, manual_override")
    .eq("imported", true)
    .order("created_at", { ascending: false })
    .limit(1000);

  // Basic learning: views and apply clicks per imported role over the last 30 days
  // (from the existing job_events tracking; empty if that table isn't set up).
  const ids = (jobs || []).map((j) => j.id);
  const clicks: Record<string, { views: number; applies: number }> = {};
  if (ids.length) {
    const since = new Date(Date.now() - 30 * 86400_000).toISOString();
    const { data: events } = await db.from("job_events").select("job_id, type").in("job_id", ids).gte("created_at", since);
    for (const e of events || []) {
      const c = (clicks[e.job_id] ||= { views: 0, applies: 0 });
      if (e.type === "view") c.views++;
      if (e.type === "apply_click") c.applies++;
    }
  }

  return NextResponse.json({
    setupNeeded: false,
    sources,
    jobs: (jobs || []).map((j) => ({ ...j, views: clicks[j.id]?.views || 0, applies: clicks[j.id]?.applies || 0 })),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!authorized(body.key)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getSupabase();

  if (body.action === "preview") {
    const src = resolveSource(body);
    if (!src) {
      return NextResponse.json(
        { error: "We couldn't tell which ATS that is. Paste a Greenhouse, Lever or Ashby board link, or pick the ATS and type its board name." },
        { status: 400 }
      );
    }
    try {
      const all = await fetchFeed(src.sourceType, src.identifier, String(body.employerName || ""));
      const relevant = all.filter((j) => isRelevant(j.title));
      return NextResponse.json({
        ...src,
        total: all.length,
        relevant: relevant.map((j) => ({ title: j.title, location: j.location, category: toDepartment(j.title, j.department), applyUrl: j.applyUrl, salaryMin: j.salaryMin, salaryMax: j.salaryMax })),
        skipped: all.filter((j) => !isRelevant(j.title)).map((j) => j.title),
      });
    } catch (e) {
      return NextResponse.json({ ...src, error: `Couldn't read that board: ${e instanceof Error ? e.message : e}` }, { status: 502 });
    }
  }

  if (body.action === "add") {
    const src = resolveSource(body);
    const name = String(body.employerName || "").trim();
    if (!src || !name) return NextResponse.json({ error: "Employer name and a Greenhouse, Lever or Ashby board are required." }, { status: 400 });
    const { data: dupe } = await db
      .from("employer_sources")
      .select("id")
      .eq("source_type", src.sourceType)
      .eq("source_identifier", src.identifier)
      .limit(1);
    if (dupe?.length) return NextResponse.json({ error: "That board is already connected." }, { status: 409 });
    const row = {
      id: `emp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      employer_name: name,
      logo: String(body.logo || ""),
      website: String(body.website || ""),
      careers_url: String(body.careersUrl || ""),
      source_type: src.sourceType,
      source_identifier: src.identifier,
      active: true,
      auto_publish: body.autoPublish === true, // default: review first
      notes: String(body.notes || ""),
    };
    const { error } = await db.from("employer_sources").insert(row);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const result = await syncSource({ ...row, last_sync_at: null, last_successful_sync_at: null, last_sync_status: "", last_sync_error: "" } as EmployerSource);
    return NextResponse.json({ id: row.id, result });
  }

  if (body.action === "sync") {
    const { data } = await db.from("employer_sources").select("*").eq("id", body.id).single();
    if (!data) return NextResponse.json({ error: "Employer not found" }, { status: 404 });
    return NextResponse.json({ result: await syncSource(data as EmployerSource) });
  }

  if (body.action === "job") {
    const ops: Record<string, Record<string, unknown>> = {
      publish: { status: "active" },
      exclude: { status: "removed", import_status: "excluded" }, // permanent: sync never brings it back
      restore: { status: "pending", import_status: "active", missed_syncs: 0 },
      feature: { tier: "premium" }, // uses the existing Premium/featured treatment
      unfeature: { tier: "free" },
    };
    const u = ops[String(body.op)];
    if (!u || !body.jobId) return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    const { error } = await db.from("jobs").update(u).eq("id", body.jobId).eq("imported", true);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  if (!authorized(body.key)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const u: Record<string, unknown> = {};
  if (typeof body.active === "boolean") u.active = body.active;
  if (typeof body.autoPublish === "boolean") u.auto_publish = body.autoPublish;
  for (const [k, col] of [["employerName", "employer_name"], ["notes", "notes"], ["logo", "logo"], ["website", "website"]] as const) {
    if (typeof body[k] === "string") u[col] = body[k].trim();
  }
  if (!body.id || !Object.keys(u).length) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  const { error } = await getSupabase().from("employer_sources").update(u).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
