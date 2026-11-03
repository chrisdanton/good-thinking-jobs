import type { Metadata } from "next";
import SessionRow from "@/components/sessions/SessionRow";
import { pastSessions, upcomingSessions } from "@/lib/sessions";
import { SpeakingFooter } from "../speaking/ui";

export const metadata: Metadata = {
  title: "GOOD SESSIONS · GOOD THINKING",
  description: "Conversations, briefings and occasional deep dives for GOOD THINKING paid members.",
  openGraph: {
    title: "GOOD SESSIONS · GOOD THINKING",
    description: "Conversations, briefings and occasional deep dives for GOOD THINKING paid members.",
    type: "website",
  },
};

// Rebuild hourly so sessions roll from Upcoming to Past without a redeploy.
export const revalidate = 3600;

const SUBSTACK = "https://ingoodco.substack.com";

export default function SessionsPage() {
  const upcoming = upcomingSessions();
  const past = pastSessions();

  return (
    <div className="speaking-root min-h-screen overflow-x-hidden font-sans" style={{ background: "#FAFAF8", color: "#000" }}>
      <main className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* Masthead */}
        <header className="pb-14 pt-16 sm:pb-20 sm:pt-24">
          <h1 className="speaking-display text-[19vw] sm:text-[8rem] lg:text-[10rem]">
            Good<br />Sessions
          </h1>
          <p className="mt-8 max-w-xl text-lg sm:text-xl leading-relaxed">
            Conversations, briefings and occasional deep dives for GOOD THINKING paid members.
          </p>
        </header>

        {/* Upcoming */}
        <section aria-labelledby="upcoming">
          <h2 id="upcoming" className="pb-4 text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em]">
            Upcoming
          </h2>
          {upcoming.length ? (
            upcoming.map((s) => <SessionRow key={s.slug} s={s} />)
          ) : (
            <div className="border-t-2 border-black py-12">
              <p className="speaking-display text-3xl sm:text-5xl">Next session coming soon.</p>
              <p className="mt-4 text-lg">
                Paid members hear first.{" "}
                <a href={SUBSTACK} className="font-bold underline decoration-2 underline-offset-4">
                  Join on Substack
                </a>
              </p>
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section aria-labelledby="past" className="mt-20 sm:mt-28">
            <h2 id="past" className="pb-4 text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em]">
              Past sessions
            </h2>
            {past.map((s) => (
              <SessionRow key={s.slug} s={s} past />
            ))}
          </section>
        )}

        {/* Closing note: where access lives */}
        <div className="mb-24 mt-10 border-t-2 border-black pt-10 sm:mb-32">
          <p className="max-w-xl text-base leading-relaxed">
            GOOD SESSIONS are included with a paid GOOD THINKING membership.{" "}
            <a href={SUBSTACK} className="font-bold underline decoration-2 underline-offset-4">
              Become a member
            </a>
          </p>
        </div>
      </main>
      <SpeakingFooter />
    </div>
  );
}
