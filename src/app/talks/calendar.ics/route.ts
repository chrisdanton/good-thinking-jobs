// The GOOD SESSIONS calendar feed people subscribe to (webcal://…/sessions/calendar.ics).
import { icsFeed } from "@/lib/sessions";

export const revalidate = 3600;

export function GET() {
  return new Response(icsFeed(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="good-sessions.ics"',
    },
  });
}
