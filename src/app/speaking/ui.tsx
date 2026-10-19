// Shared visual pieces for the speaking page and press kit: the pinned,
// slightly tilted "bulletin board" cards and photos, the local nav, and footer.
import type { CSSProperties, ReactNode } from "react";
import { BOOKING_MAILTO, C } from "./data";

export const HARD_SHADOW = "8px 8px 0 0 #000";
export const HARD_SHADOW_SM = "5px 5px 0 0 #000";

export function Pin({ color = C.yellow }: { color?: string }) {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-2.5 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-black"
      style={{ background: color, borderRadius: 9999, boxShadow: "2px 3px 0 rgba(0,0,0,0.35)" }}
    />
  );
}

// A photo in a white frame, pinned to the board at a slight angle.
export function PinnedPhoto({
  src,
  alt,
  tilt = 0,
  pin = C.yellow,
  className = "",
  imgClassName = "aspect-[4/5] object-cover",
}: {
  src: string;
  alt: string;
  tilt?: number;
  pin?: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <Pin color={pin} />
      <figure className="border-2 border-black p-3 pb-8" style={{ background: C.white, boxShadow: HARD_SHADOW }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={`w-full ${imgClassName}`} />
      </figure>
    </div>
  );
}

// A pinned card. `bg` and `fg` set the card colors.
export function PinnedCard({
  children,
  tilt = 0,
  bg = C.white,
  fg = C.black,
  pin = C.yellow,
  className = "",
}: {
  children: ReactNode;
  tilt?: number;
  bg?: string;
  fg?: string;
  pin?: string;
  className?: string;
}) {
  const style: CSSProperties = {
    transform: `rotate(${tilt}deg)`,
    background: bg,
    color: fg,
    boxShadow: HARD_SHADOW_SM,
  };
  return (
    <div
      className={`relative border-2 border-black p-6 pt-9 transition-transform duration-200 hover:-translate-y-1 ${className}`}
      style={style}
    >
      <Pin color={pin} />
      {children}
    </div>
  );
}

export function Eyebrow({ children, color = C.black }: { children: ReactNode; color?: string }) {
  return (
    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em]" style={{ color }}>
      {children}
    </p>
  );
}

// Primary (filled) and secondary (outline) buttons, sharp corners like the rest of GOOD THINKING.
export function Btn({
  href,
  children,
  variant = "solid",
  dark = false,
  download,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  dark?: boolean; // true when the button sits on a black section
  download?: boolean;
  external?: boolean;
}) {
  const ink = dark ? C.white : C.black;
  const style: CSSProperties =
    variant === "solid"
      ? dark
        ? { background: C.yellow, color: C.black, borderColor: C.yellow }
        : { background: C.black, color: C.white, borderColor: C.black }
      : { background: "transparent", color: ink, borderColor: ink };
  return (
    <a
      href={href}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-block border-2 px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-0.5"
      style={style}
    >
      {children}
    </a>
  );
}

const NAV = [
  { label: "Talks", href: "/speaking#talks" },
  { label: "Speakers", href: "/speaking#speakers" },
  { label: "On Stage", href: "/speaking#stages" },
  { label: "Dinners", href: "/speaking#dinners" },
  { label: "Press Kit", href: "/speaking/press-kit" },
];

export function SpeakingNav({ active }: { active?: "press" }) {
  return (
    <div className="speaking-noprint border-b-2 border-black" style={{ background: C.cream, color: C.black }}>
      {/* Same side padding as the GlobalBar above, so BOOK US lines up with its IN GOOD CO logo. */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-3 sm:px-8 lg:px-12">
        <span aria-hidden="true" />
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="underline-offset-[6px] decoration-2 hover:underline"
              style={active === "press" && n.label === "Press Kit" ? { textDecoration: "underline" } : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href={BOOKING_MAILTO}
          className="justify-self-end border-2 border-black px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wide"
          style={{ background: C.yellow, color: C.black }}
        >
          Book us
        </a>
      </div>
    </div>
  );
}

export function SpeakingFooter() {
  return (
    <footer className="speaking-noprint" style={{ background: C.black, color: C.white }}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="GOOD THINKING" className="h-6 w-auto" />
          <span className="text-xs uppercase tracking-widest" style={{ color: "#888" }}>by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/speaking/igc-logo.svg" alt="IN GOOD CO" className="h-4 w-auto" />
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-xs uppercase tracking-widest" style={{ color: "#aaa" }}>
          <a href="/jobs" className="hover:opacity-70">Jobs</a>
          <a href="/futures" className="hover:opacity-70">Good Future</a>
          <a href="/speaking/press-kit" className="hover:opacity-70">Press Kit</a>
          <a href="https://ingoodco.substack.com" className="hover:opacity-70">Substack</a>
          <a href={BOOKING_MAILTO} className="hover:opacity-70">Contact</a>
        </nav>
        <span className="text-xs" style={{ color: "#777" }}>© {new Date().getFullYear()} IN GOOD CO</span>
      </div>
    </footer>
  );
}
