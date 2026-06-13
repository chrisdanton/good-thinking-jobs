import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-xs uppercase tracking-widest text-muted font-headline">
          A project by{" "}
          <a
            href="https://weareingoodco.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold hover:text-accent transition-colors"
          >
            IN GOOD CO
          </a>
        </div>
        <div className="flex gap-6 text-xs uppercase tracking-widest text-muted font-headline">
          <Link href="/jobs" className="hover:text-white transition-colors">
            Jobs
          </Link>
          <Link href="/post" className="hover:text-white transition-colors">
            Post a Job
          </Link>
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
