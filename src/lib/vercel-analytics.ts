// Reading real visitor traffic from Vercel's Web Analytics API for the weekly
// usage email. Needs a Vercel access token (VERCEL_ANALYTICS_TOKEN) and the
// project id (VERCEL_PROJECT_ID) in the environment; a personal-account project
// omits a team id, a team project sets VERCEL_TEAM_ID.
//
// Everything here degrades quietly: if the token isn't set, or Web Analytics
// isn't enabled on the project yet, or the API hiccups, it returns
// { connected: false } and the email falls back to its "traffic not connected"
// note rather than failing. Docs: vercel.com/docs/analytics/web-analytics-api

export interface TrafficSummary {
  connected: boolean;
  pageviews7d: number;
  visitors7d: number;
  topPages: { route: string; pageviews: number }[];
}

const OFF: TrafficSummary = { connected: false, pageviews7d: 0, visitors7d: 0, topPages: [] };

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function aggregate(
  by: string,
  extra: Record<string, string> = {}
): Promise<Array<Record<string, unknown>> | null> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) return null;

  const now = new Date();
  const since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    projectId,
    since: ymd(since),
    until: ymd(now),
    by,
    ...extra,
  });
  if (process.env.VERCEL_TEAM_ID) params.set("teamId", process.env.VERCEL_TEAM_ID);

  const res = await fetch(
    `https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );
  if (!res.ok) return null; // not enabled, bad token, plan limit — caller treats as "off"
  const body = (await res.json()) as { data?: Array<Record<string, unknown>> };
  return body.data ?? [];
}

export async function getWeeklyTraffic(): Promise<TrafficSummary> {
  try {
    const [byDay, byRoute] = await Promise.all([
      aggregate("day"),
      aggregate("route", { limit: "5" }),
    ]);
    if (byDay === null) return OFF;

    const pageviews7d = byDay.reduce((s, r) => s + (Number(r.pageviews) || 0), 0);
    const visitors7d = byDay.reduce((s, r) => s + (Number(r.visitors) || 0), 0);
    const topPages = (byRoute ?? [])
      .map((r) => ({ route: String(r.route ?? ""), pageviews: Number(r.pageviews) || 0 }))
      .filter((p) => p.route)
      .slice(0, 5);

    return { connected: true, pageviews7d, visitors7d, topPages };
  } catch {
    return OFF;
  }
}
