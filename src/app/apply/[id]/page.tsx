"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Job } from "@/lib/types";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    applicantLinkedIn: "",
    resumeFileName: "",
    coverNote: "",
  });

  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setJob(data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: params.id as string,
          applicantName: form.applicantName,
          applicantEmail: form.applicantEmail,
          applicantPhone: form.applicantPhone,
          applicantLinkedIn: form.applicantLinkedIn,
          resumeFileName: form.resumeFileName || "resume.pdf",
          coverNote: form.coverNote,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong submitting your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center text-muted">Loading...</div>;
  }

  if (!job || job.tier !== "premium") {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h1 className="text-3xl font-bold uppercase font-display mb-4">
          {!job ? "Job not found" : "Premium listings only"}
        </h1>
        <p className="text-muted mb-6 font-secondary">In-board applications are available for Premium listings.</p>
        <Link href="/" className="text-accent underline underline-offset-2">Back to all jobs</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
        <h1 className="text-4xl sm:text-5xl font-bold uppercase font-display leading-[0.95] tracking-tight mb-3">
          Applied
        </h1>
        <p className="text-muted mb-8 font-secondary text-lg">
          Your application for <span className="text-white font-semibold">{job.title}</span> at {job.companyName} has been received.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-8 py-3 hover:bg-accent/90 transition-colors"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
      <Link
        href={`/jobs/${job.id}`}
        className="text-sm text-muted hover:text-white transition-colors mb-8 inline-block uppercase tracking-widest"
      >
        &larr; Back to job
      </Link>

      <div className="border border-accent/60 bg-accent/[0.03] p-6 mb-8">
        <p className="text-xs uppercase tracking-widest text-accent font-bold mb-1">Applying for</p>
        <h1 className="text-2xl font-bold uppercase font-display">{job.title}</h1>
        <p className="text-muted font-secondary">{job.companyName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Full Name *</label>
            <input required value={form.applicantName} onChange={(e) => update("applicantName", e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Email *</label>
            <input required type="email" value={form.applicantEmail} onChange={(e) => update("applicantEmail", e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Phone</label>
            <input value={form.applicantPhone} onChange={(e) => update("applicantPhone", e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1 uppercase tracking-wider">LinkedIn</label>
            <input value={form.applicantLinkedIn} onChange={(e) => update("applicantLinkedIn", e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Resume</label>
          <div className="border border-dashed border-white/20 p-6 text-center text-muted text-sm">
            <p className="mb-2 font-secondary">Resume upload coming soon</p>
            <input
              value={form.resumeFileName}
              onChange={(e) => update("resumeFileName", e.target.value)}
              placeholder="Type a filename (e.g. resume.pdf)"
              className="w-full max-w-xs mx-auto text-center text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Cover Note *</label>
          <textarea
            required
            rows={5}
            value={form.coverNote}
            onChange={(e) => update("coverNote", e.target.value)}
            placeholder="Why are you a great fit for this role?"
            className="w-full"
          />
        </div>

        {submitError && <p className="text-red-400 text-sm">{submitError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-8 py-3 hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
