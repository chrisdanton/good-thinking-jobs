import { describe, expect, it } from "vitest";
import { icsFile, isPast, startDate, timeLabel, type Session } from "./sessions";

const s: Session = {
  slug: "t",
  title: "Test",
  date: "2026-11-19",
  time: "12:00",
  timezone: "America/New_York",
  description: "d",
  duration: 30,
  status: "upcoming",
};

describe("sessions", () => {
  it("converts New York noon to UTC (EST, -5)", () => {
    expect(startDate(s).toISOString()).toBe("2026-11-19T17:00:00.000Z");
  });
  it("handles daylight time (EDT, -4)", () => {
    expect(startDate({ ...s, date: "2026-07-01" }).toISOString()).toBe("2026-07-01T16:00:00.000Z");
  });
  it("labels time", () => {
    expect(timeLabel(s)).toBe("12PM EST");
  });
  it("rolls to past a day after it ends, or when marked", () => {
    expect(isPast(s, new Date("2026-11-19T20:00:00Z"))).toBe(false);
    expect(isPast(s, new Date("2026-11-21T00:00:00Z"))).toBe(true);
    expect(isPast({ ...s, status: "past" }, new Date("2026-11-01"))).toBe(true);
  });
  it("builds an ics file", () => {
    expect(icsFile(s)).toContain("DTSTART:20261119T170000Z");
  });
});
