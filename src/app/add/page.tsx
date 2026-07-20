"use client";

import { useState, useEffect } from "react";

// A one-field page for adding a job from a phone.
//
// The iOS share-sheet Shortcut is the fastest route, but it takes a dozen taps
// to build first. This needs no setup: save it to the home screen, paste a link,
// press one button. Both paths post to the same /api/share endpoint.
//
// The share token is entered once and kept in localStorage so the page is ready
// to use on every later visit.

const TOKEN_KEY = "gt-share-token";

export default function AddPage() {
  const [token, setToken] = useState("");
  const [savedToken, setSavedToken] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) setSavedToken(t);
  }, []);

  function saveToken() {
    const t = token.trim();
    if (!t) return;
    localStorage.setItem(TOKEN_KEY, t);
    setSavedToken(t);
    setToken("");
  }

  function forgetToken() {
    localStorage.removeItem(TOKEN_KEY);
    setSavedToken("");
    setStatus("idle");
    setMessage("");
  }

  async function submit() {
    const link = url.trim();
    if (!link) return;

    setStatus("working");
    setMessage("Reading the posting…");

    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: savedToken, url: link }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("ok");
        setMessage(data.message || "Posted.");
        setUrl("");
      } else {
        setStatus("error");
        setMessage(data.message || "That didn't work.");
      }
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the board. Check your connection and try again.");
    }
  }

  // Nothing works without the token, so that's the whole page until it's set.
  if (!savedToken) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="font-headline text-3xl font-bold mb-3">Add a job</h1>
        <p className="text-muted text-sm leading-relaxed mb-8 font-secondary">
          Paste your share token once. It stays on this phone so you only do this the first time.
        </p>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          type="password"
          autoComplete="off"
          placeholder="Share token"
          className="w-full border border-white/20 bg-transparent px-4 py-4 text-base mb-4"
        />
        <button
          onClick={saveToken}
          disabled={!token.trim()}
          className="w-full bg-accent text-black font-headline font-bold uppercase tracking-wider px-6 py-4 text-base disabled:opacity-40"
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h1 className="font-headline text-3xl font-bold mb-3">Add a job</h1>
      <p className="text-muted text-sm leading-relaxed mb-8 font-secondary">
        Paste a job link. It reads the posting and puts it on the board straight away, in the company&rsquo;s own words.
      </p>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        type="url"
        inputMode="url"
        autoCapitalize="off"
        autoCorrect="off"
        placeholder="Paste job link"
        className="w-full border border-white/20 bg-transparent px-4 py-4 text-base mb-4"
      />

      <button
        onClick={submit}
        disabled={status === "working" || !url.trim()}
        className="w-full bg-accent text-black font-headline font-bold uppercase tracking-wider px-6 py-5 text-base disabled:opacity-40"
      >
        {status === "working" ? "Adding…" : "Add to board"}
      </button>

      {message && (
        <div
          className={`mt-6 p-4 text-sm leading-relaxed font-secondary border ${
            status === "ok"
              ? "border-green-500/40 text-green-400"
              : status === "error"
              ? "border-red-500/40 text-red-400"
              : "border-white/15 text-muted"
          }`}
        >
          {message}
        </div>
      )}

      {status === "ok" && (
        <a
          href="/jobs"
          className="block text-center mt-4 text-sm text-muted underline underline-offset-4"
        >
          See it on the board
        </a>
      )}

      <p className="text-muted text-xs leading-relaxed mt-12 font-secondary border-t border-white/10 pt-6">
        Tip: in Safari, tap the share icon and choose &ldquo;Add to Home Screen&rdquo; to keep this one tap away.
        <br />
        <br />
        <button onClick={forgetToken} className="underline underline-offset-2">
          Forget token on this device
        </button>
      </p>
    </div>
  );
}
