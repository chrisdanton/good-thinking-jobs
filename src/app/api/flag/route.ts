import { NextRequest, NextResponse } from "next/server";
import { applyFlag } from "@/lib/apply-flag";

// POST/GET /api/flag  { token, url, note }
//
// The phone "fix this" endpoint. From his phone, Chris shares a job (either its
// board link, .../jobs/<id>, or the original apply link) plus a short plain note
// of what's wrong — "salary is 166k to 276k", "company should be LEGO", "take it
// down". The note is parsed deterministically (see flag-note.ts) and applied to
// the row; anything unparseable is emailed for a human rather than guessed at.
//
// The same behaviour is also reachable through /api/share (a share that carries a
// note is treated as a fix), so Chris's one existing Shortcut can do both. This
// endpoint stays as the dedicated, self-documenting entry point.
//
// Auth reuses SHARE_TOKEN — the same secret the "post a job" Shortcut carries.

export const dynamic = "force-dynamic";

// Constant-time token check, matching /api/share.
function tokenMatches(providedRaw: string): boolean {
  const expected = (process.env.SHARE_TOKEN || "").trim();
  const provided = (providedRaw || "").trim();
  if (!expected || !provided || provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return diff === 0;
}

async function handle(token: string, rawUrl: string, note: string) {
  if (!process.env.SHARE_TOKEN) {
    return NextResponse.json(
      { ok: false, message: "Flagging isn't set up yet — add a SHARE_TOKEN in Vercel." },
      { status: 500 }
    );
  }
  if (!tokenMatches(token)) {
    return NextResponse.json({ ok: false, message: "Not authorized." }, { status: 401 });
  }

  const result = await applyFlag(rawUrl, note);
  return NextResponse.json(
    { ok: result.ok, id: result.id, applied: result.applied, message: result.message },
    { status: result.status }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  return handle(
    String(body.token || ""),
    String(body.url || body.job || ""),
    String(body.note || body.text || body.fix || "")
  );
}

// GET too, so a flag can be fired by pasting a link in a browser for testing.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  return handle(p.get("token") || "", p.get("url") || "", p.get("note") || p.get("text") || "");
}
