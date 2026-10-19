"use client";

import { useState } from "react";

// Copies a bio to the clipboard, with a quick "Copied" confirmation.
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // Clipboard blocked: leave the text selectable on the page.
        }
      }}
      className="speaking-noprint border-2 border-black px-4 py-1.5 text-xs font-bold uppercase tracking-wide"
      style={{ background: copied ? "#F9FF00" : "transparent", color: "#000" }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
