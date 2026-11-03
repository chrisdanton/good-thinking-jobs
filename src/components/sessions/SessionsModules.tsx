// Small, reusable GOOD TALKS modules. Not placed anywhere yet: drop
// <SessionsNextUp /> or <SessionsBenefit /> into any page when we decide where.
import { dayLabel, monthLabel, nextSession } from "@/lib/sessions";

// Homepage module: "GOOD TALKS / Next up: ... Nov 19 / See all talks"
export function SessionsNextUp() {
  const s = nextSession();
  return (
    <div className="border-t-2 border-black py-8" style={{ color: "#000" }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.3em]">GOOD TALKS</p>
      {s ? (
        <p className="mt-3 text-xl sm:text-2xl leading-snug">
          <span className="font-bold">Next up:</span> {s.title}{" "}
          <span className="whitespace-nowrap font-bold">
            {s.tba || `${monthLabel(s)} ${dayLabel(s)}`}
          </span>
        </p>
      ) : (
        <p className="mt-3 text-xl sm:text-2xl leading-snug">Live conversations and briefings for paid members.</p>
      )}
      <a
        href="/talks"
        className="mt-5 inline-block text-sm font-bold uppercase tracking-wide underline decoration-2 underline-offset-4"
      >
        See all talks →
      </a>
    </div>
  );
}

// Paid-membership benefit line.
export function SessionsBenefit() {
  return (
    <div style={{ color: "#000" }}>
      <p className="font-bold uppercase tracking-wide">GOOD TALKS</p>
      <p className="mt-1 leading-relaxed">
        Live conversations, briefings and an expanding archive of edited sessions.{" "}
        <a href="/talks" className="underline underline-offset-4">See the calendar</a>
      </p>
    </div>
  );
}
