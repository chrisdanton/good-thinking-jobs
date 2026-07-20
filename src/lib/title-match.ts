// Comparing a stored job title against whatever a page currently claims to be.
//
// Expired postings frequently do not 404. An applicant tracking system will keep
// the URL alive and serve a different, still-open role at the same address, so
// the link looks healthy while pointing at the wrong job. Comparing titles is
// what catches that.

function words(s: string): Set<string> {
  return new Set(
    (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      // Drop filler that two unrelated titles would share anyway.
      .filter((w) => w.length > 2 && !["and", "the", "for", "of"].includes(w))
  );
}

// True if two job titles look like different roles. Compared loosely on shared
// words, since a title can legitimately pick up or lose a qualifier ("Senior
// Director, Strategy" vs "Senior Director Strategy") without being a new job.
export function titlesDiverge(stored: string, found: string): boolean {
  const a = words(stored);
  const b = words(found);
  if (a.size === 0 || b.size === 0) return false;
  let shared = 0;
  a.forEach((w) => {
    if (b.has(w)) shared++;
  });
  // Measure against the shorter title so a longer, more specific version of the
  // same role still counts as a match.
  return shared / Math.min(a.size, b.size) < 0.5;
}

// Best guess at what role a page is showing, without spending an AI call. Job
// pages put the title in a handful of predictable places; the first one that
// yields something usable wins.
export function pageTitleOf(html: string): string {
  const patterns = [
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
    /"@type"\s*:\s*"JobPosting"[\s\S]{0,400}?"title"\s*:\s*"([^"]+)"/i,
    /<h1[^>]*>([\s\S]{0,200}?)<\/h1>/i,
    /<title[^>]*>([\s\S]{0,200}?)<\/title>/i,
    // Last resort. LinkedIn's guest endpoint returns a bare fragment with no
    // <title>, <h1> or og:title at all, and carries the role in an <h2>. On a
    // full page an <h2> could be any section heading, so this is only reached
    // once every stronger signal has come up empty, and a mismatch found this
    // way is reported for review rather than acted on.
    /<h2[^>]*>([\s\S]{0,200}?)<\/h2>/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const t = m[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&#39;|&rsquo;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
      if (t.length > 2) return t;
    }
  }
  return "";
}

// Phrases boards show when a posting has closed but the page still returns 200.
// Each one has to name the job or the application, because a bare phrase like
// "no longer available" turns up in unrelated page furniture.
const EXPIRY_PHRASES = [
  "this job has expired",
  "this job is no longer",
  "this job posting is no longer",
  "no longer accepting applications",
  "position has been filled",
  "this position is no longer available",
  "this position has closed",
  "job posting has expired",
  "this posting has closed",
  "this posting is no longer",
  "this role has been filled",
  "applications are closed",
];

export function looksExpired(html: string): boolean {
  // Script and style bodies are stripped first. Sites ship their entire UI
  // translation dictionary inline, and those dictionaries contain exactly the
  // sentences searched for here. Apple's page, for one, carries a template
  // string reading "the profile you are trying to access is no longer
  // available", which has nothing to do with whether the job is open. Only copy
  // a visitor could actually read should count.
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
  return EXPIRY_PHRASES.some((p) => visible.includes(p));
}
