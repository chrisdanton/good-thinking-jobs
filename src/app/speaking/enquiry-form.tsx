"use client";

import { useState } from "react";

// Booking enquiry form for /speaking. Posts to /api/speaking-enquiry, which
// emails hello@. Colors are inline so the site theme toggle can't change them.

const TOPICS = ["Keynote", "Workshop", "Host a dinner", "Press & media", "Something else"];

const inputClass = "mt-1.5 w-full border-[1.5px] border-black px-3 py-2.5 text-[15px] font-normal normal-case tracking-normal outline-none focus:bg-[#FFFFE0]";
const inputStyle = { background: "#fff", color: "#000", borderRadius: 0 };
const labelClass = "block text-xs font-bold uppercase tracking-[0.12em]";

export default function EnquiryForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/speaking-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.message || "Something went wrong.");
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="py-10 text-center">
        <p className="speaking-display text-4xl">Got it. Thank you.</p>
        <p className="mt-3 text-base">We&apos;ll be in touch within a couple of days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Name
          <input name="name" type="text" autoComplete="name" required className={inputClass} style={inputStyle} />
        </label>
        <label className={labelClass}>
          Email
          <input name="email" type="email" autoComplete="email" required className={inputClass} style={inputStyle} />
        </label>
        <label className={labelClass}>
          Company <span className="font-normal normal-case tracking-normal" style={{ color: "#777" }}>(optional)</span>
          <input name="company" type="text" autoComplete="organization" className={inputClass} style={inputStyle} />
        </label>
        <label className={labelClass}>
          What&apos;s it about?
          <select name="topic" defaultValue="Keynote" className={inputClass} style={inputStyle}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className={labelClass}>
        When &amp; where <span className="font-normal normal-case tracking-normal" style={{ color: "#777" }}>(optional)</span>
        <input name="when" type="text" placeholder="e.g. March 2027, Los Angeles" className={inputClass} style={inputStyle} />
      </label>
      <label className={labelClass}>
        Message
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Tell us about the room: who's in it, and what you want them to walk out with."
          className={inputClass}
          style={inputStyle}
        />
      </label>
      {/* Honeypot: hidden from people, filled in by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state === "error" && (
        <p className="text-sm font-semibold" style={{ color: "#c00" }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="border-[1.5px] border-black px-8 py-4 text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        style={{ background: "#000", color: "#fff" }}
      >
        {state === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
