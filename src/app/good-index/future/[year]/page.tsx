import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndexShell } from "@/components/good-index/ui";
import { FUTURE } from "@/lib/good-index/search";

export function generateStaticParams() {
  return Object.keys(FUTURE).map((year) => ({ year }));
}

export function generateMetadata({ params }: { params: { year: string } }): Metadata {
  return { title: `GOOD FUTURE ${params.year} · GOOD INDEX` };
}

export default function FutureYearPage({ params }: { params: { year: string } }) {
  const preds = FUTURE[params.year];
  if (!preds) notFound();
  return (
    <IndexShell>
      <a href="/index" className="text-[11px] font-bold uppercase tracking-[0.3em]">GOOD INDEX</a>
      <h1 className="speaking-display mt-6 text-7xl sm:text-9xl">
        GOOD FUTURE<br />{params.year}
      </h1>
      <ul className="mt-12">
        {preds.map((p, i) => (
          <li key={p.slug} style={i ? { borderTop: "2px solid #000" } : undefined}>
            <a href={`/index/future/${params.year}/${p.slug}`} className="block py-6 hover:opacity-70">
              <span className="block text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#777" }}>{p.category}</span>
              <span className="speaking-display mt-2 block text-4xl sm:text-6xl">{p.name} →</span>
            </a>
          </li>
        ))}
      </ul>
    </IndexShell>
  );
}
