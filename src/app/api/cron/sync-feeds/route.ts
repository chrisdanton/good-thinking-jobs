// Daily: refresh every active employer feed (see vercel.json for the schedule).
// Vercel calls this with `Authorization: Bearer <CRON_SECRET>`; admin can also
// trigger it by hand with ?key=<ADMIN_PASSWORD>.
import { NextRequest, NextResponse } from "next/server";
import { syncAllActive } from "@/lib/feeds/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const cronOk = !!process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`;
  const key = new URL(req.url).searchParams.get("key");
  const adminOk = !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
  if (!cronOk && !adminOk) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ synced: await syncAllActive() });
}
