"use client";

// Timezone picker for GOOD SESSIONS. Defaults to the visitor's own timezone,
// remembers their choice in this browser, and re-renders every session time.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const ZONES = [
  { label: "ET · New York", tz: "America/New_York" },
  { label: "CT · Chicago", tz: "America/Chicago" },
  { label: "MT · Denver", tz: "America/Denver" },
  { label: "PT · Los Angeles", tz: "America/Los_Angeles" },
  { label: "UK · London", tz: "Europe/London" },
  { label: "CET · Paris", tz: "Europe/Paris" },
  { label: "AET · Sydney", tz: "Australia/Sydney" },
];
const DEFAULT_TZ = "America/New_York";
const KEY = "gs-timezone";

const Ctx = createContext<{ tz: string; setTz: (tz: string) => void }>({ tz: DEFAULT_TZ, setTz: () => {} });

export function TimeZoneProvider({ children }: { children: ReactNode }) {
  const [tz, setTzState] = useState(DEFAULT_TZ);
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTzState(saved || local || DEFAULT_TZ);
  }, []);
  const setTz = (next: string) => {
    setTzState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  };
  return <Ctx.Provider value={{ tz, setTz }}>{children}</Ctx.Provider>;
}

const city = (tz: string) => tz.split("/").pop()!.replace(/_/g, " ");

export function TimeZonePicker() {
  const { tz, setTz } = useContext(Ctx);
  const known = ZONES.some((z) => z.tz === tz);
  return (
    <label className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]">
      <span>Times in</span>
      <span className="relative inline-flex items-center border-[1.5px]" style={{ background: "#000", color: "#fff", borderColor: "#000" }}>
        <select
          value={tz}
          onChange={(e) => setTz(e.target.value)}
          className="appearance-none py-1.5 pl-3 pr-8 text-[11px] font-bold uppercase tracking-[0.15em] outline-none"
          style={{ background: "transparent", color: "#fff" }}
          aria-label="Show session times in this timezone"
        >
          {!known && <option value={tz} style={{ color: "#000", background: "#fff" }}>Local · {city(tz)}</option>}
          {ZONES.map((z) => (
            <option key={z.tz} value={z.tz} style={{ color: "#000", background: "#fff" }}>
              {z.label}
            </option>
          ))}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-2.5">▾</span>
      </span>
    </label>
  );
}

// A session's start time in the chosen timezone, e.g. "9AM PST".
export function LocalTime({ iso }: { iso: string }) {
  const { tz } = useContext(Ctx);
  const d = new Date(iso);
  const time = d
    .toLocaleString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz })
    .replace(":00", "")
    .replace(" AM", "AM")
    .replace(" PM", "PM");
  // US names (EST/PST) from en-US; European ones (CET/GMT/BST) from en-GB.
  const zoneName = (locale: string) =>
    d.toLocaleString(locale, { timeZone: tz, timeZoneName: "short" }).split(" ").pop() || "";
  let zone = zoneName("en-US");
  if (zone.startsWith("GMT")) zone = zoneName("en-GB");
  return <span suppressHydrationWarning>{`${time} ${zone}`}</span>;
}
