// ─────────────────────────────────────────────────────────────────────────────
// GOOD SESSIONS: the one file to edit.
//
// ADD A SESSION: copy one { ... } block below, paste it at the top of the list,
// and change the details. Save, commit, push. That's it.
//
// AFTER A SESSION: change status to "past" and paste the edited replay link
// into replayUrl. (If you forget, it moves to Past on its own the day after,
// and the button falls back to accessUrl until a replayUrl is added.)
//
// Fields:
//   slug         short id, lowercase-with-dashes, must be unique
//   title        the session title
//   date         "YYYY-MM-DD"
//   time         24-hour "HH:MM" in the timezone below, e.g. "12:00" or "16:30"
//   timezone     usually "America/New_York"
//   description  one short sentence
//   guest        optional, e.g. "Chris + Kirsten" or "with Jane Doe"
//   duration     minutes, e.g. 30
//   image        optional, a file in /public, e.g. "/sessions/ai-shopping.jpg"
//   accessUrl    the paid-only Substack post/live link (members get in, others hit the upgrade page)
//   replayUrl    the edited Riverside replay link, once it's up
//   status       "upcoming" or "past"
//   featured     true to make it the "Next up" pick in the small homepage module
// ─────────────────────────────────────────────────────────────────────────────

import type { Session } from "@/lib/sessions";

export const SESSIONS: Session[] = [
  {
    slug: "ai-shopping",
    title: "What we're getting wrong about AI shopping",
    date: "2026-11-19",
    time: "12:00",
    timezone: "America/New_York",
    description: "A 30-minute conversation about where AI commerce is actually going.",
    guest: "Chris + Kirsten",
    duration: 30,
    accessUrl: "https://ingoodco.substack.com", // TODO: replace with the paid-only Substack link
    status: "upcoming",
    featured: true,
  },
];
