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

//   tba          optional: use instead of a firm date when it isn't set yet,
//                e.g. "Early 2027". Put a rough date in `date` so it sorts.

export const SESSIONS: Session[] = [
  {
    slug: "good-future-ask-us-anything",
    title: "GOOD FUTURE: Ask us anything",
    date: "2027-01-31",
    tba: "Early 2027",
    description: "Bring your questions about the 2027 predictions. We'll answer them live.",
    guest: "Chris + Kirsten",
    status: "upcoming",
  },
  {
    slug: "the-new-world-of-pr",
    title: "The new world of PR",
    date: "2026-10-29",
    time: "12:00",
    timezone: "America/New_York",
    description: "How media, attention and PR actually work now, and what brands should do about it.",
    guest: "Chris + Kirsten",
    image: "/sessions/good-pr.jpg",
    replayUrl: "", // paste the edited replay link here once it's posted
    status: "past",
  },
  {
    slug: "good-trends-q4-26",
    title: "GOOD TRENDS Q4 '26",
    date: "2026-09-10",
    description: "The quarterly read on what's shifting across culture, retail, tech, wellness and more.",
    guest: "Chris + Kirsten",
    duration: 55,
    image: "/sessions/good-trends-q4-26.jpg",
    replayUrl: "https://ingoodco.substack.com/perks/ad0abf74-664b-41d1-80d1-cc3b292472d5",
    status: "past",
  },
];
