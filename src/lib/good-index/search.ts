// GOOD INDEX retrieval. Server-only.
//
// Everything a reader sees is an original passage from the archive. This file only
// decides WHICH passages to show and in what order; it never writes or rewrites text.
//
// The letter passages are mostly from PAID letters, so they are never committed to the
// public repo. They load from src/data/good-index/passages.json when it exists (local,
// git-ignored), otherwise from a private Supabase Storage bucket (good-index/passages.json)
// read with the server's service key. With neither, searches return nothing.
//
// The search layer is swappable: `engine` below is a plain keyword (BM25) ranker over
// those passages. To connect a semantic/vector search later, write
// another object with the same `search()` shape and assign it to `engine`. Pages
// don't need to change.
import { promises as fs } from "fs";
import path from "path";
import signsJson from "@/data/good-index/signs.json";
import future2026Json from "@/data/good-index/future-2026.json";

export type Passage = { id: string; text: string; title: string; date: string; url: string };
export type Anchor = { slug: string; name: string; date: string; text: string; url: string; category?: string };

export interface ArchiveSearch {
  search(query: string, limit: number): Passage[];
}

let PASSAGES: Passage[] = [];
let _loaded: Promise<void> | null = null;

async function loadPassages(): Promise<void> {
  const local = path.join(process.cwd(), "src", "data", "good-index", "passages.json");
  try {
    PASSAGES = JSON.parse(await fs.readFile(local, "utf8"));
    return;
  } catch {}
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  try {
    const res = await fetch(`${url}/storage/v1/object/good-index/passages.json`, {
      headers: { Authorization: `Bearer ${key}`, apikey: key },
      next: { revalidate: 86400 },
    });
    if (res.ok) PASSAGES = await res.json();
  } catch {}
}

export function ready(): Promise<void> {
  if (!_loaded) _loaded = loadPassages().then(() => { _index = null; });
  return _loaded;
}
export const SIGNS = signsJson as Anchor[];
export const FUTURE: Record<string, Anchor[]> = { "2026": future2026Json as Anchor[] };
export const FUTURE_YEARS = [
  { year: "2026", live: true },
  { year: "2027", live: false },
];

// ── Keyword engine (BM25) ──
const STOP = new Set(
  "a an and are as at be but by for from has have i if in into is it its it's of on or our so that the their them there these they this to was we were what when which who will with you your not just more about all can do how its than then very really also been being one".split(
    " "
  )
);

function stem(w: string) {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

export function tokens(text: string): string[] {
  return (text.toLowerCase().normalize("NFKD").match(/[a-z0-9][a-z0-9'’-]*/g) || [])
    .map((w) => w.replace(/['’]s$/, "").replace(/['’]/g, ""))
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);
}

type Index = { tf: Map<string, number>[]; len: number[]; df: Map<string, number>; avg: number };
let _index: Index | null = null;

function index(): Index {
  if (_index) return _index;
  const tf: Map<string, number>[] = [];
  const len: number[] = [];
  const df = new Map<string, number>();
  for (const p of PASSAGES) {
    const m = new Map<string, number>();
    const t = tokens(p.text);
    for (const w of t) m.set(w, (m.get(w) || 0) + 1);
    for (const w of Array.from(m.keys())) df.set(w, (df.get(w) || 0) + 1);
    tf.push(m);
    len.push(t.length);
  }
  _index = { tf, len, df, avg: len.reduce((a, b) => a + b, 0) / Math.max(1, len.length) };
  return _index;
}

const keywordEngine: ArchiveSearch = {
  search(query, limit) {
    const q = tokens(query);
    if (!q.length) return [];
    const { tf, len, df, avg } = index();
    const N = PASSAGES.length;
    const phrase = query.trim().toLowerCase();
    const scored: { i: number; s: number }[] = [];
    for (let i = 0; i < N; i++) {
      let s = 0;
      let hits = 0;
      for (const w of q) {
        const f = tf[i].get(w);
        if (!f) continue;
        hits++;
        const idf = Math.log(1 + (N - (df.get(w) || 0) + 0.5) / ((df.get(w) || 0) + 0.5));
        s += idf * ((f * 2.2) / (f + 1.2 * (0.25 + 0.75 * (len[i] / avg))));
      }
      if (!s) continue;
      s *= 0.5 + hits / q.length; // reward passages that match more of the query
      if (phrase.length > 3 && PASSAGES[i].text.toLowerCase().includes(phrase)) s *= 2;
      scored.push({ i, s });
    }
    scored.sort((a, b) => b.s - a.s);
    // At most two passages from any one letter, so results span the archive.
    const perLetter = new Map<string, number>();
    const out: Passage[] = [];
    for (const { i } of scored) {
      const p = PASSAGES[i];
      const n = perLetter.get(p.title) || 0;
      if (n >= 2) continue;
      perLetter.set(p.title, n + 1);
      out.push(p);
      if (out.length >= limit) break;
    }
    return out;
  },
};

export let engine: ArchiveSearch = keywordEngine;

// ── What pages call ──
export async function searchArchive(query: string, limit = 12): Promise<Passage[]> {
  await ready();
  return engine.search(query, limit);
}

// Passages related to a GOOD SIGN or GOOD FUTURE anchor, in date order, so the reader
// can see the idea before it was named and after. The anchor's name counts double.
export async function relatedTo(anchor: Anchor, limit = 10): Promise<{ before: Passage[]; after: Passage[] }> {
  await ready();
  const found = engine
    .search(`${anchor.name} ${anchor.name} ${anchor.text}`, limit + 4)
    .filter((p) => !p.text.includes(anchor.text.slice(0, 60)))
    .slice(0, limit)
    .sort((a, b) => a.date.localeCompare(b.date));
  return {
    before: found.filter((p) => p.date < anchor.date),
    after: found.filter((p) => p.date >= anchor.date),
  };
}

export function getSign(slug: string) {
  return SIGNS.find((s) => s.slug === slug);
}

export function getPrediction(year: string, slug: string) {
  return (FUTURE[year] || []).find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
