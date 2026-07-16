"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="w-8 h-8 flex items-center justify-center text-muted hover:text-white transition-colors"
    >
      {isDark ? (
        // Sun icon (switch to light)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        // Moon icon (switch to dark)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();

  // The GOOD FUTURE section has its own header/nav and dark chrome.
  if (pathname?.startsWith("/futures")) return null;
  if (pathname?.startsWith("/speaking")) return null;

  return (
    <header className="border-b border-white/10 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Left nav */}
        <nav className="flex items-center gap-6">
          <Link
            href="/jobs"
            className={`text-sm uppercase tracking-widest font-medium font-headline transition-colors ${
              pathname === "/jobs" ? "text-white" : "text-muted hover:text-white"
            }`}
          >
            Jobs
          </Link>
          <Link
            href="/post"
            className={`text-sm uppercase tracking-widest font-medium font-headline transition-colors ${
              pathname === "/post" ? "text-white" : "text-muted hover:text-white"
            }`}
          >
            Post a Job
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="https://ingoodco.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-black text-xs uppercase tracking-normal font-bold font-headline leading-none px-5 py-2.5 hover:brightness-110 transition-all hidden sm:inline-flex items-center justify-center"
          >
            Subscribe
          </a>
        </div>
      </div>
    </header>
  );
}
