import Link from "next/link";
import { Job } from "@/lib/types";
import FeaturedBadge from "./FeaturedBadge";

function formatSalary(min: number, max: number): string {
  if (!min && !max) return "Salary not listed";
  const fmt = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;
  // Postings often give only one end of the range. Show that number on its own
  // rather than pairing it with a "$0K" that reads as broken.
  if (!max) return `From ${fmt(min)}`;
  if (!min) return `Up to ${fmt(max)}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

export default function JobCard({ job }: { job: Job }) {
  const isPremium = job.tier === "premium";
  const isSample = job.id.startsWith("sample-");

  const teaser =
    job.description.split(/[.\n]/)[0].slice(0, 120) +
    (job.description.length > 120 ? "..." : ".");

  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <div
        className={`relative border rounded-sm p-6 transition-all h-full flex flex-col overflow-visible ${
          isPremium
            ? "border-accent bg-accent/[0.03]"
            : "border-white/20 hover:border-white/40"
        }`}
      >
        {/* Featured badge - overlapping top right */}
        {isPremium && (
          <div className="absolute -top-8 -right-5 z-10">
            <FeaturedBadge size={90} />
          </div>
        )}

        {/* Sample badge */}
        {isSample && (
          <span className="inline-block self-start mb-3 text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-current text-muted">
            Sample listing
          </span>
        )}

        {/* Type + Location */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold tracking-tight leading-tight font-display uppercase">
            {job.roleLevel === "C-Suite" || job.roleLevel === "VP"
              ? job.roleLevel
              : job.department}
          </h3>
          <p className="text-sm text-muted mt-0.5">
            {job.location} / {job.locationType}
          </p>
        </div>

        {/* Company */}
        <p className="text-base font-bold mb-2 font-headline">{job.companyName}</p>

        {/* Teaser */}
        <p className="text-sm text-muted leading-relaxed mb-4 flex-1 font-secondary">
          {job.companyName} is searching for a {job.title.toLowerCase()}.{" "}
          {teaser}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-sm font-medium font-headline">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
          <span className="text-sm font-headline underline underline-offset-2 decoration-[#07FCFB] group-hover:decoration-2 transition-all">
            More Info
          </span>
        </div>
      </div>
    </Link>
  );
}
