"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Job } from "@/lib/types";
import JobCard from "@/components/JobCard";
import FilterBar, { Filters } from "@/components/FilterBar";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    department: "",
    locationType: "",
    roleLevel: "",
    search: "",
  });

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data) => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((job) => {
    if (filters.department && job.department !== filters.department) return false;
    if (filters.locationType && job.locationType !== filters.locationType) return false;
    if (filters.roleLevel && job.roleLevel !== filters.roleLevel) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold uppercase leading-[0.9] tracking-tight mb-6 font-display text-white">
            Job Board
          </h1>
          <p className="text-lg sm:text-xl text-white max-w-2xl font-secondary leading-relaxed mb-8">
            Brand, marketing and more. Across every category.{" "}
            <Link href="/post" className="text-accent font-bold underline underline-offset-2 hover:brightness-125 transition-all">
              Post a job
            </Link>{" "}
            and we send it to 17,000+ inboxes every Sunday.{" "}
            <a
              href="https://ingoodco.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-bold underline underline-offset-2 hover:brightness-125 transition-all"
            >
              Subscribe
            </a>
            !
          </p>
          {/* Category counts */}
          {!loading && (
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted">
              {Array.from(new Set(jobs.map((j) => j.department))).map((dept) => {
                const count = jobs.filter((j) => j.department === dept).length;
                return (
                  <button
                    key={dept}
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        department: f.department === dept ? "" : dept,
                      }))
                    }
                    className={`hover:text-white transition-colors ${
                      filters.department === dept ? "text-accent" : ""
                    }`}
                  >
                    {dept} <sup className="text-xs">{count}</sup>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Job Listings */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {loading ? (
          <div className="text-center py-20 text-muted text-sm uppercase tracking-widest">Loading...</div>
        ) : (
          <>
            <FilterBar filters={filters} onChange={setFilters} jobCount={filtered.length} />
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted">
                <p className="text-lg mb-3">No jobs match your filters.</p>
                <button
                  onClick={() => setFilters({ department: "", locationType: "", roleLevel: "", search: "" })}
                  className="text-accent underline underline-offset-2 text-sm"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
