"use client";

// Admin → Employer Feeds. Connect an employer's Greenhouse / Lever / Ashby board once;
// relevant roles import and stay in sync. Kept deliberately small.
import { useCallback, useEffect, useState } from "react";
import { DEPARTMENTS } from "@/lib/constants";

type Source = {
  id: string;
  employer_name: string;
  careers_url: string;
  source_type: string;
  source_identifier: string;
  active: boolean;
  auto_publish: boolean;
  last_sync_at: string | null;
  last_successful_sync_at: string | null;
  last_sync_status: string;
  last_sync_error: string;
};
type ImportedJob = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  department: string;
  status: string;
  import_status: string;
  source_type: string;
  source_employer_id: string;
  tier: string;
  external_apply_url: string;
  views: number;
  applies: number;
};
type Preview = {
  sourceType: string;
  identifier: string;
  total: number;
  relevant: { title: string; location: string; category: string; applyUrl: string }[];
  skipped: string[];
  error?: string;
};

const ago = (iso: string | null) => {
  if (!iso) return "never";
  const h = (Date.now() - new Date(iso).getTime()) / 3600_000;
  if (h < 1) return "just now";
  if (h < 24) return `${Math.round(h)}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
};
const ATS = { greenhouse: "Greenhouse", lever: "Lever", ashby: "Ashby" } as Record<string, string>;
const btn = "text-xs underline underline-offset-2 disabled:opacity-40";

export default function EmployerFeedsPanel({ password }: { password: string }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [jobs, setJobs] = useState<ImportedJob[]>([]);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({ employerName: "", careersUrl: "", sourceType: "", identifier: "", autoPublish: false });
  const [preview, setPreview] = useState<Preview | null>(null);
  const [editing, setEditing] = useState<{ id: string; title: string; location: string; department: string } | null>(null);

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/feeds?key=${encodeURIComponent(password)}`);
    const d = await r.json();
    setSetupNeeded(!!d.setupNeeded);
    setSources(d.sources || []);
    setJobs(d.jobs || []);
    setLoading(false);
  }, [password]);
  useEffect(() => {
    load();
  }, [load]);

  async function post(body: Record<string, unknown>) {
    const r = await fetch("/api/admin/feeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: password, ...body }),
    });
    return { ok: r.ok, data: await r.json().catch(() => ({})) };
  }
  async function patchSource(id: string, u: Record<string, unknown>) {
    setBusy(id);
    await fetch("/api/admin/feeds", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: password, id, ...u }) });
    await load();
    setBusy("");
  }
  async function jobOp(jobId: string, op: string) {
    setBusy(jobId);
    await post({ action: "job", jobId, op });
    await load();
    setBusy("");
  }
  async function refresh(id: string) {
    setBusy(id);
    const { data } = await post({ action: "sync", id });
    const r = data.result;
    setMsg(r?.ok ? `Synced: ${r.added} new, ${r.refreshed} still open, ${r.possiblyClosed} possibly closed, ${r.closed} closed.` : `Sync failed: ${r?.error || data.error}`);
    await load();
    setBusy("");
  }
  async function doPreview() {
    setBusy("preview");
    setMsg("");
    const { data } = await post({ action: "preview", ...form });
    setPreview(data.error && !data.total ? null : data);
    if (data.error) setMsg(data.error);
    setBusy("");
  }
  async function connect() {
    setBusy("add");
    const { ok, data } = await post({ action: "add", ...form });
    if (!ok) setMsg(data.error || "Couldn't connect that employer.");
    else {
      const r = data.result;
      setMsg(`Connected ${form.employerName}. ${r?.added ?? 0} roles imported${form.autoPublish ? " and live" : " into the review queue"}.`);
      setForm({ employerName: "", careersUrl: "", sourceType: "", identifier: "", autoPublish: false });
      setPreview(null);
    }
    await load();
    setBusy("");
  }
  async function saveEdit() {
    if (!editing) return;
    setBusy(editing.id);
    await fetch("/api/admin/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: password, id: editing.id, title: editing.title, location: editing.location, department: editing.department, manualOverride: true }),
    });
    setEditing(null);
    await load();
    setBusy("");
  }

  const byEmployer = (id: string) => jobs.filter((j) => j.source_employer_id === id);
  const live = (id: string) => byEmployer(id).filter((j) => j.status === "active").length;
  const queue = jobs.filter((j) => j.status === "pending" && j.import_status !== "excluded");
  const problems = sources.filter(
    (s) => s.active && (s.last_sync_status === "failed" || s.last_sync_status === "suspicious_empty" || (s.last_successful_sync_at && Date.now() - new Date(s.last_successful_sync_at).getTime() > 2 * 86400_000))
  );
  const nameOf = (id: string) => sources.find((s) => s.id === id)?.employer_name || "";

  if (loading) return <p className="text-muted text-sm">Loading…</p>;

  return (
    <div className="space-y-12">
      {setupNeeded && (
        <div className="border border-accent p-5 text-sm leading-relaxed">
          <p className="font-bold uppercase tracking-wider text-xs mb-2">One-time setup needed</p>
          Run <code>supabase-employer-feeds.sql</code> (and <code>supabase-marketplace.sql</code>) once in the Supabase SQL editor.
          Until then you can still preview any board below; connecting is switched off.
        </div>
      )}
      {msg && <p className="text-sm border-l-2 border-accent pl-3">{msg}</p>}

      {/* Add an employer */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">Connect an employer</h2>
        <div className="grid sm:grid-cols-2 gap-3 max-w-3xl">
          <input placeholder="Employer name" value={form.employerName} onChange={(e) => setForm({ ...form, employerName: e.target.value })} />
          <input placeholder="Careers board link (Greenhouse, Lever or Ashby)" value={form.careersUrl} onChange={(e) => setForm({ ...form, careersUrl: e.target.value })} />
          <select value={form.sourceType} onChange={(e) => setForm({ ...form, sourceType: e.target.value })}>
            <option value="">ATS: detect from link</option>
            <option value="greenhouse">Greenhouse</option>
            <option value="lever">Lever</option>
            <option value="ashby">Ashby</option>
          </select>
          <input placeholder="Board name (only if detection fails)" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} />
        </div>
        <label className="flex items-center gap-2 mt-3 text-sm">
          <input type="checkbox" checked={form.autoPublish} onChange={(e) => setForm({ ...form, autoPublish: e.target.checked })} />
          Auto-publish (off = new roles wait in the review queue)
        </label>
        <div className="flex gap-3 mt-4">
          <button onClick={doPreview} disabled={!!busy || !form.careersUrl && !form.identifier} className="border border-white/20 px-5 py-2 text-xs font-bold uppercase tracking-wider disabled:opacity-40">
            {busy === "preview" ? "Reading…" : "Preview roles"}
          </button>
          <button onClick={connect} disabled={!!busy || setupNeeded || !form.employerName} className="bg-accent text-black px-5 py-2 text-xs font-bold uppercase tracking-wider disabled:opacity-40">
            {busy === "add" ? "Connecting…" : "Connect"}
          </button>
        </div>
        {preview && (
          <div className="mt-5 max-w-3xl text-sm">
            <p className="mb-2">
              <span className="font-bold">{ATS[preview.sourceType]} / {preview.identifier}:</span> {preview.relevant.length} of {preview.total} roles would import.
            </p>
            <ul className="space-y-1">
              {preview.relevant.map((r) => (
                <li key={r.applyUrl}>
                  {r.title} <span className="text-muted">· {r.location} · {r.category}</span>
                </li>
              ))}
            </ul>
            {preview.skipped.length > 0 && (
              <details className="mt-3 text-muted">
                <summary className="cursor-pointer text-xs uppercase tracking-wider">Filtered out ({preview.skipped.length})</summary>
                <p className="mt-2 text-xs leading-relaxed">{preview.skipped.join(" · ")}</p>
              </details>
            )}
          </div>
        )}
      </section>

      {/* Sync health: only problems */}
      {!setupNeeded && (
        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">Sync health</h2>
          {problems.length === 0 ? (
            <p className="text-sm">{sources.length ? "✓ All feeds healthy." : "No employers connected yet."}</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {problems.map((s) => (
                <li key={s.id}>
                  <span className="font-bold">{s.employer_name} / {ATS[s.source_type]}</span>{" "}
                  <span className="text-red-400">{s.last_sync_status === "suspicious_empty" ? "Feed came back empty" : s.last_sync_status === "failed" ? "Sync failed" : "Not synced recently"}</span>
                  <span className="text-muted"> · Last success: {ago(s.last_successful_sync_at)}{s.last_sync_error ? ` · ${s.last_sync_error}` : ""}</span>{" "}
                  <button className={btn} disabled={busy === s.id} onClick={() => refresh(s.id)}>Retry</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Employers */}
      {sources.length > 0 && (
        <section className="overflow-x-auto">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">Employers</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-muted">
                <th className="py-2 pr-4">Employer</th><th className="py-2 pr-4">ATS</th><th className="py-2 pr-4">Live roles</th>
                <th className="py-2 pr-4">Last successful sync</th><th className="py-2 pr-4">Clicks (30d)</th><th className="py-2 pr-4">Mode</th><th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => {
                const js = byEmployer(s.id);
                return (
                  <tr key={s.id} className={`border-b border-white/5 ${s.active ? "" : "opacity-50"}`}>
                    <td className="py-2 pr-4 font-medium">{s.employer_name}</td>
                    <td className="py-2 pr-4 text-muted">{ATS[s.source_type]} · {s.source_identifier}</td>
                    <td className="py-2 pr-4">{live(s.id)}</td>
                    <td className="py-2 pr-4 text-muted">{ago(s.last_successful_sync_at)} {s.last_sync_status === "ok" ? "✓" : ""}</td>
                    <td className="py-2 pr-4 text-muted">{js.reduce((a, j) => a + j.views, 0)} views · {js.reduce((a, j) => a + j.applies, 0)} apply</td>
                    <td className="py-2 pr-4">
                      <button className={btn} disabled={busy === s.id} onClick={() => patchSource(s.id, { autoPublish: !s.auto_publish })}>
                        {s.auto_publish ? "Auto-publish" : "Review first"}
                      </button>
                    </td>
                    <td className="py-2 flex gap-3">
                      <button className={btn} disabled={busy === s.id || !s.active} onClick={() => refresh(s.id)}>Refresh</button>
                      <button className={btn} disabled={busy === s.id} onClick={() => patchSource(s.id, { active: !s.active })}>{s.active ? "Disable" : "Enable"}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {/* Review queue */}
      {queue.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">Review queue ({queue.length})</h2>
          <ul className="divide-y divide-white/10 text-sm">
            {queue.map((j) => (
              <li key={j.id} className="py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                {editing?.id === j.id ? (
                  <>
                    <input className="text-sm" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                    <input className="text-sm" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
                    <select className="text-sm" value={editing.department} onChange={(e) => setEditing({ ...editing, department: e.target.value })}>
                      {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                    <button className={btn} onClick={saveEdit}>Save</button>
                    <button className={btn} onClick={() => setEditing(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <a href={j.external_apply_url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">{j.title}</a>
                    <span className="text-muted">{j.company_name} · {j.location} · {j.department}</span>
                    <span className="ml-auto flex gap-3">
                      <button className={`${btn} text-green-400`} disabled={busy === j.id} onClick={() => jobOp(j.id, "publish")}>Publish</button>
                      <button className={btn} disabled={busy === j.id} onClick={() => setEditing({ id: j.id, title: j.title, location: j.location, department: j.department })}>Edit</button>
                      <button className={`${btn} text-red-400`} disabled={busy === j.id} onClick={() => jobOp(j.id, "exclude")}>Exclude</button>
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* All imported roles */}
      {jobs.length > 0 && (
        <section className="overflow-x-auto">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">Imported roles ({jobs.length})</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-muted">
                <th className="py-2 pr-4">Title</th><th className="py-2 pr-4">Employer</th><th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Source</th><th className="py-2 pr-4">Clicks</th><th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-white/5">
                  <td className="py-2 pr-4 max-w-[260px] truncate">{j.title}</td>
                  <td className="py-2 pr-4 text-muted">{nameOf(j.source_employer_id) || j.company_name}</td>
                  <td className="py-2 pr-4 text-muted">
                    {j.import_status === "excluded" ? "excluded" : j.import_status === "closed" ? "closed" : j.status === "active" ? (j.import_status === "possibly_closed" ? "live · possibly closed" : "live") : j.status}
                  </td>
                  <td className="py-2 pr-4 text-muted">{ATS[j.source_type]}</td>
                  <td className="py-2 pr-4 text-muted">{j.views} · {j.applies}</td>
                  <td className="py-2 flex gap-3">
                    {j.import_status === "excluded" ? (
                      <button className={btn} disabled={busy === j.id} onClick={() => jobOp(j.id, "restore")}>Restore</button>
                    ) : (
                      <>
                        {j.status === "active" && (
                          <button className={btn} disabled={busy === j.id} onClick={() => jobOp(j.id, j.tier === "premium" ? "unfeature" : "feature")}>
                            {j.tier === "premium" ? "Unfeature" : "Feature"}
                          </button>
                        )}
                        <button className={`${btn} text-red-400`} disabled={busy === j.id} onClick={() => jobOp(j.id, "exclude")}>Exclude</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
