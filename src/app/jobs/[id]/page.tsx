"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FeaturedBadge from "@/components/FeaturedBadge";
import { Job } from "@/lib/types";

function formatSalary(min: number, max: number): string {
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}K`;
  return `${fmt(min)} – ${fmt(max)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function JobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { setJob(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20 text-center text-muted">Loading...</div>;
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h1 className="text-3xl font-bold uppercase font-display mb-4">Job not found</h1>
        <Link href="/jobs" className="text-accent underline underline-offset-2">Back to all jobs</Link>
      </div>
    );
  }

  const isPremium = job.tier === "premium";

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <Link href="/jobs" className="text-sm text-muted hover:text-white transition-colors mb-8 inline-block uppercase tracking-widest">
        &larr; All Jobs
      </Link>

      <div className="border-b border-white/10 pb-8 mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold uppercase font-display leading-[0.95] tracking-tight">
            {job.title}
          </h1>
          {isPremium && <FeaturedBadge size={72} />}
        </div>
        <p className="text-xl text-muted font-secondary mt-3">
          {job.companyName}
          {job.companyWebsite && (
            <> &middot;{" "}
              <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white transition-colors">
                Website
              </a>
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted">
          <span>{job.location}</span>
          <span className="text-white/20">/</span>
          <span>{job.locationType}</span>
          <span className="text-white/20">/</span>
          <span>{job.department}</span>
          <span className="text-white/20">/</span>
          <span>{job.roleLevel}</span>
          <span className="text-white/20">/</span>
          <span className="text-white font-medium">{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>
      </div>

      <div className="mb-10">
        {job.externalApplyUrl && (
          <a href={job.externalApplyUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-8 py-3 hover:bg-accent/90 transition-colors">
            Apply on Company Site
          </a>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">About the Role</h2>
        <div className="text-white/80 leading-relaxed whitespace-pre-line font-secondary text-[15px]">{job.description}</div>
      </div>

      <div className="mb-10">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">Requirements</h2>
        <div className="text-white/80 leading-relaxed whitespace-pre-line font-secondary text-[15px]">{job.requirements}</div>
      </div>

      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted">
        <div>Posted {formatDate(job.createdAt)} &middot; Expires {formatDate(job.expiresAt)}</div>
        <div>
          {job.externalApplyUrl && (
            <a href={job.externalApplyUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 font-medium">
              Apply on company site &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
