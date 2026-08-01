import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendLinkCheckReport, sendDeadLinkNotice } from "@/lib/email";
import { CURATED_POSTER_NAME } from "@/lib/constants";
import { looksExpired } from "@/lib/title-match";
import { readableUrlFor } from "@/lib/extract-job";
import { Job } from "@/lib/types";

interface CheckedJob {
  id: string;
  title: string;
  company: string;
  url: string;
  reason: string;
}

type Verdict = "alive" | "dead";

interface CheckResult {
  verdict: Verdict;
  reason: string;
}

// Visit one apply link and decide only one thing: is the posting definitely gone?
//
// Chris's rule: remove links that aren't working, and nothing else — no "might be
// filled" guesses. So this is deliberately conservative. A job is called "dead"
// only on hard evidence:
//   - the page returns 404 / 410 (not found)
//   - it redirects away from the posting, dropping the job id
//   - it explicitly says the posting has expired or been filled
// Anything else — a bot-block (403/406), a server error, a page we can't read,
// an unfamiliar title — counts as "alive" and is left alone silently. Better to
// keep a filled job up a while longer than to pull a live one by mistake.
//
// Reads the same JSON back-doors the extractor uses (readableUrlFor), and asks
// for JSON as well as HTML — Workday's career sites 406 an HTML-only request but
// return the posting (200) or a clean 404 when asked for their JSON endpoint,
// which is what made every Workday listing look "unconfirmable" before.
async function checkOnce(url: string): Promise<CheckResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  const fetchUrl = readableUrlFor(url);
  // Only Workday's CXS JSON endpoint needs a JSON Accept header (without it, it
  // 406s). Sending JSON-first to ordinary career pages backfires: JobScore, for
  // one, answers a JSON-preferring request with a 404 even though the posting is
  // live, which would wrongly mark the job dead. So ask for JSON only for CXS.
  const isCxs = fetchUrl.includes("/wday/cxs/");
  try {
    const res = await fetch(fetchUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        Accept: isCxs
          ? "application/json, text/html,application/xhtml+xml"
          : "text/html,application/xhtml+xml",
      },
    });

    if (res.status === 404 || res.status === 410) {
      return { verdict: "dead", reason: "Link returned 'not found'" };
    }
    // Any other non-OK status (403/406 bot-blocks, 5xx, rate limits) means we
    // couldn't read the page — not that the job is gone. Keep it, stay quiet.
    if (res.status >= 400) {
      return { verdict: "alive", reason: "" };
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

    return { verdict: "alive", reason: "" };
  } catch {
    // Timeout / unreachable — can't conclude it's dead, so leave it.
    return { verdict: "alive", reason: "" };
  } finally {
    clearTimeout(timer);
  }
}

// A single 404 or error can be transient (a rate limit, a momentary server
// hiccup, a CDN blip) — and this cron auto-removes dead links, so acting on one
// bad read could pull a live job. Real example: Sesame Workshop's careers page
// returned a one-off 404 that cleared on the next request. So a "dead" verdict is
// only trusted when a second look, a couple seconds later, agrees.
async function checkLink(url: string): Promise<CheckResult> {
  const first = await checkOnce(url);
  if (first.verdict !== "dead") return first;
  await new Promise((r) => setTimeout(r, 2500));
  const second = await checkOnce(url);
  return second.verdict === "dead" ? second : { verdict: "alive", reason: "" };
}

// GET /api/cron/link-check
// Runs weekly (see vercel.json). Checks every live listing's apply link,
// removes the ones that are definitely gone, and emails a short note ONLY when
// something was removed. Manual test with ?key=<ADMIN_PASSWORD> (add &dryRun=1 to
// see what it would remove without touching anything).
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
    .select("id, title, company_name, external_apply_url, status, poster_name, poster_email")
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const jobs = (data || []).filter((j) => (j.external_apply_url as string)?.startsWith("http"));

  const removed: CheckedJob[] = [];
  let aliveCount = 0;

  for (const j of jobs) {
    const url = j.external_apply_url as string;
    const { verdict, reason } = await checkLink(url);

    if (verdict === "alive") {
      aliveCount += 1;
      continue;
    }

    // Definitely gone — remove it. Live jobs are never touched, so a listing only
    // gets pulled when its own link is genuinely dead.
    if (!dryRun) await sb.from("jobs").update({ status: "removed" }).eq("id", j.id);

    // An employer who posted this themselves gets a friendly heads-up with a free
    // repost offer; GOOD THINKING's own curated listings are pulled quietly.
    const isCurated = j.poster_name === CURATED_POSTER_NAME;
    const posterEmail = String(j.poster_email || "");
    let note = `${reason}. Removed automatically.`;
    if (!isCurated && /@/.test(posterEmail)) {
      if (!dryRun) {
        try {
          await sendDeadLinkNotice({
            title: j.title,
            companyName: j.company_name,
            posterEmail,
          } as Job);
          note += ` Poster (${posterEmail}) notified with a free-repost offer.`;
        } catch (err) {
          console.error("Failed to send dead-link notice:", err);
          note += ` Couldn't reach the poster (${posterEmail}).`;
        }
      } else {
        note += ` Would notify poster (${posterEmail}).`;
      }
    }

    removed.push({
      id: j.id as string,
      title: j.title as string,
      company: j.company_name as string,
      url,
      reason: note,
    });
  }

  // Only email when there's actually something to report — no news, no email.
  if (!dryRun && removed.length > 0) {
    try {
      await sendLinkCheckReport({ checked: jobs.length, aliveCount, removed, review: [] });
    } catch (err) {
      console.error("Failed to send link-check report:", err);
    }
  }

  return NextResponse.json({ ok: true, dryRun, checked: jobs.length, aliveCount, removed });
}
