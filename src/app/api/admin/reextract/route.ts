import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { extractJobFromUrl, ExtractError } from "@/lib/extract-job";
import { CURATED_POSTER_NAME } from "@/lib/constants";
import { titlesDiverge } from "@/lib/title-match";

function authorized(key: string | null | undefined): boolean {
  return !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
}


// POST /api/admin/reextract  body: { key, id, dryRun? }
//
// Re-reads a curated job's original posting and replaces its description and
// requirements with the posting's own words. Exists because listings added
// before the extractor was made verbatim contain Claude-written summaries
// rather than the company's language.
//
// Deliberately narrow:
// - Only jobs posted by GOOD THINKING (curated). Employer-submitted listings
//   have descriptions the employer typed themselves; re-reading a third-party
//   URL over the top of those would replace their own words with someone else's.
// - Only description and requirements are touched. Salary, level, department and
//   the rest may have been hand-corrected in the admin panel, so they stand.
// - If the source page can't be read (dead link, login wall), the job is left
//   exactly as it is rather than blanked.
// - dryRun returns the proposed new text without writing anything.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!authorized(body.key)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = String(body.id || "").trim();
  if (!id) {
    return NextResponse.json({ error: "A job id is required." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data: rows, error: readErr } = await supabase
    .from("jobs")
    .select("id, title, company_name, poster_name, external_apply_url, description, requirements")
    .eq("id", id)
    .limit(1);

  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }
  const job = rows?.[0];
  if (!job) {
    return NextResponse.json({ error: "No job with that id." }, { status: 404 });
  }

  if (job.poster_name !== CURATED_POSTER_NAME) {
    return NextResponse.json(
      {
        error: `Skipped: "${job.title}" was submitted by ${job.poster_name}, not curated. Its description is the employer's own text.`,
      },
      { status: 409 }
    );
  }

  const url = String(job.external_apply_url || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "That job has no usable source link." }, { status: 409 });
  }

  let fields;
  try {
    fields = await extractJobFromUrl(url);
  } catch (err) {
    if (err instanceof ExtractError) {
      return NextResponse.json({ error: `Couldn't re-read the source: ${err.message}` }, { status: err.status });
    }
    console.error("Re-extract failed:", err);
    return NextResponse.json({ error: "Something went wrong re-reading that posting." }, { status: 500 });
  }

  const description = String(fields.description || "").trim();
  const requirements = String(fields.requirements || "").trim();

  // A page that loads but yields nothing usable (expired posting, sign-in wall
  // that still returns 200) would otherwise wipe a good description.
  if (description.length < 200) {
    return NextResponse.json(
      {
        error: `Skipped: re-reading the source produced only ${description.length} characters, which looks like an expired or gated posting. Left unchanged.`,
      },
      { status: 409 }
    );
  }

  // An expired posting often doesn't 404. The ATS keeps the URL alive and serves
  // a different, still-open role at the same address, so the page reads fine and
  // yields a full description belonging to some other job. Writing that over the
  // stored listing would silently replace it with an unrelated role, so confirm
  // the page still describes the job we think it does before touching anything.
  const titleDrift = titlesDiverge(job.title, fields.title);
  if (titleDrift) {
    return NextResponse.json(
      {
        error: `Skipped: that link now serves a different role ("${fields.title}" rather than "${job.title}"), so the original posting has probably expired. Left unchanged.`,
        servesDifferentRole: true,
        storedTitle: job.title,
        foundTitle: fields.title,
      },
      { status: 409 }
    );
  }

  const result = {
    id: job.id,
    title: job.title,
    foundTitle: fields.title,
    company: job.company_name,
    url,
    before: { description: job.description, requirements: job.requirements },
    after: { description, requirements },
  };

  if (body.dryRun) {
    return NextResponse.json({ ...result, dryRun: true });
  }

  const { error: writeErr } = await supabase
    .from("jobs")
    .update({ description, requirements })
    .eq("id", job.id);

  if (writeErr) {
    return NextResponse.json({ error: writeErr.message }, { status: 500 });
  }

  return NextResponse.json({ ...result, updated: true });
}
