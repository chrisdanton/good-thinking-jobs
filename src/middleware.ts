import { NextRequest, NextResponse } from "next/server";

// The same pages answer on www.getgoodthinking.com and the old vercel.app
// address, which Google reports as duplicates. Send page visits on those hosts
// to the main domain. API calls (crons, the phone Shortcut) are left alone.
const CANONICAL_HOST = "getgoodthinking.com";
const ALIAS_HOSTS = new Set(["www.getgoodthinking.com", "good-thinking-jobs.vercel.app"]);

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  if (!ALIAS_HOSTS.has(host)) return NextResponse.next();
  if (req.method !== "GET" && req.method !== "HEAD") return NextResponse.next();

  const url = req.nextUrl.clone();
  url.protocol = "https";
  url.host = CANONICAL_HOST;
  url.port = "";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!api/|_next/).*)"],
};
