import { describe, it, expect } from "vitest";
import { clickThroughRate } from "@/lib/job-stats";

describe("clickThroughRate", () => {
  it("is apply clicks divided by views", () => {
    expect(clickThroughRate(100, 25)).toBe(0.25);
    expect(clickThroughRate(4, 1)).toBe(0.25);
  });

  it("returns 0 when there are no views (no divide-by-zero)", () => {
    expect(clickThroughRate(0, 0)).toBe(0);
    expect(clickThroughRate(0, 5)).toBe(0);
  });

  it("can exceed nothing weird when clicks outrun unique views", () => {
    // A visitor can click apply more than once; the rate just reflects the raw
    // ratio and should stay a finite number.
    expect(clickThroughRate(2, 3)).toBe(1.5);
  });
});
