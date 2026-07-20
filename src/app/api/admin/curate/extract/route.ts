import { NextRequest, NextResponse } from "next/server";
import { extractJobFromUrl, ExtractError } from "@/lib/extract-job";

function authorized(key: string | null | undefined): boolean {
  return !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
}

// POST /api/admin/curate/extract  body: { key, url }
// Fetches the job page and transcribes it into the posting form. Returns the
// fields for review in the admin panel; does not save anything.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!authorized(body.key)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const fields = await extractJobFromUrl(String(body.url || "").trim());
    return NextResponse.json(fields);
  } catch (err) {
    if (err instanceof ExtractError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Curate extract failed:", err);
    return NextResponse.json({ error: "Something went wrong reading that page." }, { status: 500 });
  }
}
