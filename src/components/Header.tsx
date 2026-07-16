"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Sections with their own chrome, or where GlobalBar + page content already
  // cover navigation (the job board's Post a Job / Subscribe live in its hero).
  if (pathname?.startsWith("/futures")) return null;
  if (pathname?.startsWith("/speaking")) return null;
  if (pathname?.startsWith("/jobs")) return null;

  return (
    <header className="border-b border-white/10 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Left nav */}
        <nav className="flex items-center gap-6">
          <Link
            href="/jobs"
            className="text-sm uppercase tracking-widest font-medium font-headline text-muted hover:text-white transition-colors"
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
