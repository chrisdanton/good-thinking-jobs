import type { Metadata } from "next";
import { IndexShell } from "@/components/good-index/ui";
import { SIGNS, formatDate } from "@/lib/good-index/search";

export const metadata: Metadata = { title: "GOOD SIGNS · GOOD INDEX" };

export default function SignsPage() {
  const signs = [...SIGNS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <IndexShell>
      <a href="/index" className="text-[11px] font-bold uppercase tracking-[0.3em]">GOOD INDEX</a>
      <h1 className="speaking-display mt-6 text-7xl sm:text-9xl">GOOD SIGNS</h1>
      <ul className="mt-12">
        {signs.map((s, i) => (
          <li key={s.slug} style={i ? { borderTop: "2px solid #000" } : undefined}>
            <a href={`/index/signs/${s.slug}`} className="block py-6 hover:opacity-70">
              <span className="speaking-display block text-4xl sm:text-6xl">{s.name} →</span>
              <span className="mt-2 block text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#777" }}>
                {formatDate(s.date)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </IndexShell>
  );
}
