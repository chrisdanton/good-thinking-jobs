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
//   time         24-hour "HH:MM" in the timezone below. Standard slot: "12:00"
//                (9am PT / 12pm ET / 6pm Central Europe)
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
    slug: "substack-for-brands",
    title: "Substack for brands",
    date: "2026-12-10",
    time: "12:00",
    timezone: "America/New_York",
    description: "How brands can show up on Substack, and who's already doing it well. Not a “how-to” but a “what good looks like.”",
    guest: "Chris + Kirsten",
    accessUrl: "", // paste the paid-only Substack link here
    status: "upcoming",
  },
  {
    slug: "good-trends-q1-27",
    title: "GOOD FUTURE '27: Ask us anything",
    date: "2027-01-12",
    time: "12:00",
    timezone: "America/New_York",
    accessUrl: "", // paste the paid-only Substack link here
    description: "Our Q1 trends session. Bring your questions about the 2027 predictions and we'll answer them live.",
    guest: "Chris + Kirsten",
    status: "upcoming",
  },
  {
    slug: "cannes-submissions",
    title: "Cannes submissions: WTF to know",
    date: "2027-02-11", // proposed date
    time: "12:00",
    timezone: "America/New_York",
    accessUrl: "",
    description: "What actually wins, what gets ignored, and what to know before you enter.",
    guest: "Chris + Kirsten",
    status: "upcoming",
  },
  {
    slug: "good-trends-q2-27",
    title: "GOOD TRENDS Q2 '27",
    date: "2027-03-11",
    time: "12:00",
    timezone: "America/New_York",
    accessUrl: "",
    description: "The quarterly read on what's shifting across culture, retail, tech, wellness and more.",
    guest: "Chris + Kirsten",
    status: "upcoming",
  },
  {
    slug: "fractional-leadership",
    title: "Fractional leadership: advice from the inside",
    date: "2027-04-15", // proposed date
    time: "12:00",
    timezone: "America/New_York",
    accessUrl: "",
    description: "How fractional CMOs and brand leaders really work, and how to hire or become one.",
    guest: "Chris + Kirsten",
    status: "upcoming",
  },
  {
    slug: "linkedin-despite-the-cringe",
    title: "LinkedIn, despite the cringe",
    date: "2027-05-13", // proposed date
    time: "12:00",
    timezone: "America/New_York",
    accessUrl: "",
    description: "How to show up on LinkedIn in a way that builds something, without becoming that person.",
    guest: "Chris + Kirsten",
    status: "upcoming",
  },
  {
    slug: "good-trends-q3-27",
    title: "GOOD TRENDS Q3 '27",
    date: "2027-06-10",
    time: "12:00",
    timezone: "America/New_York",
    accessUrl: "",
    description: "The quarterly read on what's shifting across culture, retail, tech, wellness and more.",
    guest: "Chris + Kirsten",
    status: "upcoming",
  },
  {
    slug: "good-trends-q4-27",
    title: "GOOD TRENDS Q4 '27",
    date: "2027-09-09",
    time: "12:00",
    timezone: "America/New_York",
    accessUrl: "",
    description: "The quarterly read on what's shifting across culture, retail, tech, wellness and more.",
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
