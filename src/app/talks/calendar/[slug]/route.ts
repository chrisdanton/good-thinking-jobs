// Apple Calendar / any calendar app: downloads a .ics file for one session.
import { getSession, icsFile } from "@/lib/sessions";

export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const s = getSession(params.slug);
  if (!s) return new Response("Not found", { status: 404 });
  return new Response(icsFile(s), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="good-talks-${s.slug}.ics"`,
    },
  });
}
