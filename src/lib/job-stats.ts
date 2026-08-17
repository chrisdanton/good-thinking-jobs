import { getSupabase } from "@/lib/supabase";

// Turning the raw job_events log into the numbers Chris actually wants: how much
// traffic the board got, which jobs drew the most interest, and the click-through
// rate (of the people who viewed a job, how many clicked through to apply).
//
// It degrades quietly: if the job_events table doesn't exist yet (the one-time
// SQL hasn't been run) or a query fails, it returns { connected: false } and
// callers fall back to a "not set up yet" note rather than erroring.

export interface JobEngagement {
  jobId: string;
  company: string;
  title: string;
  views: number;
  applyClicks: number;
  ctr: number; // apply clicks / views, 0..1
}

export interface EngagementStats {
  connected: boolean;
  views: number;
  applyClicks: number;
  uniqueVisitors: number;
  ctr: number; // overall, 0..1
  topJobs: JobEngagement[];
}

const OFF: EngagementStats = {
  connected: false,
  views: 0,
  applyClicks: 0,
  uniqueVisitors: 0,
  ctr: 0,
  topJobs: [],
};

// clicks / views, guarded against divide-by-zero. Exported for testing.
export function clickThroughRate(views: number, applyClicks: number): number {
  if (views <= 0) return 0;
  return applyClicks / views;
}

export async function getEngagementStats(
  days = 7,
  topN = 5
): Promise<EngagementStats> {
  try {
    const sb = getSupabase();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await sb
      .from("job_events")
      .select("job_id, type, visitor_id")
      .gte("created_at", since);

    // A missing table (SQL not run yet) or any error reads as "not connected".
    if (error || !data) return OFF;

    let views = 0;
    let applyClicks = 0;
    const visitors = new Set<string>();
    const perJob = new Map<string, { views: number; applyClicks: number }>();

    for (const row of data) {
      const jobId = String(row.job_id || "");
      const type = String(row.type || "");
      const vid = String(row.visitor_id || "");
      if (vid) visitors.add(vid);

      const entry = perJob.get(jobId) || { views: 0, applyClicks: 0 };
      if (type === "view") {
        views++;
        entry.views++;
      } else if (type === "apply_click") {
        applyClicks++;
        entry.applyClicks++;
      }
      perJob.set(jobId, entry);
    }

    // Rank jobs by views, then by apply clicks, and keep the top handful.
    const ranked = Array.from(perJob.entries())
      .sort((a, b) => b[1].views - a[1].views || b[1].applyClicks - a[1].applyClicks)
      .slice(0, topN);

    // Look up the company + title for those jobs in one query.
    const ids = ranked.map(([id]) => id);
    const names = new Map<string, { company: string; title: string }>();
    if (ids.length) {
      const { data: jobRows } = await sb
        .from("jobs")
        .select("id, company_name, title")
        .in("id", ids);
      for (const j of jobRows || []) {
        names.set(String(j.id), {
          company: (j.company_name as string) || "",
          title: (j.title as string) || "",
        });
      }
    }

    const topJobs: JobEngagement[] = ranked.map(([jobId, e]) => ({
      jobId,
      company: names.get(jobId)?.company || "(removed listing)",
      title: names.get(jobId)?.title || "",
      views: e.views,
      applyClicks: e.applyClicks,
      ctr: clickThroughRate(e.views, e.applyClicks),
    }));

    return {
      connected: true,
      views,
      applyClicks,
      uniqueVisitors: visitors.size,
      ctr: clickThroughRate(views, applyClicks),
      topJobs,
    };
  } catch {
    return OFF;
  }
}
