import { NextRequest, NextResponse } from "next/server";
import { sendSpeakingEnquiry } from "@/lib/email";

// POST /api/speaking-enquiry  { name, email, company, topic, when, message, website }
//
// The booking form on /speaking. Emails the enquiry to hello@ with Reply-To set
// to the sender. `website` is a hidden honeypot field: real people never fill it,
// so anything that does is a bot and gets a silent "ok".

export const dynamic = "force-dynamic";

const TOPICS = ["Keynote", "Workshop", "Host a dinner", "Press & media", "Something else"];

function field(body: Record<string, unknown>, key: string, max: number) {
  return String(body[key] ?? "").trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (field(body, "website", 200)) return NextResponse.json({ ok: true });

  const name = field(body, "name", 120);
  const email = field(body, "email", 200);
  const company = field(body, "company", 160);
  const topicRaw = field(body, "topic", 40);
  const topic = TOPICS.includes(topicRaw) ? topicRaw : "Something else";
  const when = field(body, "when", 200);
  const message = field(body, "message", 5000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please add your name, a valid email, and a message." },
      { status: 400 }
    );
  }

  try {
    await sendSpeakingEnquiry({ name, email, company, topic, when, message });
  } catch (err) {
    console.error("speaking-enquiry: send failed", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong sending that. Please email hello@weareingoodco.com." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
