import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendLinkCheckReport } from "@/lib/email";

interface CheckedJob {
  id: string;
  title: string;
  company: string;
  url: string;
  reason: string;
}

// Visit one apply link and decide if it's clearly dead.
// - 404 / 410 → dead (remove)
// - fetch error / timeout / other error status → "couldn't reach" (flag, don't remove)
// - otherwise → alive
async function checkLink(url: string): Promise<"alive" | "dead" | "review"> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (res.status === 404 || res.status === 410) return "dead";
    if (res.status >= 400) return "review";
    return "alive";
  } catch {
    return "review";
  } finally {
    clearTimeout(timer);
  }
}

// GET /api/cron/link-check
// Runs monthly (see vercel.json). Checks every live listing's apply link,
// auto-removes the clearly-dead ones, and emails a report. Manual test with
// ?key=<ADMIN_PASSWORD>.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const key = new URL(req.url).searchParams.get("key");
  const cronOk = !!process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`;
  const manualOk = !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
  if (!cronOk && !manualOk) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabase();
  const { data, error } = await sb
    .from("jobs")
    .select("id, title, company_name, external_apply_url")
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const jobs = (data || []).filter((j) => (j.external_apply_url as string)?.startsWith("http"));

  const removed: CheckedJob[] = [];
  const review: CheckedJob[] = [];
  let aliveCount = 0;

  for (const j of jobs) {
    const url = j.external_apply_url as string;
    const result = await checkLink(url);
    const entry: CheckedJob = {
      id: j.id as string,
      title: j.title as string,
      company: j.company_name as string,
      url,
      reason: "",
    };

    if (result === "dead") {
      await sb.from("jobs").update({ status: "removed" }).eq("id", j.id);
      entry.reason = "Link returned 'not found' — removed automatically";
      removed.push(entry);
    } else if (result === "review") {
      entry.reason = "Couldn't confirm it's still live — worth a look";
      review.push(entry);
    } else {
      aliveCount += 1;
    }
  }

  try {
    await sendLinkCheckReport({ checked: jobs.length, aliveCount, removed, review });
  } catch (err) {
    console.error("Failed to send link-check report:", err);
  }

  return NextResponse.json({ ok: true, checked: jobs.length, removed: removed.length, review: review.length });
}
