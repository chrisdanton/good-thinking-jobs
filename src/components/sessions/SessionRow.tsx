// GOOD SESSIONS listings, styled like a gig poster.
//   UpcomingTile: a big tilted color block with a huge date, the time in a black label.
//   PastRow:      a compact line in a dark listing, like a venue's weekly schedule.
import type { CSSProperties } from "react";
import type { Session } from "@/lib/sessions";
import {
  dayLabel,
  googleCalUrl,
  icsPath,
  monthLabel,
  outlookCalUrl,
  startDate,
  yearLabel,
} from "@/lib/sessions";
import { LocalTime } from "./TimeZone";

const Y = "#F9FF00";

const TILE_STYLES = [
  { bg: Y, fg: "#000", tilt: -1.25, dark: false },
  { bg: "#000", fg: "#fff", tilt: 1, dark: true },
  { bg: "#fff", fg: "#000", tilt: -0.75, dark: false },
];

function Chip({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className="inline-block px-2.5 py-1 text-[13px] sm:text-sm font-bold uppercase tracking-[0.12em]"
      style={dark ? { background: Y, color: "#000" } : { background: "#000", color: "#fff" }}
    >
      {children}
    </span>
  );
}

export function UpcomingTile({ s, index }: { s: Session; index: number }) {
  const st = TILE_STYLES[index % TILE_STYLES.length];
  const meta = [s.guest, s.duration ? `${s.duration} min` : ""].filter(Boolean).join(" · ");
  const btn: CSSProperties = st.dark
    ? { background: Y, color: "#000", borderColor: Y }
    : { background: "#000", color: "#fff", borderColor: "#000" };

  return (
    <article
      className="relative border-[1.5px] border-black p-6 sm:p-8"
      style={{ background: st.bg, color: st.fg, transform: `rotate(${st.tilt}deg)`, boxShadow: "6px 6px 0 0 #000" }}
    >
      <Chip dark={st.dark}>{s.tba ? "Date TBA" : monthLabel(s)}</Chip>

      <p className="speaking-display mt-9 text-[7.5rem] sm:text-[9rem]" style={{ lineHeight: 0.8 }}>
        {s.tba ? "TBA" : dayLabel(s)}
      </p>

      <div className="mt-8">
        {s.tba ? (
          <Chip dark={st.dark}>{s.tba}</Chip>
        ) : (
          s.time && (
            <Chip dark={st.dark}>
              <LocalTime iso={startDate(s).toISOString()} />
            </Chip>
          )
        )}
      </div>

      <h3 className="speaking-display mt-5 text-[2rem] sm:text-[2.5rem] break-words" style={{ lineHeight: 0.92 }}>
        {s.title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed">{s.description}</p>
      {meta && <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] opacity-70">{meta}</p>}
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em]">Paid GOOD THINKING member perk</p>

      {(s.accessUrl || (!s.tba && s.time)) && (
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          {!s.tba && s.time && (
            <details className="relative">
              <summary
                className="inline-block cursor-pointer list-none border-[1.5px] px-5 py-3 text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-0.5"
                style={btn}
              >
                + Add to calendar
              </summary>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                <a href={googleCalUrl(s)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Google</a>
                <a href={icsPath(s)} className="underline underline-offset-4">Apple</a>
                <a href={outlookCalUrl(s)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Outlook</a>
              </div>
            </details>
          )}
          {s.accessUrl && (
            <a
              href={s.accessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold uppercase tracking-wide underline decoration-2 underline-offset-4"
            >
              Join on Substack →
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export function PastRow({ s }: { s: Session }) {
  const href = s.replayUrl || s.accessUrl;
  const meta = [s.guest, s.duration ? `${s.duration} min` : ""].filter(Boolean).join(" · ");
  return (
    <article style={{ borderTop: "1px solid rgba(255,255,255,0.4)" }} className="grid grid-cols-[4.25rem_1fr] gap-x-4 py-6 sm:grid-cols-[6rem_11rem_1fr] sm:gap-x-8 sm:py-8">
      <div className="text-[11px] font-bold uppercase leading-snug tracking-[0.15em]">
        {monthLabel(s)} {dayLabel(s)}
        <br />
        <span style={{ color: "#888" }}>{yearLabel(s)}</span>
      </div>

      <div className="hidden sm:block">
        {s.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.image} alt="" className="aspect-video w-full object-cover" />
        )}
      </div>

      <div className="min-w-0">
        <h3 className="speaking-display text-2xl sm:text-4xl break-words" style={{ lineHeight: 0.92 }}>
          {s.title}
        </h3>
        <p className="mt-2 max-w-xl text-sm sm:text-[15px] leading-relaxed" style={{ color: "#cfcfcf" }}>
          {s.description}
        </p>
        {meta && (
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: "#888" }}>
            {meta}
          </p>
        )}
        <div className="mt-4">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em]"
              style={{ background: Y, color: "#000" }}
            >
              Watch on Substack →
            </a>
          ) : (
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#888" }}>
              Replay coming soon
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// Further-out upcoming sessions: one compact line each, so the page stays short.
export function LaterRow({ s }: { s: Session }) {
  return (
    <article
      style={{ borderTop: "2px solid #000" }}
      className="grid grid-cols-[4.25rem_1fr] items-baseline gap-x-4 py-5 sm:grid-cols-[6rem_1fr_auto] sm:gap-x-8"
    >
      <p className="leading-none">
        <span className="block text-[11px] font-bold uppercase tracking-[0.2em]">{s.tba ? "TBA" : monthLabel(s)}</span>
        <span className="speaking-display mt-1.5 block text-4xl sm:text-5xl">{s.tba ? "" : dayLabel(s)}</span>
      </p>
      <div className="min-w-0">
        <h3 className="speaking-display text-2xl sm:text-3xl break-words" style={{ lineHeight: 0.95 }}>
          {s.title}
        </h3>
        {s.time && !s.tba && (
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: "#555" }}>
            <LocalTime iso={startDate(s).toISOString()} />
          </p>
        )}
      </div>
      <div className="col-start-2 mt-3 flex gap-4 text-xs font-bold uppercase tracking-wide sm:col-start-3 sm:mt-0">
        {s.accessUrl && (
          <a href={s.accessUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-4">
            Access
          </a>
        )}
        {s.time && !s.tba && (
          <a href={googleCalUrl(s)} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-4">
            + Google
          </a>
        )}
        {s.time && !s.tba && (
          <a href={icsPath(s)} className="underline decoration-2 underline-offset-4">
            + Apple
          </a>
        )}
      </div>
    </article>
  );
}
