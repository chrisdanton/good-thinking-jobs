// GOOD SESSIONS helpers: sorting into upcoming/past, date labels, and
// add-to-calendar links. Session content itself lives in src/app/sessions/data.ts.
import { SESSIONS } from "@/app/sessions/data";

export type Session = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM, 24h, in `timezone`
  timezone?: string; // IANA, e.g. America/New_York
  description: string;
  guest?: string;
  duration?: number; // minutes
  image?: string;
  accessUrl?: string;
  replayUrl?: string;
  status: "upcoming" | "past";
  featured?: boolean;
  tba?: string; // e.g. "Early 2027": shown instead of the date until one is set
};

export const SITE_URL = "https://getgoodthinking.com";
const DEFAULT_TZ = "America/New_York";

// Convert a wall-clock time in a timezone to a real UTC Date.
export function startDate(s: Session): Date {
  const [y, m, d] = s.date.split("-").map(Number);
  const [hh, mm] = (s.time || "12:00").split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: s.timezone || DEFAULT_TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(guess));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asIfUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return new Date(guess - (asIfUtc - guess));
}

export function endDate(s: Session): Date {
  return new Date(startDate(s).getTime() + (s.duration || 60) * 60_000);
}

// A session is past if marked so, or once it ended more than a day ago.
export function isPast(s: Session, now = new Date()): boolean {
  if (s.status === "past") return true;
  if (s.tba) return false;
  return endDate(s).getTime() + 24 * 3600_000 < now.getTime();
}

export function upcomingSessions(now = new Date()): Session[] {
  return SESSIONS.filter((s) => !isPast(s, now)).sort((a, b) => startDate(a).getTime() - startDate(b).getTime());
}

export function pastSessions(now = new Date()): Session[] {
  return SESSIONS.filter((s) => isPast(s, now)).sort((a, b) => startDate(b).getTime() - startDate(a).getTime());
}

// Featured upcoming session first, otherwise the soonest.
export function nextSession(now = new Date()): Session | undefined {
  const up = upcomingSessions(now);
  return up.find((s) => s.featured) || up.find((s) => !s.tba) || up[0];
}

export function getSession(slug: string): Session | undefined {
  return SESSIONS.find((s) => s.slug === slug);
}

// Labels: "NOV" / "19", and "12PM EST"
export function monthLabel(s: Session) {
  return startDate(s).toLocaleString("en-US", { month: "short", timeZone: s.timezone || DEFAULT_TZ }).toUpperCase();
}
export function dayLabel(s: Session) {
  return startDate(s).toLocaleString("en-US", { day: "numeric", timeZone: s.timezone || DEFAULT_TZ });
}
export function yearLabel(s: Session) {
  return startDate(s).toLocaleString("en-US", { year: "numeric", timeZone: s.timezone || DEFAULT_TZ });
}
export function timeLabel(s: Session) {
  if (!s.time) return "";
  const str = startDate(s).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: s.timezone || DEFAULT_TZ,
    timeZoneName: "short",
  });
  return str.replace(":00", "").replace(" AM", "AM").replace(" PM", "PM");
}

// ── Add to calendar ──
const icsStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function details(s: Session) {
  return `${s.description}\n\nA GOOD SESSION for GOOD THINKING paid members.\n${s.accessUrl || `${SITE_URL}/sessions`}`;
}

export function googleCalUrl(s: Session) {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `GOOD SESSIONS: ${s.title}`,
    dates: `${icsStamp(startDate(s))}/${icsStamp(endDate(s))}`,
    details: details(s),
    location: s.accessUrl || `${SITE_URL}/sessions`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function outlookCalUrl(s: Session) {
  const p = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: `GOOD SESSIONS: ${s.title}`,
    startdt: startDate(s).toISOString(),
    enddt: endDate(s).toISOString(),
    body: details(s),
    location: s.accessUrl || `${SITE_URL}/sessions`,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${p.toString()}`;
}

export function icsPath(s: Session) {
  return `/sessions/calendar/${s.slug}`;
}

const icsEscape = (t: string) => t.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

function icsEvent(s: Session) {
  return [
    "BEGIN:VEVENT",
    `UID:${s.slug}@getgoodthinking.com`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(startDate(s))}`,
    `DTEND:${icsStamp(endDate(s))}`,
    `SUMMARY:${icsEscape(`GOOD SESSIONS: ${s.title}`)}`,
    `DESCRIPTION:${icsEscape(details(s))}`,
    `URL:${s.accessUrl || `${SITE_URL}/sessions`}`,
    "END:VEVENT",
  ];
}

function icsWrap(events: string[][], name?: string) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GOOD THINKING//GOOD SESSIONS//EN",
    "CALSCALE:GREGORIAN",
    ...(name ? [`X-WR-CALNAME:${name}`, "X-PUBLISHED-TTL:PT12H", "REFRESH-INTERVAL;VALUE=DURATION:PT12H"] : []),
    ...events.flat(),
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

// One session (the "Apple" add-to-calendar link).
export function icsFile(s: Session) {
  return icsWrap([icsEvent(s)]);
}

// The subscribable calendar: every dated session, past and upcoming. Calendar apps
// re-check it every few hours, so new sessions appear on their own.
export function icsFeed() {
  const dated = SESSIONS.filter((s) => !s.tba && s.time);
  return icsWrap(dated.map(icsEvent), "GOOD SESSIONS");
}

export const FEED_PATH = "/sessions/calendar.ics";
const FEED_HTTPS = `${SITE_URL}${FEED_PATH}`;
const FEED_WEBCAL = FEED_HTTPS.replace(/^https:/, "webcal:");
export const SUBSCRIBE = {
  apple: FEED_WEBCAL,
  google: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(FEED_WEBCAL)}`,
  outlook: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(FEED_HTTPS)}&name=${encodeURIComponent("GOOD SESSIONS")}`,
};
