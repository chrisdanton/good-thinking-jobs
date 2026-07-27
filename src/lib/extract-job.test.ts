import { describe, it, expect } from "vitest";
import { cleanCompanyName } from "@/lib/extract-job";

describe("cleanCompanyName", () => {
  it("strips a leading Workday numeric entity code", () => {
    // The bug Chris caught: LEGO importing as "1012 LEGO Systems, Inc."
    expect(cleanCompanyName("1012 LEGO Systems, Inc.")).toBe("LEGO Systems, Inc.");
    expect(cleanCompanyName("305 Nike Retail Services")).toBe("Nike Retail Services");
    expect(cleanCompanyName("40001 The Walt Disney Company")).toBe("The Walt Disney Company");
  });

  it("leaves clean company names untouched", () => {
    expect(cleanCompanyName("Starbucks Coffee Company")).toBe("Starbucks Coffee Company");
    expect(cleanCompanyName("The Ritz-Carlton Yacht Collection")).toBe(
      "The Ritz-Carlton Yacht Collection"
    );
    expect(cleanCompanyName("Apple")).toBe("Apple");
  });

  it("never eats a number that is genuinely part of the brand", () => {
    // No space after the number, or too few/many digits, so these stay intact.
    expect(cleanCompanyName("3M")).toBe("3M");
    expect(cleanCompanyName("23andMe")).toBe("23andMe");
    expect(cleanCompanyName("1-800-Flowers")).toBe("1-800-Flowers");
    expect(cleanCompanyName("7 For All Mankind")).toBe("7 For All Mankind");
  });

  it("normalises whitespace and trims", () => {
    expect(cleanCompanyName("  LEGO   Systems,  Inc.  ")).toBe("LEGO Systems, Inc.");
    expect(cleanCompanyName("1012  LEGO Systems")).toBe("LEGO Systems");
  });

  it("handles empty / missing input safely", () => {
    expect(cleanCompanyName("")).toBe("");
    // @ts-expect-error exercising the runtime guard for a missing value
    expect(cleanCompanyName(undefined)).toBe("");
  });
});
