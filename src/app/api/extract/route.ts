import { NextRequest, NextResponse } from "next/server";
import { extractJobFromUrl, ExtractError } from "@/lib/extract-job";

// POST /api/extract  body: { url }
// Public, unauthenticated version of the admin curate/extract endpoint. It reads
// a job posting off the open web and transcribes it into our form fields so a
// poster on /post can auto-fill the form from a link. It only reads and returns
// fields for review; it never saves anything, so there's nothing to protect with
// a password. Only http(s) links are allowed.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const url = String(body.url || "").trim();

  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json(
      { error: "Please paste a full link starting with http." },
      { status: 400 }
    );
  }

  try {
    const fields = await extractJobFromUrl(url);
    return NextResponse.json(fields);
  } catch (err) {
    if (err instanceof ExtractError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Public extract failed:", err);
    return NextResponse.json(
      { error: "Something went wrong reading that page." },
      { status: 500 }
    );
  }
}
