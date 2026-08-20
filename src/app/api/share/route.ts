import { NextRequest, NextResponse } from "next/server";
import { extractJobFromUrl, ExtractError } from "@/lib/extract-job";
import { publishCuratedJob, findExistingByApplyUrl } from "@/lib/publish-curated";
import { applyFlag } from "@/lib/apply-flag";

// POST/GET /api/share  { token, url, note? }
//
// The phone endpoint. An iOS Shortcut in the share sheet sends a job link here
// from the LinkedIn app; we read the posting and publish it to the board in one
// step, then hand back a short human-readable message the Shortcut shows as a
// notification. No admin login, no typing.
//
// If the share also carries a `note` ("salary 166k-276k", "company should be
// LEGO", "take it down"), it's treated as a FIX to an existing job rather than a
// new post — so Chris's one Shortcut does both: leave the note blank to post,
// type a note to correct a job already on the board. See applyFlag / flag-note.ts.
//
// Auth is a long random token stored inside the Shortcut. It is deliberately
// separate from ADMIN_PASSWORD: these tokens only ever reach this one endpoint,
// so if a phone is lost the token can be rotated on its own without changing the
// admin password.
//
// Each person who has the Shortcut gets their OWN token, so any one phone can be
// cut off without disturbing the others. SHARE_TOKEN holds the first (original)
// token; SHARE_TOKENS is an optional comma-separated list of additional tokens,
// one per extra person. Keeping them in separate env vars means a new person can
// be added by editing SHARE_TOKENS alone, never touching the original token.

function validTokens(): string[] {
  const tokens: string[] = [];
  const primary = (process.env.SHARE_TOKEN || "").trim();
  if (primary) tokens.push(primary);
  for (const t of (process.env.SHARE_TOKENS || "").split(",")) {
    const trimmed = t.trim();
    if (trimmed) tokens.push(trimmed);
  }
  return tokens;
}

// Compare without leaking length/prefix information through timing.
function equalsConstantTime(expected: string, provided: string): boolean {
  if (expected.length !== provided.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return diff === 0;
}

function tokenMatches(providedRaw: string): boolean {
  // Both sides are trimmed. It's easy to store a secret with a trailing newline
  // (piping it in with `echo` is enough to do it), and the resulting failure
  // looks exactly like a wrong token with nothing in the logs to say otherwise.
  const provided = (providedRaw || "").trim();
  if (!provided) return false;
  // Check against every valid token; matched stays true if any one matches, but
  // we always walk the whole list so timing doesn't reveal which token hit.
  let matched = false;
  for (const expected of validTokens()) {
    if (equalsConstantTime(expected, provided)) matched = true;
  }
  return matched;
}

// The share sheet sometimes hands over a URL on its own and sometimes a blob of
// text with the URL inside it ("Check out this job at Acme https://…"). Take the
// first http(s) link we find, and drop tracking noise off the end.
function firstUrlIn(raw: string): string {
  const m = raw.match(/https?:\/\/[^\s<>"')]+/);
  if (!m) return "";
  return m[0].replace(/[.,;)\]]+$/, "");
}

async function handle(token: string, rawUrl: string, note: string) {
  if (!process.env.SHARE_TOKEN) {
    return NextResponse.json(
      { ok: false, message: "Sharing isn't set up yet — add a SHARE_TOKEN in Vercel." },
      { status: 500 }
    );
  }
  if (!tokenMatches(token)) {
    return NextResponse.json({ ok: false, message: "Not authorized." }, { status: 401 });
  }

  // A note means "fix an existing job", not "post a new one".
  if (note.trim()) {
    const result = await applyFlag(rawUrl, note);
    return NextResponse.json(
      { ok: result.ok, id: result.id, applied: result.applied, message: result.message },
      { status: result.status }
    );
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
  return handle(
    String(body.token || ""),
    String(body.url || body.text || ""),
    String(body.note || body.fix || "")
  );
}

// Also allow GET so the whole thing can be tested by pasting a link in a browser.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  return handle(p.get("token") || "", p.get("url") || "", p.get("note") || "");
}
