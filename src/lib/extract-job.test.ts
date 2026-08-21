import { describe, it, expect } from "vitest";
import { cleanCompanyName, readableUrlFor, canonicalApplyUrl } from "@/lib/extract-job";

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

describe("Workday /apply links", () => {
  // The bug Chris caught: a PUMA link copied from the Apply button ended in
  // "/apply", which is a login-gated deep link. The CXS endpoint 406s on it, so
  // the job wouldn't load onto the board.
  const applyLink =
    "https://puma.wd502.myworkdayjobs.com/Jobs_at_Puma/job/PUMA-Way-Headquarters/Director-Strategic-Insights_R42875-1/apply";
  const posting =
    "https://puma.wd502.myworkdayjobs.com/Jobs_at_Puma/job/PUMA-Way-Headquarters/Director-Strategic-Insights_R42875-1";

  it("strips /apply before building the CXS fetch URL", () => {
    expect(readableUrlFor(applyLink)).toBe(
      "https://puma.wd502.myworkdayjobs.com/wday/cxs/puma/Jobs_at_Puma/job/PUMA-Way-Headquarters/Director-Strategic-Insights_R42875-1",
    );
  });

  it("also strips deeper apply sub-steps", () => {
    expect(readableUrlFor(applyLink + "/autofillWithResume")).toBe(
      "https://puma.wd502.myworkdayjobs.com/wday/cxs/puma/Jobs_at_Puma/job/PUMA-Way-Headquarters/Director-Strategic-Insights_R42875-1",
    );
  });

  it("saves the posting URL, not the /apply deep link, as the apply link", () => {
    expect(canonicalApplyUrl(applyLink)).toBe(posting);
  });

  it("leaves a normal posting URL untouched", () => {
    expect(canonicalApplyUrl(posting)).toBe(posting);
    expect(canonicalApplyUrl("https://example.com/careers/123")).toBe(
      "https://example.com/careers/123",
    );
  });
});
