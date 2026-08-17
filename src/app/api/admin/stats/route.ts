import { NextRequest, NextResponse } from "next/server";
import { getEngagementStats } from "@/lib/job-stats";

// GET /api/admin/stats?key=<ADMIN_PASSWORD>&days=30&top=20
// Returns board engagement (views, apply clicks, click-through rate, unique
// visitors, and the top jobs) over the last N days, straight from job_events.
// Handy for pulling traffic/use numbers on demand, beyond the weekly email.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!process.env.ADMIN_PASSWORD || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const days = Math.min(Math.max(parseInt(url.searchParams.get("days") || "30") || 30, 1), 365);
  const top = Math.min(Math.max(parseInt(url.searchParams.get("top") || "20") || 20, 1), 100);

  const stats = await getEngagementStats(days, top);
  return NextResponse.json({ days, ...stats });
}
