"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

// Universal header (tier 1): one compact row — section switcher (left),
// GOOD THINKING logo (centered), BY IN GOOD CO (right). Kept to a single row so
// it doesn't stack too heavily on pages that have their own sub-nav (the job
// board). Sticky/pinned on scroll. Rendered site-wide via the root layout; the
// /futures pages carry an equivalent injected switcher. On mobile the links
// collapse into a hamburger menu so you can still switch sections.
const LINKS = [
  { label: "Job Board", href: "/jobs", match: "/jobs" },
  { label: "Good Future ’26", href: "/futures", match: "/futures" },
  { label: "Speaking", href: "/speaking", match: "/speaking" },
];

export default function GlobalBar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full bg-black border-b border-white/10 text-white">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12 py-3">
        {/* Desktop section switcher */}
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

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ color: "#ffffff" }}
          className="sm:hidden justify-self-start flex items-center gap-2 px-2 py-1.5 text-[12px] uppercase tracking-[0.14em] font-bold -ml-1"
        >
          <span className="flex flex-col gap-[4px]">
            <span
              className={`block h-[2.5px] w-5 transition-transform ${open ? "translate-y-[6.5px] rotate-45" : ""}`}
              style={{ backgroundColor: "#ffffff" }}
            />
            <span
              className={`block h-[2.5px] w-5 transition-opacity ${open ? "opacity-0" : ""}`}
              style={{ backgroundColor: "#ffffff" }}
            />
            <span
              className={`block h-[2.5px] w-5 transition-transform ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`}
              style={{ backgroundColor: "#ffffff" }}
            />
          </span>
          {open ? "Close" : "Menu"}
        </button>

        <a
          href="https://getgoodthinking.com/"
          className="justify-self-center col-start-2"
          aria-label="GOOD THINKING home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="GOOD THINKING" className="h-6 w-auto" />
        </a>
        <div className="justify-self-end col-start-3 flex items-center gap-4">
          <ThemeToggle />
          <a
            href="https://weareingoodco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#7a7a7a]">By</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/igc-logo.svg" alt="IN GOOD CO" className="h-3.5 w-auto" />
          </a>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <nav className="sm:hidden border-t border-white/10 px-5 pb-3 pt-1 flex flex-col text-[13px] uppercase tracking-[0.14em]">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.match);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`py-3 border-b border-white/5 ${
                  active ? "text-[#F9FF00]" : "text-[#c8c8c8] hover:text-white transition-colors"
                }`}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href="https://weareingoodco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 text-[#7a7a7a] hover:text-white transition-colors"
          >
            By IN GOOD CO
          </a>
        </nav>
      )}
    </div>
  );
}
