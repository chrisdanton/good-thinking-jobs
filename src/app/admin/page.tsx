"use client";

import { useState, useEffect, useCallback } from "react";
import { Job, Application } from "@/lib/types";
import CuratePanel from "@/components/CuratePanel";

function formatSalary(min: number, max: number): string {
  const fmt = (n: number) => `$${Math.round(n / 1000)}K`;
  return `${fmt(min)} – ${fmt(max)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"jobs" | "curate" | "newsletter">("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [copied, setCopied] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const reload = useCallback(async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch(`/api/admin/jobs?key=${encodeURIComponent(password)}`),
        fetch(`/api/applications?key=${encodeURIComponent(password)}`),
      ]);
      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (appsRes.ok) setApplications(await appsRes.json());
    } catch {
      /* network error — leave existing lists */
    }
  }, [password]);

  useEffect(() => {
    if (authenticated) reload();
  }, [authenticated, reload]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Verify the password by hitting the admin API.
    const res = await fetch(`/api/admin/jobs?key=${encodeURIComponent(password)}`);
    if (res.ok) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  async function handleApprove(job: Job) {
    setBusyId(job.id);
    await fetch(`/api/approve?id=${encodeURIComponent(job.id)}&token=${encodeURIComponent(job.approvalToken)}`);
    await reload();
    setBusyId(null);
  }

  async function handleDeny(job: Job) {
    setBusyId(job.id);
    await fetch(`/api/deny?id=${encodeURIComponent(job.id)}&token=${encodeURIComponent(job.approvalToken)}`);
    await reload();
    setBusyId(null);
  }

  async function handleRemove(id: string) {
    setBusyId(id);
    await fetch(`/api/admin/jobs`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: password, id, status: "removed" }),
    });
    await reload();
    setBusyId(null);
  }

  async function handleToggleNewsletter(id: string, current: boolean) {
    setBusyId(id);
    await fetch(`/api/admin/jobs`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: password, id, flaggedForNewsletter: !current }),
    });
    await reload();
    setBusyId(null);
  }

  function getNewsletterDigest(): string {
    const flagged = jobs.filter((j) => j.flaggedForNewsletter && j.status === "active");
    if (flagged.length === 0) return "No jobs flagged for the newsletter yet.";

    let digest = "GOOD THINKING JOBS — Newsletter Digest\n";
    digest += "=".repeat(45) + "\n\n";
    digest += `Generated: ${new Date().toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    })}\n\n`;

    flagged.forEach((job, i) => {
      digest += `${i + 1}. ${job.title}\n`;
      digest += `   ${job.companyName} | ${job.location} | ${job.locationType}\n`;
      digest += `   ${formatSalary(job.salaryMin, job.salaryMax)} | ${job.department}\n`;
      digest += `   ${job.description.split("\n")[0].slice(0, 120)}...\n`;
      digest += `   Apply: jobs.weareingoodco.com/jobs/${job.id}\n\n`;
    });

    digest += `---\n${flagged.length} featured role${flagged.length !== 1 ? "s" : ""} this week.\n`;
    digest += "View all roles at jobs.weareingoodco.com\n";
    return digest;
  }

  function handleCopyDigest() {
    navigator.clipboard.writeText(getNewsletterDigest());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto px-5 py-20">
        <h1 className="text-3xl font-bold uppercase font-display mb-6 text-center">Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-white/20"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-6 py-3 hover:bg-accent/90 transition-colors w-full"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  const pendingJobs = jobs.filter((j) => j.status === "pending");
  const activeJobs = jobs.filter((j) => j.status === "active");
  const handledJobs = jobs.filter((j) => j.status === "removed" || j.status === "rejected");

  // Search across name, company, email, apply URL and referral code so you can
  // look up who used a code and when.
  const q = search.trim().toLowerCase();
  const visibleJobs = q
    ? jobs.filter((j) =>
        [j.title, j.companyName, j.posterName, j.posterEmail, j.externalApplyUrl, j.referralCode]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(q))
      )
    : jobs;

  const statusColor = (status: Job["status"]) =>
    status === "active" ? "text-green-400" : status === "pending" ? "text-accent" : "text-red-400";

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="text-3xl font-bold uppercase font-display mb-6">Admin</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-white/10">
        {(["jobs", "curate", "newsletter"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs uppercase tracking-widest font-bold font-headline transition-colors border-b-2 -mb-px ${
              tab === t ? "border-accent text-accent" : "border-transparent text-muted hover:text-white"
            }`}
          >
            {t === "jobs" ? `All Postings (${jobs.length})` : t === "curate" ? "Add from Link" : "Newsletter Digest"}
          </button>
        ))}
      </div>

      {/* Jobs Tab */}
      {tab === "jobs" && (
        <div>
          <div className="text-sm text-muted mb-4 font-secondary">
            {pendingJobs.length} pending &middot; {activeJobs.length} active &middot; {handledJobs.length} removed/rejected
          </div>

          {pendingJobs.length > 0 && (
            <div className="mb-4 text-xs uppercase tracking-widest text-accent font-bold">
              {pendingJobs.length} job{pendingJobs.length !== 1 ? "s" : ""} awaiting your approval
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, company, email, apply URL or referral code…"
              className="w-full sm:max-w-md border-white/20"
            />
            {q && (
              <p className="text-xs text-muted mt-1 font-secondary">
                {visibleJobs.length} match{visibleJobs.length !== 1 ? "es" : ""}
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-muted">
                  <th className="pb-3 pr-4">Job</th>
                  <th className="pb-3 pr-4">Company</th>
                  <th className="pb-3 pr-4">Referral</th>
                  <th className="pb-3 pr-4">Tier</th>
                  <th className="pb-3 pr-4">Salary</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Posted</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleJobs.map((job) => (
                  <tr key={job.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 pr-4 font-medium max-w-[200px] truncate">{job.title}</td>
                    <td className="py-3 pr-4 text-muted">
                      <div>{job.companyName}</div>
                      <div className="text-xs text-muted/70 truncate max-w-[180px]">{job.posterName} · {job.posterEmail}</div>
                    </td>
                    <td className="py-3 pr-4">
                      {job.referralCode ? (
                        <span className="text-xs px-2 py-0.5 font-bold uppercase tracking-wider bg-accent/20 text-accent">{job.referralCode}</span>
                      ) : (
                        <span className="text-muted/40">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 font-bold uppercase tracking-wider ${
                        job.tier === "premium" ? "bg-accent text-black" : job.tier === "standard" ? "bg-white/10 text-white" : "text-muted"
                      }`}>
                        {job.tier}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted">{formatSalary(job.salaryMin, job.salaryMax)}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs ${statusColor(job.status)}`}>{job.status}</span>
                    </td>
                    <td className="py-3 pr-4 text-muted">{formatDate(job.createdAt)}</td>
                    <td className="py-3">
                      <div className="flex gap-3 items-center">
                        {job.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(job)}
                              disabled={busyId === job.id}
                              className="text-xs text-green-400 hover:text-green-300 underline underline-offset-2 disabled:opacity-40"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDeny(job)}
                              disabled={busyId === job.id}
                              className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 disabled:opacity-40"
                            >
                              Deny
                            </button>
                          </>
                        )}
                        {job.status === "active" && (
                          <button
                            onClick={() => handleRemove(job.id)}
                            disabled={busyId === job.id}
                            className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 disabled:opacity-40"
                          >
                            Remove
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleNewsletter(job.id, job.flaggedForNewsletter)}
                          disabled={busyId === job.id}
                          className={`text-xs underline underline-offset-2 disabled:opacity-40 ${
                            job.flaggedForNewsletter ? "text-accent" : "text-muted hover:text-white"
                          }`}
                        >
                          {job.flaggedForNewsletter ? "Unflag" : "Flag"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visibleJobs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted">
                      {q ? "No matches." : "No postings yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {applications.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">Applications</h2>
              <div className="space-y-3">
                {applications.map((app) => {
                  const appJob = jobs.find((j) => j.id === app.jobId);
                  return (
                    <div key={app.id} className="border border-white/10 p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <span className="font-medium">{app.applicantName}</span>
                          <span className="text-muted text-sm ml-2 font-secondary">
                            for {appJob?.title || "Unknown"} at {appJob?.companyName || "Unknown"}
                          </span>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          app.status === "new" ? "text-accent" : "text-muted"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted space-y-1 font-secondary">
                        <p>{app.applicantEmail} &middot; {app.applicantPhone}</p>
                        {app.applicantLinkedIn && (
                          <p><a href={app.applicantLinkedIn} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">LinkedIn</a></p>
                        )}
                        <p className="mt-2 text-white/80">{app.coverNote}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Curate Tab */}
      {tab === "curate" && <CuratePanel password={password} onPosted={reload} />}

      {/* Newsletter Tab */}
      {tab === "newsletter" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-muted font-bold">Friday Digest</h2>
            <button
              onClick={handleCopyDigest}
              className={`text-sm font-bold uppercase tracking-wider font-headline px-4 py-2 transition-colors ${
                copied ? "bg-green-500/20 text-green-400" : "bg-accent text-black hover:bg-accent/90"
              }`}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>

          <div className="border border-white/10 p-6">
            <pre className="text-sm text-muted whitespace-pre-wrap font-mono leading-relaxed">
              {getNewsletterDigest()}
            </pre>
          </div>

          <p className="text-xs text-muted mt-4 font-secondary">
            Flag jobs for the newsletter from the &quot;All Postings&quot; tab.
          </p>
        </div>
      )}
    </div>
  );
}
