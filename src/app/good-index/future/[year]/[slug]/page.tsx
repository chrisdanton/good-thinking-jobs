import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndexShell, Timeline } from "@/components/good-index/ui";
import { FUTURE, getPrediction, relatedTo } from "@/lib/good-index/search";

export function generateStaticParams() {
  return Object.entries(FUTURE).flatMap(([year, preds]) => preds.map((p) => ({ year, slug: p.slug })));
}

export function generateMetadata({ params }: { params: { year: string; slug: string } }): Metadata {
  const p = getPrediction(params.year, params.slug);
  return { title: p ? `${p.name} · GOOD FUTURE ${params.year}` : "GOOD FUTURE" };
}

export default async function PredictionPage({ params }: { params: { year: string; slug: string } }) {
  const pred = getPrediction(params.year, params.slug);
  if (!pred) notFound();
  const { before, after } = await relatedTo(pred);
  return (
    <IndexShell>
      <a href={`/index/future/${params.year}`} className="text-[11px] font-bold uppercase tracking-[0.3em]">
        GOOD INDEX · GOOD FUTURE {params.year}
      </a>
      <div className="mt-4">
        <Timeline anchor={pred} kind="GOOD FUTURE" before={before} after={after} />
      </div>
    </IndexShell>
  );
}
