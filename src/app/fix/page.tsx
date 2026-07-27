"use client";

import { useState, useEffect, useCallback } from "react";
import { Job } from "@/lib/types";

// A deliberately tiny, phone-first page for late-night corrections: fix a wrong
// company name or a missing salary in a few taps. Not for editing descriptions —
// just the quick stuff Chris spots while browsing. The password is remembered on
// the device so there's no login step after the first time. Everything is still
// authorised server-side on every request (/api/admin/jobs needs the key).

const KEY_STORAGE = "gt_fix_key";

// Accepts "166k-276k", "166000 - 276000", "200k", or blank. Bare numbers under
// 1000 are read as thousands. Returns whole-dollar min/max (max 0 = open-ended,
// both 0 = not listed).
function parseSalary(input: string): { min: number; max: number } {
  const nums: number[] = [];
  for (const m of Array.from(input.matchAll(/(\d[\d,]*(?:\.\d+)?)\s*(k)?/gi))) {
    let n = parseFloat(m[1].replace(/,/g, ""));
    if (!isFinite(n)) continue;
    if (m[2]) n *= 1000;
    else if (n > 0 && n < 1000) n *= 1000;
    nums.push(Math.round(n));
  }
  if (nums.length === 0) return { min: 0, max: 0 };
  if (nums.length === 1) return { min: nums[0], max: 0 };
  return { min: Math.min(nums[0], nums[1]), max: Math.max(nums[0], nums[1]) };
}

function salaryToInput(min: number, max: number): string {
  if (!min && !max) return "";
  if (!max) return String(min);
  return `${min}-${max}`;
}

export default function FixPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async (k: string) => {
    const res = await fetch(`/api/admin/jobs?key=${encodeURIComponent(k)}`);
    if (!res.ok) throw new Error("bad key");
    const all: Job[] = await res.json();
    // Live jobs first, newest first — the ones worth fixing.
    setJobs(all.filter((j) => j.status === "active"));
  }, []);

  // Try the remembered key on first load.
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(KEY_STORAGE) : null;
    if (!saved) return;
    load(saved)
      .then(() => {
        setKey(saved);
        setAuthed(true);
      })
      .catch(() => localStorage.removeItem(KEY_STORAGE));
  }, [load]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    // Phone keyboards love to add a trailing space or autocapitalise — trim so a
    // stray space doesn't read as a wrong password.
    const k = key.trim();
    try {
      await load(k);
      localStorage.setItem(KEY_STORAGE, k);
      setKey(k);
      setAuthed(true);
    } catch {
      setError("Wrong password");
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <form onSubmit={signIn} className="w-full max-w-sm">
          <h1 className="text-xl font-bold tracking-tight mb-1">Fix a job</h1>
          <p className="text-white/50 text-sm mb-6">Quick corrections from your phone.</p>
          <input
            type="password"
            inputMode="text"
            autoFocus
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Password"
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-base outline-none focus:border-white/40"
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full mt-4 bg-white text-black font-bold py-3 rounded-lg text-base"
          >
            Enter
          </button>
        </form>
      </main>
    );
  }

  const filtered = jobs.filter((j) =>
    `${j.companyName} ${j.title}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="text-xl font-bold tracking-tight">Fix a job</h1>
          <span className="text-white/40 text-xs">{jobs.length} live</span>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company or title…"
          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-base outline-none focus:border-white/40 mb-4"
        />

        <div className="space-y-2">
          {filtered.map((job) => (
            <JobRow
              key={job.id}
              job={job}
              apiKey={key}
              open={openId === job.id}
              onToggle={() => setOpenId(openId === job.id ? null : job.id)}
              onSaved={(updated) =>
                setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)))
              }
              onRemoved={(id) => {
                setJobs((prev) => prev.filter((j) => j.id !== id));
                setOpenId(null);
              }}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-white/40 text-sm py-8 text-center">No jobs match.</p>
          )}
        </div>
      </div>
    </main>
  );
}

function JobRow({
  job,
  apiKey,
  open,
  onToggle,
  onSaved,
  onRemoved,
}: {
  job: Job;
  apiKey: string;
  open: boolean;
  onToggle: () => void;
  onSaved: (job: Job) => void;
  onRemoved: (id: string) => void;
}) {
  const [company, setCompany] = useState(job.companyName);
  const [title, setTitle] = useState(job.title);
  const [location, setLocation] = useState(job.location);
  const [salary, setSalary] = useState(salaryToInput(job.salaryMin, job.salaryMax));
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setSaved(false);
    const { min, max } = parseSalary(salary);
    const res = await fetch(`/api/admin/jobs`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: apiKey,
        id: job.id,
        companyName: company,
        title,
        location,
        salaryMin: min,
        salaryMax: max,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setSaved(true);
      onSaved({ ...job, companyName: company, title, location, salaryMin: min, salaryMax: max });
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function remove() {
    if (!confirm("Remove this job from the board?")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/jobs`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: apiKey, id: job.id, status: "removed" }),
    });
    setBusy(false);
    if (res.ok) onRemoved(job.id);
  }

  const field = "w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-base outline-none focus:border-white/40";
  const label = "block text-[11px] uppercase tracking-wider text-white/40 mb-1 mt-3";

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
      >
        <span className="min-w-0">
          <span className="block font-semibold truncate">{job.companyName}</span>
          <span className="block text-white/50 text-sm truncate">{job.title}</span>
        </span>
        <span className="text-white/30 text-xl shrink-0">{open ? "×" : "›"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-white/10">
          <label className={label}>Company</label>
          <input className={field} value={company} onChange={(e) => setCompany(e.target.value)} />

          <label className={label}>Title</label>
          <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} />

          <label className={label}>Location</label>
          <input className={field} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, ST" />

          <label className={label}>Salary</label>
          <input className={field} value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 166k-276k, or blank" inputMode="text" />
          <p className="text-white/30 text-xs mt-1">Type a range like 166k-276k. Leave blank for &quot;not listed.&quot;</p>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={save}
              disabled={busy}
              className="flex-1 bg-white text-black font-bold py-3 rounded-lg text-base disabled:opacity-50"
            >
              {busy ? "Saving…" : saved ? "Saved ✓" : "Save"}
            </button>
            <button
              onClick={remove}
              disabled={busy}
              className="px-4 py-3 text-red-400 text-sm border border-red-400/30 rounded-lg disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
