import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendUsageReport } from "@/lib/email";
import { getWeeklyTraffic } from "@/lib/vercel-analytics";

// GET /api/cron/usage-report
// Runs weekly (see vercel.json). Emails Chris a snapshot of how the board is
// being used — live listings, what was added this week, and applications sent
// through the board. Manual test with ?key=<ADMIN_PASSWORD> (add &dryRun=1 to
// see the numbers without sending the email).
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const key = new URL(req.url).searchParams.get("key");
  const cronOk = !!process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`;
  const manualOk = !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
  if (!cronOk && !manualOk) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dryRun = new URL(req.url).searchParams.get("dryRun") === "1";

  const sb = getSupabase();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Live listings right now.
  const { count: activeCount } = await sb
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .gt("expires_at", now.toISOString());

  // Added in the last 7 days (any status, so removed-since still counts as activity).
  const { data: newRows } = await sb
    .from("jobs")
    .select("id, company_name, title, created_at")
    .gte("created_at", weekAgo)
    .order("created_at", { ascending: false });

  const newThisWeek = (newRows || [])
    .filter((j) => !String(j.id).startsWith("sample-"))
    .map((j) => ({
      id: j.id as string,
      company: (j.company_name as string) || "",
      title: (j.title as string) || "",
    }));

  // Applications submitted through the board.
  const { count: applicationsTotal } = await sb
    .from("applications")
    .select("*", { count: "exact", head: true });
  const { count: applicationsThisWeek } = await sb
    .from("applications")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo);

  // Real visitor traffic from Vercel Web Analytics (quietly off if the token
  // isn't set or Web Analytics isn't enabled on the project yet).
  const traffic = await getWeeklyTraffic();

  const payload = {
    activeCount: activeCount ?? 0,
    newThisWeek,
    applicationsThisWeek: applicationsThisWeek ?? 0,
    applicationsTotal: applicationsTotal ?? 0,
    traffic,
  };

  if (!dryRun) {
    try {
      await sendUsageReport(payload);
    } catch (err) {
      console.error("Failed to send usage report:", err);
      return NextResponse.json({ ok: false, error: "email failed", ...payload }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, dryRun, ...payload });
}
