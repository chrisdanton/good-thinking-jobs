"use client";

import { useState } from "react";
import { DEPARTMENTS, LOCATION_TYPES, ROLE_LEVELS } from "@/lib/constants";
import { Department, LocationType, RoleLevel } from "@/lib/types";

// One draft listing being reviewed before it's posted.
interface Draft {
  key: string;
  sourceUrl: string;
  title: string;
  companyName: string;
  companyWebsite: string;
  location: string;
  locationType: LocationType;
  department: Department;
  roleLevel: RoleLevel;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string;
  externalApplyUrl: string;
  posting: boolean;
  posted: boolean;
  error: string;
}

const inputCls = "w-full border-white/20 bg-transparent text-sm px-3 py-2";
const labelCls = "block text-[11px] uppercase tracking-widest text-muted mb-1 font-bold";

export default function CuratePanel({
  password,
  onPosted,
}: {
  password: string;
  onPosted: () => void;
}) {
  const [urls, setUrls] = useState("");
  const [fetching, setFetching] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [notice, setNotice] = useState("");

  function updateDraft(key: string, patch: Partial<Draft>) {
    setDrafts((ds) => ds.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  }

  async function handleFetch() {
    const list = urls
      .split(/[\n,\s]+/)
      .map((u) => u.trim())
      .filter((u) => /^https?:\/\//i.test(u));

    if (list.length === 0) {
      setNotice("Paste one or more job links (each starting with http).");
      return;
    }

    setNotice("");
    setFetching(true);

    for (const url of list) {
      const key = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      try {
        const res = await fetch("/api/admin/curate/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: password, url }),
        });
        const data = await res.json();
        if (!res.ok) {
          setDrafts((ds) => [
            ...ds,
            blankDraft(key, url, { error: data.error || "Couldn't read that page. Fill it in by hand." }),
          ]);
          continue;
        }
        setDrafts((ds) => [...ds, blankDraft(key, url, data)]);
      } catch {
        setDrafts((ds) => [
          ...ds,
          blankDraft(key, url, { error: "Network error reaching that page. Fill it in by hand." }),
        ]);
      }
    }

    setFetching(false);
    setUrls("");
  }

  async function handlePost(d: Draft) {
    updateDraft(d.key, { posting: true, error: "" });
    try {
      const res = await fetch("/api/admin/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, key: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        updateDraft(d.key, { posting: false, error: data.error || "Couldn't post this one." });
        return;
      }
      updateDraft(d.key, { posting: false, posted: true });
      onPosted();
    } catch {
      updateDraft(d.key, { posting: false, error: "Network error posting this one." });
    }
  }

  function discard(key: string) {
    setDrafts((ds) => ds.filter((d) => d.key !== key));
  }

  return (
    <div>
      <div className="border border-white/10 p-6 mb-8">
        <label className={labelCls}>Paste one or more job links (one per line)</label>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          rows={4}
          placeholder={"https://boards.greenhouse.io/acme/jobs/12345\nhttps://www.linkedin.com/jobs/view/98765"}
          className="w-full border-white/20 bg-transparent text-sm px-3 py-2 font-mono"
        />
        {notice && <p className="text-accent text-xs mt-2">{notice}</p>}
        <button
          onClick={handleFetch}
          disabled={fetching}
          className="mt-3 bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-6 py-3 hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {fetching ? "Reading…" : "Fetch & fill"}
        </button>
        <p className="text-xs text-muted mt-3 font-secondary">
          The reader fills in what it can. Review each one, edit anything that&rsquo;s off, then post it. Posted jobs go
          live immediately, are labeled &ldquo;Sourced by GOOD THINKING,&rdquo; and their Apply button links to the
          original posting.
        </p>
      </div>

      {drafts.length === 0 && (
        <p className="text-muted text-sm text-center py-8 font-secondary">
          No drafts yet. Paste links above and hit &ldquo;Fetch &amp; fill.&rdquo;
        </p>
      )}

      <div className="space-y-6">
        {drafts.map((d) => (
          <div key={d.key} className="border border-white/15 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <a
                href={d.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted underline underline-offset-2 truncate max-w-[70%] break-all"
              >
                {d.sourceUrl}
              </a>
              {!d.posted && (
                <button
                  onClick={() => discard(d.key)}
                  className="text-xs text-muted hover:text-white underline underline-offset-2"
                >
                  Discard
                </button>
              )}
            </div>

            {d.posted ? (
              <p className="text-green-400 text-sm font-bold uppercase tracking-wider">✓ Posted &amp; live</p>
            ) : (
              <>
                {d.error && <p className="text-red-400 text-xs mb-4">{d.error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Job title</label>
                    <input className={inputCls} value={d.title} onChange={(e) => updateDraft(d.key, { title: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Company</label>
                    <input className={inputCls} value={d.companyName} onChange={(e) => updateDraft(d.key, { companyName: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Company website</label>
                    <input className={inputCls} value={d.companyWebsite} onChange={(e) => updateDraft(d.key, { companyWebsite: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Location</label>
                    <input className={inputCls} value={d.location} onChange={(e) => updateDraft(d.key, { location: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Location type</label>
                    <select className={inputCls} value={d.locationType} onChange={(e) => updateDraft(d.key, { locationType: e.target.value as LocationType })}>
                      {LOCATION_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-black">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Department</label>
                    <select className={inputCls} value={d.department} onChange={(e) => updateDraft(d.key, { department: e.target.value as Department })}>
                      {DEPARTMENTS.map((t) => (
                        <option key={t} value={t} className="bg-black">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Role level</label>
                    <select className={inputCls} value={d.roleLevel} onChange={(e) => updateDraft(d.key, { roleLevel: e.target.value as RoleLevel })}>
                      {ROLE_LEVELS.map((t) => (
                        <option key={t} value={t} className="bg-black">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Salary min (USD, 0 = not listed)</label>
                    <input type="number" className={inputCls} value={d.salaryMin} onChange={(e) => updateDraft(d.key, { salaryMin: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className={labelCls}>Salary max (USD, 0 = not listed)</label>
                    <input type="number" className={inputCls} value={d.salaryMax} onChange={(e) => updateDraft(d.key, { salaryMax: Number(e.target.value) })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Apply link (original posting)</label>
                    <input className={inputCls} value={d.externalApplyUrl} onChange={(e) => updateDraft(d.key, { externalApplyUrl: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Description</label>
                    <textarea rows={6} className={inputCls} value={d.description} onChange={(e) => updateDraft(d.key, { description: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Requirements</label>
                    <textarea rows={4} className={inputCls} value={d.requirements} onChange={(e) => updateDraft(d.key, { requirements: e.target.value })} />
                  </div>
                </div>

                <button
                  onClick={() => handlePost(d)}
                  disabled={d.posting}
                  className="mt-5 bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-6 py-3 hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {d.posting ? "Posting…" : "Post to board"}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function blankDraft(key: string, url: string, data: Partial<Draft> & { error?: string }): Draft {
  return {
    key,
    sourceUrl: url,
    title: data.title || "",
    companyName: data.companyName || "",
    companyWebsite: data.companyWebsite || "",
    location: data.location || "",
    locationType: (data.locationType as LocationType) || "Remote",
    department: (data.department as Department) || "Marketing",
    roleLevel: (data.roleLevel as RoleLevel) || "Senior",
    salaryMin: Number(data.salaryMin) || 0,
    salaryMax: Number(data.salaryMax) || 0,
    description: data.description || "",
    requirements: data.requirements || "",
    externalApplyUrl: data.externalApplyUrl || url,
    posting: false,
    posted: false,
    error: data.error || "",
  };
}
