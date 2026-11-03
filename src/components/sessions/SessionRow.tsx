// One GOOD SESSION as a row in a programming-calendar list: a big date on the
// left, title and details on the right. Used for both Upcoming and Past.
import type { Session } from "@/lib/sessions";
import {
  dayLabel,
  googleCalUrl,
  icsPath,
  monthLabel,
  outlookCalUrl,
  timeLabel,
  yearLabel,
} from "@/lib/sessions";

const YELLOW = "#F9FF00";

export default function SessionRow({ s, past = false }: { s: Session; past?: boolean }) {
  const meta = [s.guest, s.duration ? `${s.duration} minutes` : "", past ? "" : timeLabel(s)].filter(Boolean);
  const href = past ? s.replayUrl || s.accessUrl : s.accessUrl;

  return (
    <article className="grid grid-cols-[4.5rem_1fr] gap-x-5 border-t-2 border-black py-10 sm:grid-cols-[8rem_1fr] sm:gap-x-10 sm:py-14 md:grid-cols-[8rem_1fr_14rem]">
      {/* Date */}
      <div className="leading-none">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em]">{monthLabel(s)}</p>
        <p className={`speaking-display mt-1 ${past ? "text-5xl sm:text-7xl" : "text-6xl sm:text-8xl"}`}>{dayLabel(s)}</p>
        {past && <p className="mt-2 text-xs font-bold tracking-[0.2em]">{yearLabel(s)}</p>}
      </div>

      {/* Details */}
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em]">
          <span className="px-1.5 py-0.5" style={past ? undefined : { background: YELLOW }}>
            Paid member session
          </span>
        </p>
        <h3 className={`speaking-display mt-4 break-words ${past ? "text-3xl sm:text-4xl" : "text-[2.1rem] sm:text-5xl"}`}>
          {s.title}
        </h3>
        <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed">{s.description}</p>
        {meta.length > 0 && (
          <p className="mt-3 text-sm font-semibold" style={{ color: "#555" }}>
            {meta.join(" · ")}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-[1.5px] border-black px-6 py-3 text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-0.5"
              style={past ? { background: "transparent", color: "#000" } : { background: "#000", color: "#fff" }}
            >
              {past ? "Watch session" : "Access session"}
            </a>
          )}
          {!past && (
            <details className="group text-sm">
              <summary className="cursor-pointer list-none font-bold uppercase tracking-wide underline decoration-2 underline-offset-4">
                Add to calendar
              </summary>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-semibold">
                <a href={googleCalUrl(s)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Google</a>
                <a href={icsPath(s)} className="underline underline-offset-4">Apple</a>
                <a href={outlookCalUrl(s)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Outlook</a>
              </div>
            </details>
          )}
        </div>
      </div>

      {/* Optional image: hidden on phones so rows stay short */}
      {s.image && (
        <div className="hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.image} alt="" className="aspect-[4/5] w-full border-[1.5px] border-black object-cover" />
        </div>
      )}
    </article>
  );
}
