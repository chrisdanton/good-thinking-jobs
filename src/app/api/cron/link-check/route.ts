import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendLinkCheckReport } from "@/lib/email";
import { CURATED_POSTER_NAME } from "@/lib/constants";
import { titlesDiverge, pageTitleOf, looksExpired } from "@/lib/title-match";
import { readableUrlFor } from "@/lib/extract-job";

interface CheckedJob {
  id: string;
  title: string;
  company: string;
  url: string;
  reason: string;
}

type Verdict = "alive" | "dead" | "review";

interface CheckResult {
  verdict: Verdict;
  reason: string;
}

// Visit one apply link and work out whether the role is still there.
//
// Roles get filled faster than links break. Checking only for 404s misses most
// of it, so this also looks for the ways a board keeps a URL alive after the
// posting has closed:
//   - an explicit "this job has expired" notice on a page that returns 200
//   - a redirect that drops the job id, landing on the careers index instead
//   - a page now showing a completely different role at the same address
async function checkLink(url: string, storedTitle: string): Promise<CheckResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  // Check the same readable source the extractor uses. A LinkedIn link is often
  // a search URL rather than a job page, and fetching it returns LinkedIn's
  // generic results page whose title ("1 Jobs jobs in Worldwide") looks nothing
  // like the role and would be misread as the posting having changed.
  const fetchUrl = readableUrlFor(url);
  try {
    const res = await fetch(fetchUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (res.status === 404 || res.status === 410) {
      return { verdict: "dead", reason: "Link returned 'not found'" };
    }
    if (res.status >= 400) {
      return { verdict: "review", reason: `Returned status ${res.status}, couldn't confirm it's live` };
    }

    // A deleted posting often bounces to the company's careers index. The job id
    // from the original link is the giveaway: if the page we ended up on no
    // longer contains it, we're not looking at the posting any more.
    const finalUrl = res.url || fetchUrl;
    const idInPath = fetchUrl.match(/(\d{6,})/)?.[1];
    if (idInPath && !finalUrl.includes(idInPath)) {
      return { verdict: "dead", reason: `Redirected away from the posting to ${finalUrl}` };
    }

    const html = await res.text();

    if (looksExpired(html)) {
      return { verdict: "dead", reason: "Page says the posting has expired or been filled" };
    }

    // Title comparison is a heuristic, so a mismatch is always flagged for a
    // human rather than acted on. Pages that render with Javascript can report a
    // generic title through no fault of the listing.
    const found = pageTitleOf(html);
    if (found && titlesDiverge(storedTitle, found)) {
      return {
        verdict: "review",
        reason: `Link now shows "${found}" rather than "${storedTitle}", so the original may be filled`,
      };
    }

    return { verdict: "alive", reason: "" };
  } catch {
    return { verdict: "review", reason: "Couldn't reach the page" };
  } finally {
    clearTimeout(timer);
  }
}

// GET /api/cron/link-check
// Runs weekly (see vercel.json). Checks every live listing's apply link,
// auto-removes clearly-dead curated ones, and emails a report. Manual test with
// ?key=<ADMIN_PASSWORD>.
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
  const { data, error } = await sb
    .from("jobs")
    .select("id, title, company_name, external_apply_url, poster_name, tier")
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
    const storedTitle = j.title as string;
    const { verdict, reason } = await checkLink(url, storedTitle);

    const entry: CheckedJob = {
      id: j.id as string,
      title: storedTitle,
      company: j.company_name as string,
      url,
      reason,
    };

    if (verdict === "alive") {
      aliveCount += 1;
      continue;
    }

    // Anyone who paid for a listing bought a month of placement, so their post is
    // never pulled automatically: a dead link there is reported and left for a
    // human to decide about. Only listings GOOD THINKING sourced itself, which
    // nobody paid for, are removed without asking.
    const isCurated = j.poster_name === CURATED_POSTER_NAME;

    if (verdict === "dead" && isCurated) {
      if (!dryRun) await sb.from("jobs").update({ status: "removed" }).eq("id", j.id);
      entry.reason = `${reason}. Removed automatically.`;
      removed.push(entry);
    } else if (verdict === "dead") {
      entry.reason = `${reason}. Left up because this is a paid listing: remove it from the admin panel if you agree it's filled.`;
      review.push(entry);
    } else {
      review.push(entry);
    }
  }

  if (!dryRun) {
    try {
      await sendLinkCheckReport({ checked: jobs.length, aliveCount, removed, review });
    } catch (err) {
      console.error("Failed to send link-check report:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    checked: jobs.length,
    aliveCount,
    removed,
    review,
  });
}
