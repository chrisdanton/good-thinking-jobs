// Client-side engagement tracking. Records a "view" when someone opens a job and
// an "apply_click" when they click through to apply, so we can report traffic,
// top jobs, and click-through rate (see /api/track and job_events). This is
// best-effort and must never interfere with the page: every failure is swallowed.

export type JobEventType = "view" | "apply_click";

// A stable anonymous id per browser, so we can count unique visitors later
// without identifying anyone. Stored in localStorage; regenerated if cleared.
function visitorId(): string {
  try {
    const KEY = "gt_vid";
    let id = localStorage.getItem(KEY);
    if (!id) {
      id =
        (crypto?.randomUUID?.() as string) ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function trackJobEvent(jobId: string, type: JobEventType): void {
  // Sample/seed listings aren't real jobs and aren't in the database, so tracking
  // them would just add noise. Skip them.
  if (!jobId || jobId.startsWith("sample-")) return;

  try {
    // Count a given visitor's view of a given job at most once per browser
    // session, so a reload or a re-render doesn't inflate the numbers. Apply
    // clicks are always recorded (a repeat click is a real signal).
    if (type === "view") {
      const seenKey = `gt_viewed_${jobId}`;
      if (sessionStorage.getItem(seenKey)) return;
      sessionStorage.setItem(seenKey, "1");
    }

    const payload = JSON.stringify({
      jobId,
      type,
      visitorId: visitorId(),
      referrer: document.referrer || "",
    });

    // sendBeacon survives the page navigating away (important for apply clicks
    // that immediately open the company site). Fall back to fetch(keepalive).
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Tracking is never allowed to break the page.
  }
}
