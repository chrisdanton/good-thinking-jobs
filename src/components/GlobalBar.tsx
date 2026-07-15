"use client";

import { usePathname } from "next/navigation";

// Universal top bar (tier 1): switches between the GOOD THINKING surfaces.
// Sits above each section's own local nav. Rendered on every Next route via
// the root layout; an equivalent static version is injected into /futures.
const LINKS = [
  { label: "Job Board", href: "/jobs", match: "/jobs" },
  { label: "Good Future ’26", href: "/futures", match: "/futures" },
  { label: "Speaking", href: "/speaking", match: "/speaking" },
];

const BOOK_MAILTO =
  "mailto:hello@weareingoodco.com?subject=Speaking%20inquiry%20for%20GOOD%20THINKING";

export default function GlobalBar() {
  const pathname = usePathname() || "/";

  return (
    <div className="w-full bg-black border-b border-white/10 text-white">
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-2.5">
        <a href="https://getgoodthinking.com/" className="shrink-0" aria-label="GOOD THINKING home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="GOOD THINKING" className="h-5 w-auto" />
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-[11px] uppercase tracking-[0.14em]">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.match);
            return (
              <a
                key={l.href}
                href={l.href}
                className={active ? "text-accent" : "text-white/60 hover:text-white transition-colors"}
              >
                {l.label}
              </a>
            );
          })}
        </nav>
        <a
          href={BOOK_MAILTO}
          className="border border-accent text-accent text-[10px] sm:text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 leading-none hover:bg-accent hover:text-black transition-colors"
        >
          Book us
        </a>
      </div>
    </div>
  );
}
