import type { Metadata } from "next";
import { LaterRow, PastRow, UpcomingTile } from "@/components/sessions/SessionRow";
import { TimeZonePicker, TimeZoneProvider } from "@/components/sessions/TimeZone";
import { SUBSCRIBE, pastSessions, upcomingSessions } from "@/lib/sessions";
import { SpeakingFooter } from "../speaking/ui";

export const metadata: Metadata = {
  title: "GOOD SESSIONS · GOOD THINKING",
  description: "Masterclasses, LIVE sessions, unfiltered conversations that are best for behind a paywall.",
  openGraph: {
    title: "GOOD SESSIONS · GOOD THINKING",
    description: "Masterclasses, LIVE sessions, unfiltered conversations that are best for behind a paywall.",
    type: "website",
  },
};

// Rebuild hourly so sessions roll from Upcoming to Past without a redeploy.
export const revalidate = 3600;

const SUBSTACK = "https://ingoodco.substack.com";
const Y = "#F9FF00";
// How many upcoming sessions get the big poster tile; the rest go in the compact list.
const NEXT_COUNT = 3;

export default function SessionsPage() {
  const upcoming = upcomingSessions();
  const past = pastSessions();

  return (
    <TimeZoneProvider>
      <div className="speaking-root min-h-screen overflow-x-hidden font-sans" style={{ background: "#FAFAF8", color: "#000" }}>
        {/* Poster masthead */}
        <header style={{ background: Y, color: "#000" }} className="border-b-2 border-black">
          <div className="mx-auto max-w-6xl px-5 pb-10 pt-8 sm:px-10 sm:pb-14 sm:pt-10">
            <h1 className="speaking-display mt-4 text-[25vw] sm:text-[11rem] lg:text-[13rem]" style={{ lineHeight: 0.82 }}>
              Good
              <br />
              Sessions
            </h1>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-lg leading-snug sm:text-xl">
                Masterclasses, LIVE sessions, unfiltered conversations that are best for behind a paywall.
              </p>
              <TimeZonePicker />
            </div>
            {/* Subscribe once: every session lands in your calendar, new ones included. */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t-2 border-black pt-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em]">Subscribe to the calendar</span>
              <span className="flex flex-wrap gap-2">
                {([
                  ["Google", SUBSCRIBE.google],
                  ["Apple", SUBSCRIBE.apple],
                  ["Outlook", SUBSCRIBE.outlook],
                ] as const).map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target={label === "Apple" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="inline-block border-[1.5px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em]"
                    style={{ background: "#000", color: "#fff", borderColor: "#000" }}
                  >
                    + {label}
                  </a>
                ))}
              </span>
            </div>
          </div>
        </header>

        {/* Upcoming: the poster blocks */}
        <section aria-labelledby="upcoming" className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-20">
          <h2 id="upcoming" className="speaking-display text-4xl sm:text-6xl">Coming up</h2>
          {upcoming.length ? (
            <>
              <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.slice(0, NEXT_COUNT).map((s, i) => (
                  <UpcomingTile key={s.slug} s={s} index={i} />
                ))}
              </div>
              {upcoming.length > NEXT_COUNT && (
                <div className="mt-16 sm:mt-20">
                  <h3 className="pb-4 text-[11px] font-bold uppercase tracking-[0.3em]">Later</h3>
                  {upcoming.slice(NEXT_COUNT).map((s) => (
                    <LaterRow key={s.slug} s={s} />
                  ))}
                  <div style={{ borderTop: "2px solid #000" }} />
                </div>
              )}
            </>
          ) : (
            <p className="mt-6 text-lg">
              Next session coming soon. Paid members hear first.{" "}
              <a href={SUBSTACK} className="font-bold underline decoration-2 underline-offset-4">Join on Substack</a>
            </p>
          )}
        </section>

        {/* Past: the dark weekly-listing look */}
        {past.length > 0 && (
          <section aria-labelledby="past" style={{ background: "#000", color: "#fff" }}>
            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-20">
              <div className="flex items-end justify-between pb-6">
                <h2 id="past" className="speaking-display text-4xl sm:text-6xl">Past sessions</h2>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: Y }}>
                  Replays on Substack, for members
                </span>
              </div>
              {past.map((s) => (
                <PastRow key={s.slug} s={s} />
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.4)" }} />
            </div>
          </section>
        )}

        {/* Subscribe: same look as the weareingoodco.com footer. Sends people to
            Substack's own subscribe page (email pre-filled) where they pick a plan. */}
        <section style={{ background: "#000", color: "#fff" }}>
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
            <form action={`${SUBSTACK}/subscribe`} method="get" target="_blank" className="max-w-md">
              <label htmlFor="gs-email" className="block font-mono text-sm uppercase tracking-[0.08em] sm:text-base">
                Get GOOD THINKING + GOOD SESSIONS:
              </label>
              <div className="mt-4 flex" style={{ border: `1.5px solid ${Y}` }}>
                <input
                  id="gs-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 px-4 py-3 text-base outline-none"
                  style={{ background: "#000", color: "#fff", border: 0, borderRadius: 0 }}
                />
                <button
                  type="submit"
                  className="px-5 py-3 text-sm font-bold"
                  style={{ background: Y, color: "#000", border: 0, borderRadius: 0 }}
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </section>
        <SpeakingFooter />
      </div>
    </TimeZoneProvider>
  );
}
