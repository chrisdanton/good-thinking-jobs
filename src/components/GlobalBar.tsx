"use client";

import { usePathname } from "next/navigation";

// Universal top bar (tier 1), styled to match the GOOD FUTURE header:
// section switcher on the left, GOOD THINKING logo centered, "BY IN GOOD CO"
// on the right. Sticky so it stays pinned on scroll (standard for primary nav).
// Rendered site-wide via the root layout; an equivalent static version is
// injected into the /futures pages (which already carry the centered logo).
const LINKS = [
  { label: "Job Board", href: "/jobs", match: "/jobs" },
  { label: "Good Future ’26", href: "/futures", match: "/futures" },
  { label: "Speaking", href: "/speaking", match: "/speaking" },
];

export default function GlobalBar() {
  const pathname = usePathname() || "/";

  return (
    <div className="sticky top-0 z-50 w-full bg-black border-b border-white/10 text-white">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12 py-2.5">
        <nav className="hidden sm:flex justify-self-start items-center gap-6 text-[11px] uppercase tracking-[0.14em]">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.match);
            return (
              <a
                key={l.href}
                href={l.href}
                className={active ? "text-[#F9FF00]" : "text-[#9a9a9a] hover:text-[#fff] transition-colors"}
              >
                {l.label}
              </a>
            );
          })}
        </nav>
        <a
          href="https://getgoodthinking.com/"
          className="justify-self-center col-start-2"
          aria-label="GOOD THINKING home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="GOOD THINKING" className="h-5 w-auto" />
        </a>
        <a
          href="https://weareingoodco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex justify-self-end items-center gap-2 col-start-3"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#7a7a7a]">By</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/igc-logo.svg" alt="IN GOOD CO" className="h-3.5 w-auto" />
        </a>
      </div>
    </div>
  );
}
