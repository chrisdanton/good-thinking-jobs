"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEPARTMENTS, LOCATION_TYPES, ROLE_LEVELS, TIERS, isPromoActive, PROMO_LABEL, validateSalaryForTier } from "@/lib/constants";
import { Department, LocationType, RoleLevel, Tier } from "@/lib/types";

type Step = "tier" | "details" | "payment" | "confirmation";

const STEP_LABELS: Record<Step, string> = {
  tier: "Plan",
  details: "Details",
  payment: "Payment",
  confirmation: "Done",
};

export default function PostJobPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("tier");
  const [form, setForm] = useState({
    posterName: "",
    posterEmail: "",
    companyName: "",
    companyLogo: "",
    companyWebsite: "",
    title: "",
    department: "" as Department | "",
    location: "",
    locationType: "" as LocationType | "",
    roleLevel: "" as RoleLevel | "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    externalApplyUrl: "",
    referralCode: "",
  });
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [busy, setBusy] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [salaryError, setSalaryError] = useState("");
  const [referralError, setReferralError] = useState("");
  const [autofillUrl, setAutofillUrl] = useState("");
  const [autofilling, setAutofilling] = useState(false);
  const [autofillNote, setAutofillNote] = useState("");
  const [autofillDone, setAutofillDone] = useState(false);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Auto-fill: paste a link to an existing job posting and let the reader fill in
  // as many fields as it can. The poster then reviews and edits before posting.
  // Reading fails on some sites (heavy Javascript, logins, odd link formats), so
  // a friendly note explains that and the form stays editable by hand.
  async function handleAutofill() {
    const url = autofillUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      setAutofillNote("Paste a full link starting with http.");
      return;
    }
    setAutofilling(true);
    setAutofillNote("");
    setAutofillDone(false);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAutofillNote(
          "Oy, sorry, we tried. Something about your link makes it so we can't auto-populate this one. Go ahead and fill it in below."
        );
        return;
      }
      setForm((prev) => ({
        ...prev,
        companyName: data.companyName || prev.companyName,
        companyWebsite: data.companyWebsite || prev.companyWebsite,
        title: data.title || prev.title,
        department: (data.department as Department) || prev.department,
        location: data.location || prev.location,
        locationType: (data.locationType as LocationType) || prev.locationType,
        roleLevel: (data.roleLevel as RoleLevel) || prev.roleLevel,
        salaryMin: data.salaryMin ? String(data.salaryMin) : prev.salaryMin,
        salaryMax: data.salaryMax ? String(data.salaryMax) : prev.salaryMax,
        description: data.description || prev.description,
        requirements: data.requirements || prev.requirements,
        externalApplyUrl: data.externalApplyUrl || url || prev.externalApplyUrl,
      }));
      setAutofillDone(true);
      setSalaryError("");
    } catch {
      setAutofillNote(
        "Oy, sorry, we tried. Something about your link makes it so we can't auto-populate this one. Go ahead and fill it in below."
      );
    } finally {
      setAutofilling(false);
    }
  }

  // Returning from Stripe Checkout: confirm payment, then show the confirmation.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      setVerifying(true);
      fetch(`/api/checkout/confirm?session_id=${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.paid && data.job) {
            setForm((prev) => ({
              ...prev,
              title: data.job.title,
              companyName: data.job.companyName,
              posterEmail: data.job.posterEmail,
            }));
            setSelectedTier(data.job.tier);
            setStep("confirmation");
          } else {
            setCheckoutError(
              "We couldn't confirm your payment. If you were charged, email goodjobs@weareingoodco.com and we'll sort it out."
            );
          }
        })
        .catch(() =>
          setCheckoutError("Something went wrong confirming your payment. Please email goodjobs@weareingoodco.com.")
        )
        .finally(() => setVerifying(false));
    } else if (params.get("canceled")) {
      setStep("tier");
    }
  }, []);

  function jobPayload() {
    return {
      posterName: form.posterName,
      posterEmail: form.posterEmail,
      companyName: form.companyName,
      companyLogo: form.companyLogo,
      companyWebsite: form.companyWebsite,
      title: form.title,
      department: form.department,
      location: form.location,
      locationType: form.locationType,
      roleLevel: form.roleLevel,
      salaryMin: parseInt(form.salaryMin) || 0,
      salaryMax: parseInt(form.salaryMax) || 0,
      description: form.description,
      requirements: form.requirements,
      externalApplyUrl: form.externalApplyUrl,
      tier: selectedTier,
      referralCode: form.referralCode.trim(),
    };
  }

  // Plan is chosen first; continuing takes the poster to the job details form.
  function handleTierSelect() {
    if (!selectedTier) return;
    setStep("details");
  }

  // After filling in details: free plans (and everything during the launch promo)
  // publish immediately; paid plans otherwise go to Stripe.
  function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    // The salary range must fit the plan the poster picked (e.g. Free is for
    // roles under $100K). Block submission and surface a clear message if not.
    if (selectedTier) {
      const err = validateSalaryForTier(
        selectedTier,
        parseInt(form.salaryMin) || 0,
        parseInt(form.salaryMax) || 0
      );
      if (err) {
        setSalaryError(err);
        return;
      }
      setSalaryError("");
    }
    setReferralError("");
    // Free tier and the launch promo always post for free. For paid tiers after
    // the promo, a referral code comps the listing (the server validates it);
    // without one, the poster goes to Stripe.
    if (selectedTier === "free" || isPromoActive() || form.referralCode.trim()) {
      createJob();
    } else {
      startCheckout();
    }
  }

  async function createJob() {
    setBusy(true);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobPayload()),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      // 402 = the referral code was missing or invalid for a paid plan.
      if (res.status === 402) {
        setReferralError(data.error || "That referral code isn't valid.");
      } else if (data.error) {
        setSalaryError(data.error);
      } else {
        alert("Something went wrong. Please try again.");
      }
      return;
    }
    await res.json();
    setStep("confirmation");
  }

  // Paid tiers: create a Stripe Checkout session and redirect to Stripe's hosted page.
  async function startCheckout() {
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload()),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch {
      setBusy(false);
      alert("Couldn't start checkout. Please try again.");
    }
  }

  const steps: Step[] = ["tier", "details", "payment", "confirmation"];
  const promo = isPromoActive();

  // Returning from Stripe: show a verifying state / error before anything else.
  if (verifying) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center text-muted">
        Confirming your payment&hellip;
      </div>
    );
  }
  if (checkoutError) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
        <h1 className="text-3xl font-bold uppercase font-display mb-4">Hmm.</h1>
        <p className="text-muted font-secondary mb-8">{checkoutError}</p>
        <button
          onClick={() => router.push("/jobs")}
          className="bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-8 py-3"
        >
          Browse the Board
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 sm:pt-12 pb-20 sm:pb-28">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-10 text-xs uppercase tracking-widest">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            {i > 0 && <div className="w-6 h-px bg-white/20" />}
            <span
              className={
                step === s
                  ? "text-black bg-accent px-3 py-1 font-bold"
                  : steps.indexOf(step) > i
                  ? "text-white"
                  : "text-muted"
              }
            >
              {STEP_LABELS[s]}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Details */}
      {step === "details" && (
        <form onSubmit={handleDetailsSubmit}>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold uppercase font-display leading-[0.9] tracking-tight mb-8">
            Post a Job
          </h1>

          {/* Auto-fill from an existing posting */}
          <div className="border border-accent/40 bg-accent/[0.04] p-5 mb-8 max-w-3xl">
            <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-bold">
              Save time: auto-fill from a link
            </label>
            <p className="text-xs text-muted mb-3 font-secondary">
              Already have this job posted somewhere? Paste the link and we&apos;ll fill in what we can. Review it before you post.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={autofillUrl}
                onChange={(e) => { setAutofillUrl(e.target.value); setAutofillNote(""); setAutofillDone(false); }}
                placeholder="https://yourcompany.com/careers/..."
                className="w-full"
              />
              <button
                type="button"
                onClick={handleAutofill}
                disabled={autofilling}
                className="shrink-0 bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-6 py-3 hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {autofilling ? "Reading…" : "Auto-fill"}
              </button>
            </div>
            {autofillNote && (
              <p className="text-xs mt-3 font-secondary text-red-400">{autofillNote}</p>
            )}
            {autofillDone && !autofillNote && (
              <p className="text-xs mt-3 font-secondary text-green-400">
                Done. We filled in what we could, please review everything below before posting.
              </p>
            )}
          </div>

          <div className="space-y-8 max-w-3xl">
            <section>
              <h2 className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">
                Your Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Name *</label>
                  <input required value={form.posterName} onChange={(e) => update("posterName", e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Email *</label>
                  <input required type="email" value={form.posterEmail} onChange={(e) => update("posterEmail", e.target.value)} className="w-full" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">
                Company
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Company Name *</label>
                  <input required value={form.companyName} onChange={(e) => update("companyName", e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Website</label>
                  <input value={form.companyWebsite} onChange={(e) => update("companyWebsite", e.target.value)} placeholder="https://" className="w-full" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">
                Job Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Job Title *</label>
                  <input required value={form.title} onChange={(e) => update("title", e.target.value)} className="w-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Department *</label>
                    <select required value={form.department} onChange={(e) => update("department", e.target.value)} className="w-full">
                      <option value="">Select</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Location Type *</label>
                    <select required value={form.locationType} onChange={(e) => update("locationType", e.target.value)} className="w-full">
                      <option value="">Select</option>
                      {LOCATION_TYPES.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Role Level *</label>
                    <select required value={form.roleLevel} onChange={(e) => update("roleLevel", e.target.value)} className="w-full">
                      <option value="">Select</option>
                      {ROLE_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Location *</label>
                  <input required value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. New York, NY" className="w-full" />
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Salary Min ($) *</label>
                      <input required type="number" value={form.salaryMin} onChange={(e) => { update("salaryMin", e.target.value); setSalaryError(""); }} placeholder="80000" className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Salary Max ($) *</label>
                      <input required type="number" value={form.salaryMax} onChange={(e) => { update("salaryMax", e.target.value); setSalaryError(""); }} placeholder="120000" className="w-full" />
                    </div>
                  </div>
                  {selectedTier && !salaryError && (
                    <p className="text-xs text-muted mt-1 font-secondary">
                      {TIERS[selectedTier].name} tier: {TIERS[selectedTier].salaryLabel}
                    </p>
                  )}
                  {salaryError && (
                    <p className="text-xs mt-1 font-secondary text-red-400">{salaryError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Description *</label>
                  <textarea required rows={6} value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1 uppercase tracking-wider">Requirements *</label>
                  <textarea required rows={4} value={form.requirements} onChange={(e) => update("requirements", e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1 uppercase tracking-wider">
                    Link to Apply *
                  </label>
                  <input required type="url" value={form.externalApplyUrl} onChange={(e) => update("externalApplyUrl", e.target.value)} placeholder="https://yourcompany.com/careers/..." className="w-full" />
                  <p className="text-xs text-muted mt-1 font-secondary">Candidates apply on your own job posting. Paste the link to it here.</p>
                </div>
                {selectedTier !== "free" && (
                  <div>
                    <label className="block text-xs text-muted mb-1 uppercase tracking-wider">
                      Referral code <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      value={form.referralCode}
                      onChange={(e) => { update("referralCode", e.target.value); setReferralError(""); }}
                      placeholder="Have a code? Enter it here."
                      className="w-full"
                    />
                    {referralError ? (
                      <p className="text-xs mt-1 font-secondary text-red-400">{referralError}</p>
                    ) : (
                      <p className="text-xs text-muted mt-1 font-secondary">A valid code posts this listing for free.</p>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => setStep("tier")}
              className="border border-white/20 text-white text-sm font-bold uppercase tracking-wider font-headline px-6 py-3 hover:border-white/40 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={busy}
              className="bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-8 py-3 hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {busy
                ? "One moment…"
                : selectedTier === "free"
                ? "Post Job (Free)"
                : promo
                ? "Post Job (Free Launch Offer)"
                : form.referralCode.trim()
                ? "Post Job (Free)"
                : "Continue to Checkout"}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Tier Selection */}
      {step === "tier" && (
        <div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold uppercase font-display leading-[0.9] tracking-tight mb-3">
            Choose Your Plan
          </h1>
          <p className="text-lg sm:text-xl text-foreground font-secondary leading-relaxed mb-6 max-w-2xl">
            Pick the plan that fits the role. Each tier and what it includes is below. You&apos;ll add the job details next.
          </p>

          {promo && (
            <div className="bg-accent text-black px-5 py-4 mb-8">
              <p className="text-sm font-bold uppercase tracking-normal font-headline leading-relaxed">
                🎉 {PROMO_LABEL} Pick any plan and you won&apos;t be charged. Your listing also goes out to 17,000+ leaders in the Sunday newsletter.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {(Object.entries(TIERS) as [Tier, typeof TIERS[Tier]][]).map(
              ([key, tier]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTier(key)}
                  className={`flex flex-col items-start justify-start text-left p-6 border transition-all ${
                    selectedTier === key
                      ? "border-accent bg-accent/[0.05]"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <div className="w-full flex items-baseline justify-between mb-4">
                    <h3 className="font-bold uppercase text-lg font-display">{tier.name}</h3>
                    <span className="text-accent font-bold text-2xl font-display">
                      {tier.price === 0 ? (
                        "Free"
                      ) : promo ? (
                        <>
                          <span className="line-through opacity-40 mr-2">${tier.price}</span>
                          Free
                        </>
                      ) : (
                        `$${tier.price}`
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-4 uppercase tracking-wider">{tier.salaryLabel}</p>
                  <ul className="w-full space-y-2">
                    {tier.features.map((f) => (
                      <li key={f} className="text-sm text-muted flex items-start gap-2 font-secondary">
                        <span className="text-accent">&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              )
            )}
          </div>

          <p className="text-xs text-muted mb-8 font-secondary">
            <span className="text-accent">★</span> Premium listings are featured in the Sunday newsletter. To make a given Sunday&apos;s letter, submit by <span className="text-white">end of day Thursday</span>.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/jobs")}
              className="border border-white/20 text-white text-sm font-bold uppercase tracking-wider font-headline px-6 py-3 hover:border-white/40 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleTierSelect}
              disabled={!selectedTier}
              className="bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-8 py-3 hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue to Details
            </button>
          </div>
        </div>
      )}


      {/* Step 4: Confirmation */}
      {step === "confirmation" && (
        <div className="py-10">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold uppercase font-display leading-[0.9] tracking-tight mb-3">
            Submitted
          </h1>
          <p className="text-white/70 mb-4 font-secondary text-lg leading-relaxed">
            Your {selectedTier && TIERS[selectedTier].name} listing for{" "}
            <span className="text-white font-semibold">{form.title}</span> at{" "}
            <span className="text-white font-semibold">{form.companyName}</span> is in review.
          </p>
          <p className="text-muted mb-8 font-secondary">
            We manually approve every listing to ensure the quality of the job board. You&apos;ll get an email at <span className="text-white">{form.posterEmail}</span> once it&apos;s live, usually within 24 hours.
          </p>
          <button
            onClick={() => router.push("/jobs")}
            className="bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-8 py-3 hover:bg-accent/90 transition-colors"
          >
            Browse the Board
          </button>
        </div>
      )}
    </div>
  );
}
