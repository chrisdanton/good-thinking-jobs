"use client";

import { usePathname } from "next/navigation";

// Universal top bar (tier 1): switches between the GOOD THINKING surfaces.
// Logo left, nav centered, no per-section CTA (so it reads the same on every
// section). Rendered site-wide via the root layout; an equivalent static
// version is injected into the /futures pages.
const LINKS = [
  { label: "Job Board", href: "/jobs", match: "/jobs" },
  { label: "Good Future ’26", href: "/futures", match: "/futures" },
  { label: "Speaking", href: "/speaking", match: "/speaking" },
];

export default function GlobalBar() {
  const pathname = usePathname() || "/";

  return (
    <div className="w-full bg-black border-b border-white/10 text-white">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12 py-2.5">
        <a
          href="https://getgoodthinking.com/"
          className="justify-self-start shrink-0"
          aria-label="GOOD THINKING home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="GOOD THINKING" className="h-5 w-auto" />
        </a>
        <nav className="hidden sm:flex justify-self-center items-center gap-6 text-[11px] uppercase tracking-[0.14em]">
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
      </div>
    </div>
  );
}
