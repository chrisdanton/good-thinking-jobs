// GOOD INDEX building blocks. The writing is the interface: big original passages,
// one rule between them, yellow only for an authored anchor (a GOOD SIGN or GOOD FUTURE).
import type { ReactNode } from "react";
import type { Anchor, Passage } from "@/lib/good-index/search";
import { formatDate } from "@/lib/good-index/search";

export const Y = "#F9FF00";

export function IndexShell({ children }: { children: ReactNode }) {
  return (
    <div className="speaking-root min-h-screen overflow-x-hidden" style={{ background: "#FAFAF8", color: "#000" }}>
      <main className="mx-auto max-w-4xl px-5 pb-28 pt-10 sm:px-10 sm:pt-14">{children}</main>
    </div>
  );
}

// Small wordmark that links back to the GOOD INDEX home.
export function IndexMark() {
  return (
    <a href="/index" className="text-[11px] font-bold uppercase tracking-[0.3em]">
      GOOD INDEX
    </a>
  );
}

export function SearchField({ q = "", big = false }: { q?: string; big?: boolean }) {
  return (
    <form action="/index" method="get" role="search">
      <label htmlFor="gi-q" className="sr-only">
        Search the GOOD THINKING archive
      </label>
      <div className="flex items-end gap-4" style={{ borderBottom: "3px solid #000" }}>
        <input
          id="gi-q"
          name="q"
          defaultValue={q}
          placeholder="Try B2B, Erewhon, loneliness…"
          autoComplete="off"
          className={`min-w-0 flex-1 bg-transparent pb-3 font-headline font-bold tracking-tight outline-none placeholder:text-[#b5b5b0] ${
            big ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl"
          }`}
          style={{ color: "#000", border: 0, borderRadius: 0 }}
        />
        <button type="submit" aria-label="Search" className="pb-3 text-2xl font-bold sm:text-3xl" style={{ color: "#000" }}>
          →
        </button>
      </div>
    </form>
  );
}

export function PassageView({ p }: { p: Passage }) {
  return (
    <article className="py-12 sm:py-16">
      <blockquote className="font-headline text-[1.6rem] font-bold leading-[1.18] tracking-tight sm:text-[2.35rem]">
        {p.text}
      </blockquote>
      <p className="mt-6 text-sm sm:text-[15px]">
        <span className="font-bold">{p.title}</span>
        <span style={{ color: "#777" }}> · {formatDate(p.date)}</span>
      </p>
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-bold underline decoration-2 underline-offset-4"
      >
        Read in letter →
      </a>
    </article>
  );
}

// One clear divider between results, nothing else.
export function PassageList({ items }: { items: Passage[] }) {
  return (
    <div>
      {items.map((p, i) => (
        <div key={p.id} style={i ? { borderTop: "2px solid #000" } : undefined}>
          <PassageView p={p} />
        </div>
      ))}
    </div>
  );
}

// The authored anchor: yellow label + the original passage.
export function AnchorView({ a, kind }: { a: Anchor; kind: "GOOD SIGN" | "GOOD FUTURE" }) {
  return (
    <article className="py-12 sm:py-16">
      <p className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ background: Y }}>
        {kind} · {formatDate(a.date)}
      </p>
      <h2 className="speaking-display mt-5 text-5xl sm:text-7xl">{a.name}</h2>
      <blockquote
        className="mt-6 pl-5 font-headline text-[1.6rem] font-bold leading-[1.18] tracking-tight sm:pl-7 sm:text-[2.35rem]"
        style={{ borderLeft: `8px solid ${Y}` }}
      >
        {a.text}
      </blockquote>
      <a
        href={a.url}
        target={a.url.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="mt-6 inline-block text-sm font-bold underline decoration-2 underline-offset-4"
      >
        {kind === "GOOD SIGN" ? "Read the episode →" : "Read the prediction →"}
      </a>
    </article>
  );
}

// Anchor in its place in time: what came before, the anchor, what came after.
export function Timeline({ anchor, kind, before, after }: { anchor: Anchor; kind: "GOOD SIGN" | "GOOD FUTURE"; before: Passage[]; after: Passage[] }) {
  return (
    <div>
      <PassageList items={before} />
      <div style={before.length ? { borderTop: "2px solid #000" } : undefined}>
        <AnchorView a={anchor} kind={kind} />
      </div>
      {after.length > 0 && (
        <div style={{ borderTop: "2px solid #000" }}>
          <PassageList items={after} />
        </div>
      )}
    </div>
  );
}

// Big editorial link used for the browse routes and lists.
export function BigLink({ href, children, sub }: { href?: string; children: ReactNode; sub?: ReactNode }) {
  const inner = (
    <>
      <span className="speaking-display text-5xl sm:text-7xl">{children}</span>
      {sub && <span className="mt-2 block text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "#777" }}>{sub}</span>}
    </>
  );
  return href ? (
    <a href={href} className="block py-3 hover:opacity-70">
      {inner}
    </a>
  ) : (
    <div className="block py-3" style={{ color: "#9a9a95" }}>
      {inner}
    </div>
  );
}
