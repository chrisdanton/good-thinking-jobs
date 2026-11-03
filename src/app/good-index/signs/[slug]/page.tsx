import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndexShell, Timeline } from "@/components/good-index/ui";
import { SIGNS, getSign, relatedTo } from "@/lib/good-index/search";

// Re-check related passages daily (picks up new letters once the archive is connected).
export const revalidate = 86400;

export function generateStaticParams() {
  return SIGNS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getSign(params.slug);
  return { title: s ? `${s.name} · GOOD SIGNS` : "GOOD SIGNS" };
}

export default async function SignPage({ params }: { params: { slug: string } }) {
  const sign = getSign(params.slug);
  if (!sign) notFound();
  const { before, after } = await relatedTo(sign);
  return (
    <IndexShell>
      <a href="/index/signs" className="text-[11px] font-bold uppercase tracking-[0.3em]">GOOD INDEX · GOOD SIGNS</a>
      <div className="mt-4">
        <Timeline anchor={sign} kind="GOOD SIGN" before={before} after={after} />
      </div>
    </IndexShell>
  );
}
