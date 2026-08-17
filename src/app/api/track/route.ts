import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// POST /api/track  body: { jobId, type, visitorId?, referrer? }
// Records one engagement event (a job view or an apply-click) into job_events.
// Public and unauthenticated, like an analytics beacon. It is deliberately
// forgiving: bad input or a database hiccup returns 204 rather than an error, so
// tracking can never surface a problem to a visitor or block the page.
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["view", "apply_click"]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const jobId = String(body.jobId || "").trim();
    const type = String(body.type || "").trim();

    // Ignore anything malformed or sample/seed jobs (not real listings).
    if (!jobId || jobId.startsWith("sample-") || !ALLOWED_TYPES.has(type)) {
      return new NextResponse(null, { status: 204 });
    }

    await getSupabase().from("job_events").insert({
      job_id: jobId,
      type,
      visitor_id: String(body.visitorId || "").slice(0, 100),
      referrer: String(body.referrer || "").slice(0, 500),
    });
  } catch (err) {
    // Never fail loudly — this is fire-and-forget from the client.
    console.error("track event failed:", err);
  }
  return new NextResponse(null, { status: 204 });
}
