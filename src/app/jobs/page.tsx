"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Job } from "@/lib/types";
import JobCard from "@/components/JobCard";
import AskCard from "@/components/AskCard";
import FilterBar, { Filters } from "@/components/FilterBar";
import { ASK_TYPES, AskType, MARKETPLACE_TYPES, MarketplaceType, paramForType, typeFromParam } from "@/lib/marketplace";

const EMPTY: Filters = { department: "", locationType: "", roleLevel: "", search: "" };

const INTRO: Record<MarketplaceType, string> = {
  job: "Brand, marketing and more. Across every category.",
  project: "Freelance, contract, interim and project-based work.",
  ask: "Sponsors, speakers, partners, venues, collaborators, intros.",
};

function Board() {
  const router = useRouter();
  const params = useSearchParams();
  const type = typeFromParam(params.get("type"));

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [askType, setAskType] = useState<AskType | "">("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data) => { setJobs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const setType = (t: MarketplaceType) => {
    setFilters(EMPTY);
    setAskType("");
    router.replace(t === "job" ? "/jobs" : `/jobs?type=${paramForType(t)}`, { scroll: false });
  };

  const ofType = jobs.filter((j) => (j.marketplaceType || "job") === type);
  const filtered = ofType.filter((job) => {
    if (type === "ask") {
      if (askType && job.askType !== askType) return false;
    } else {
      if (filters.department && job.department !== filters.department) return false;
      if (filters.roleLevel && job.roleLevel !== filters.roleLevel) return false;
    }
    if (filters.locationType && job.locationType !== filters.locationType) return false;
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
  const counts = Object.fromEntries(
    MARKETPLACE_TYPES.map((m) => [m.type, jobs.filter((j) => (j.marketplaceType || "job") === m.type).length])
  ) as Record<MarketplaceType, number>;
  const noun = MARKETPLACE_TYPES.find((m) => m.type === type)!.noun;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10 sm:pt-24 sm:pb-12">
          {/* One board, three kinds of listing */}
          <nav aria-label="Listing type" className="flex flex-wrap items-end gap-x-6 gap-y-2 mb-8">
            {MARKETPLACE_TYPES.map((m) => {
              const active = m.type === type;
              return (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setType(m.type)}
                  aria-current={active ? "page" : undefined}
                  className={`font-display uppercase font-bold leading-[0.9] tracking-tight text-5xl sm:text-7xl lg:text-8xl transition-colors ${
                    active ? "text-white" : "text-muted/50 hover:text-muted"
                  }`}
                >
                  {m.label}
                  {!loading && <sup className="text-base sm:text-xl align-super ml-1 font-headline">{counts[m.type]}</sup>}
                </button>
              );
            })}
          </nav>
          <p className="text-lg sm:text-xl text-white max-w-2xl font-secondary leading-relaxed mb-8">
            {INTRO[type]} The best of it goes to 17,000+ inboxes every Sunday.{" "}
            <a
              href="https://ingoodco.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-bold underline underline-offset-2 hover:brightness-125 transition-all"
            >
              Subscribe
            </a>
          </p>
          <Link
            href={`/post?type=${paramForType(type)}`}
            className="inline-block bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-6 py-3 hover:brightness-110 transition-all"
          >
            + Post something
          </Link>

          {/* Category quick-filters: departments for jobs/projects, one ask type for asks */}
          {!loading && (
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted mt-10">
              {type === "ask"
                ? ASK_TYPES.filter((a) => ofType.some((j) => j.askType === a.type)).map((a) => (
                    <button
                      key={a.type}
                      onClick={() => setAskType((cur) => (cur === a.type ? "" : a.type))}
                      className={`uppercase tracking-wider hover:text-white transition-colors ${askType === a.type ? "text-accent" : ""}`}
                    >
                      {a.label} <sup className="text-xs">{ofType.filter((j) => j.askType === a.type).length}</sup>
                    </button>
                  ))
                : Array.from(new Set(ofType.map((j) => j.department))).map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setFilters((f) => ({ ...f, department: f.department === dept ? "" : dept }))}
                      className={`hover:text-white transition-colors ${filters.department === dept ? "text-accent" : ""}`}
                    >
                      {dept} <sup className="text-xs">{ofType.filter((j) => j.department === dept).length}</sup>
                    </button>
                  ))}
            </div>
          )}
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {loading ? (
          <div className="text-center py-20 text-muted text-sm uppercase tracking-widest">Loading...</div>
        ) : (
          <>
            {type !== "ask" && <FilterBar filters={filters} onChange={setFilters} jobCount={filtered.length} />}
            {ofType.length === 0 ? (
              <div className="text-center py-20 text-muted">
                <p className="text-lg mb-3">No {noun}s on the board yet.</p>
                <Link href={`/post?type=${paramForType(type)}`} className="text-accent underline underline-offset-2 text-sm">
                  Be the first: post {noun === "ask" ? "an ask" : `a ${noun}`}
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-muted">
                <p className="text-lg mb-3">Nothing matches your filters.</p>
                <button
                  onClick={() => { setFilters(EMPTY); setAskType(""); }}
                  className="text-accent underline underline-offset-2 text-sm"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((job) => (type === "ask" ? <AskCard key={job.id} job={job} /> : <JobCard key={job.id} job={job} />))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-muted text-sm uppercase tracking-widest">Loading...</div>}>
      <Board />
    </Suspense>
  );
}
