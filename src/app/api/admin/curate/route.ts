import { NextRequest, NextResponse } from "next/server";
import { publishCuratedJob } from "@/lib/publish-curated";

function authorized(key: string | null | undefined): boolean {
  return !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
}

// POST /api/admin/curate  body: { key, ...jobFields }
// Publishes a curated listing directly (admin only).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!authorized(body.key)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await publishCuratedJob(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ id: result.id }, { status: 201 });
}
