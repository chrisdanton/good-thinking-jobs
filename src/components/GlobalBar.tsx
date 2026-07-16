"use client";

import { usePathname } from "next/navigation";

// Universal header (tier 1), mirroring the GOOD FUTURE header structure:
//   row 1 — section switcher
//   row 2 — the larger GOOD THINKING logo (centered) + BY IN GOOD CO (right)
// Sticky so it stays pinned on scroll. Rendered site-wide via the root layout;
// the /futures pages already carry this structure natively (their own header +
// an injected switcher strip), so this keeps jobs/speaking consistent with it.
const LINKS = [
  { label: "Job Board", href: "/jobs", match: "/jobs" },
  { label: "Good Future ’26", href: "/futures", match: "/futures" },
  { label: "Speaking", href: "/speaking", match: "/speaking" },
];

export default function GlobalBar() {
  const pathname = usePathname() || "/";

  return (
    <div className="sticky top-0 z-50 w-full bg-black text-white">
      {/* Row 1: section switcher */}
      <div className="hidden sm:block border-b border-white/10 px-5 sm:px-8 lg:px-12 py-2">
        <nav className="flex items-center gap-6 text-[11px] uppercase tracking-[0.14em]">
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
      </div>

      {/* Row 2: logo + IN GOOD CO */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-white/10 px-5 sm:px-8 lg:px-12 py-3.5">
        <span aria-hidden />
        <a
          href="https://getgoodthinking.com/"
          className="justify-self-center"
          aria-label="GOOD THINKING home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="GOOD THINKING" className="h-8 w-auto" />
        </a>
        <a
          href="https://weareingoodco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex justify-self-end items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#7a7a7a]">By</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/igc-logo.svg" alt="IN GOOD CO" className="h-4 w-auto" />
        </a>
      </div>
    </div>
  );
}
