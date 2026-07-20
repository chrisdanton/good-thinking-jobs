import { NextRequest, NextResponse } from "next/server";
import { extractJobFromUrl, ExtractError } from "@/lib/extract-job";
import { publishCuratedJob, findExistingByApplyUrl } from "@/lib/publish-curated";

// POST/GET /api/share  { token, url }
//
// The phone endpoint. An iOS Shortcut in the share sheet sends a job link here
// from the LinkedIn app; we read the posting and publish it to the board in one
// step, then hand back a short human-readable message the Shortcut shows as a
// notification. No admin login, no typing.
//
// Auth is a single long random token (SHARE_TOKEN) stored inside the Shortcut.
// It is deliberately separate from ADMIN_PASSWORD: this token only ever reaches
// this one endpoint, so if a phone is lost it can be rotated on its own without
// changing the admin password.

// Compare without leaking length/prefix information through timing.
function tokenMatches(provided: string): boolean {
  const expected = process.env.SHARE_TOKEN || "";
  if (!expected || !provided || provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return diff === 0;
}

// The share sheet sometimes hands over a URL on its own and sometimes a blob of
// text with the URL inside it ("Check out this job at Acme https://…"). Take the
// first http(s) link we find, and drop tracking noise off the end.
function firstUrlIn(raw: string): string {
  const m = raw.match(/https?:\/\/[^\s<>"')]+/);
  if (!m) return "";
  return m[0].replace(/[.,;)\]]+$/, "");
}

async function handle(token: string, rawUrl: string) {
  if (!process.env.SHARE_TOKEN) {
    return NextResponse.json(
      { ok: false, message: "Sharing isn't set up yet — add a SHARE_TOKEN in Vercel." },
      { status: 500 }
    );
  }
  if (!tokenMatches(token)) {
    return NextResponse.json({ ok: false, message: "Not authorized." }, { status: 401 });
  }

  const url = firstUrlIn(rawUrl);
  if (!url) {
    return NextResponse.json(
      { ok: false, message: "No job link found in what was shared." },
      { status: 400 }
    );
  }

  // Re-sharing the same posting shouldn't double-post it.
  const existing = await findExistingByApplyUrl(url);
  if (existing) {
    return NextResponse.json({ ok: true, duplicate: true, id: existing, message: "Already on the board." });
  }

  let fields;
  try {
    fields = await extractJobFromUrl(url);
  } catch (err) {
    if (err instanceof ExtractError) {
      return NextResponse.json({ ok: false, message: err.message }, { status: err.status });
    }
    console.error("Share extract failed:", err);
    return NextResponse.json({ ok: false, message: "Couldn't read that posting." }, { status: 500 });
  }

  const result = await publishCuratedJob(fields);
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.error }, { status: result.status });
  }

  const where = [fields.companyName, fields.location].filter(Boolean).join(" · ");
  return NextResponse.json({
    ok: true,
    id: result.id,
    message: `Posted: ${fields.title}${where ? ` — ${where}` : ""}`,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  return handle(String(body.token || ""), String(body.url || body.text || ""));
}

// Also allow GET so the whole thing can be tested by pasting a link in a browser.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  return handle(p.get("token") || "", p.get("url") || "");
}
