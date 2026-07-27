import { describe, it, expect } from "vitest";
import { parseFlagNote } from "@/lib/flag-note";

describe("parseFlagNote — salary", () => {
  it("reads a two-ended range with k shorthand", () => {
    const r = parseFlagNote("salary 166k-276k");
    expect(r.patch).toEqual({ salary_min: 166000, salary_max: 276000 });
    expect(r.labels).toEqual(["Salary → $166K–$276K"]);
    expect(r.leftover).toBe("");
  });

  it("reads full numbers with commas and 'to'", () => {
    const r = parseFlagNote("the pay is $166,000 to $276,000");
    expect(r.patch).toEqual({ salary_min: 166000, salary_max: 276000 });
  });

  it("treats bare sub-1000 numbers as thousands", () => {
    const r = parseFlagNote("salary 166-276");
    expect(r.patch).toEqual({ salary_min: 166000, salary_max: 276000 });
  });

  it("handles a single figure as a floor", () => {
    const r = parseFlagNote("salary 200000");
    expect(r.patch).toEqual({ salary_min: 200000, salary_max: 0 });
    expect(r.labels).toEqual(["Salary → From $200K"]);
  });

  it("orders min/max regardless of input order", () => {
    const r = parseFlagNote("pay $276k then $166k");
    expect(r.patch).toEqual({ salary_min: 166000, salary_max: 276000 });
  });

  it("rejects an implausible figure rather than storing garbage", () => {
    const r = parseFlagNote("salary 9");
    expect(r.patch.salary_min).toBeUndefined();
    expect(r.leftover).toBe("salary 9");
  });
});

describe("parseFlagNote — labelled fields", () => {
  it("sets company name and keeps it verbatim", () => {
    const r = parseFlagNote("company should be The Ritz-Carlton Yacht Collection");
    expect(r.patch).toEqual({ company_name: "The Ritz-Carlton Yacht Collection" });
    expect(r.labels).toEqual(["Company → The Ritz-Carlton Yacht Collection"]);
  });

  it("keeps a comma inside a location value", () => {
    const r = parseFlagNote("location: New York, NY");
    expect(r.patch).toEqual({ location: "New York, NY" });
  });

  it("normalises a location type synonym", () => {
    expect(parseFlagNote("type onsite").patch).toEqual({ location_type: "On-site" });
    expect(parseFlagNote("location type: hybrid").patch).toEqual({ location_type: "Hybrid" });
  });

  it("normalises a level synonym", () => {
    expect(parseFlagNote("level exec").patch).toEqual({ role_level: "C-Suite" });
    expect(parseFlagNote("seniority: Director").patch).toEqual({ role_level: "Director" });
  });

  it("validates department against the allowed list", () => {
    expect(parseFlagNote("department: Brand").patch).toEqual({ department: "Brand" });
    const bad = parseFlagNote("department: Underwater Basketry");
    expect(bad.patch.department).toBeUndefined();
    expect(bad.leftover).toContain("Underwater Basketry");
  });

  it("prefers the longer label ('company name' over 'company')", () => {
    const r = parseFlagNote("company name: Patagonia");
    expect(r.patch).toEqual({ company_name: "Patagonia" });
  });
});

describe("parseFlagNote — removal and mixed notes", () => {
  it("flags a takedown", () => {
    expect(parseFlagNote("take it down, this role is filled").patch).toEqual({ status: "removed" });
    expect(parseFlagNote("please remove").patch).toEqual({ status: "removed" });
  });

  it("handles multiple directives across lines", () => {
    const r = parseFlagNote("salary 166k-276k\ncompany: LEGO");
    expect(r.patch).toEqual({
      salary_min: 166000,
      salary_max: 276000,
      company_name: "LEGO",
    });
    expect(r.labels.length).toBe(2);
  });

  it("passes an unparseable note through to leftover, unchanged patch", () => {
    const r = parseFlagNote("this logo looks squished on mobile");
    expect(r.patch).toEqual({});
    expect(r.leftover).toBe("this logo looks squished on mobile");
  });

  it("does not confuse a salary that names a company keyword", () => {
    // "comp" is a salary context word; make sure it still reads the numbers.
    const r = parseFlagNote("comp is 150k to 190k");
    expect(r.patch).toEqual({ salary_min: 150000, salary_max: 190000 });
  });
});
