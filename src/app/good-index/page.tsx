import type { Metadata } from "next";
import { BigLink, IndexShell, PassageList, SearchField } from "@/components/good-index/ui";
import { FUTURE_YEARS, searchArchive } from "@/lib/good-index/search";

export const metadata: Metadata = {
  title: "GOOD INDEX · GOOD THINKING",
  description: "Search every GOOD THINKING letter by brand, idea, person, behavior, or half-remembered thought.",
};

export default async function GoodIndexHome({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || "").trim().slice(0, 200);
  const results = q ? await searchArchive(q) : [];

  if (q) {
    return (
      <IndexShell>
        <a href="/index" className="text-[11px] font-bold uppercase tracking-[0.3em]">GOOD INDEX</a>
        <div className="mt-8">
          <SearchField q={q} />
        </div>
        <div className="mt-4">
          {results.length ? (
            <PassageList items={results} />
          ) : (
            <p className="py-16 font-headline text-2xl font-bold sm:text-3xl">
              Nothing yet. Try a brand, a person, or one word from the idea.
            </p>
          )}
        </div>
      </IndexShell>
    );
  }

  return (
    <IndexShell>
      <p className="text-[11px] font-bold uppercase tracking-[0.3em]">GOOD INDEX</p>
      <h1 className="speaking-display mt-6 text-[17vw] sm:text-[7.5rem]" style={{ lineHeight: 0.84 }}>
        Find the thing you vaguely remember.
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-relaxed sm:text-xl">
        Search every GOOD THINKING letter by brand, idea, person, behavior, or half-remembered thought.
      </p>
      <div className="mt-12">
        <SearchField big />
      </div>

      <div className="mt-24 space-y-12 sm:mt-32">
        <BigLink href="/index/signs">GOOD SIGNS →</BigLink>
        <div>
          <p className="speaking-display text-5xl sm:text-7xl">GOOD FUTURE</p>
          <div className="mt-2">
            {FUTURE_YEARS.map((y) =>
              y.live ? (
                <BigLink key={y.year} href={`/index/future/${y.year}`}>{y.year} →</BigLink>
              ) : (
                <BigLink key={y.year}>{y.year} · Coming soon</BigLink>
              )
            )}
          </div>
        </div>
      </div>
    </IndexShell>
  );
}
