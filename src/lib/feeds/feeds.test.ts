import { describe, expect, it } from "vitest";
import { detectSource, isRelevant, toDepartment, toRoleLevel, type NormalizedJob } from "./providers";
import { looksSuspiciouslyEmpty, planSync, type ImportedRow } from "./plan";

const job = (id: string, title = "Brand Director"): NormalizedJob => ({
  externalId: id,
  title,
  company: "Acme",
  location: "New York",
  locationType: "Hybrid",
  department: "Brand",
  description: "",
  sourceUrl: `https://x/${id}`,
  applyUrl: `https://x/${id}/apply`,
  salaryMin: 0,
  salaryMax: 0,
  salaryCurrency: "",
});
const row = (ext: string, import_status: ImportedRow["import_status"] = "active", missed_syncs = 0): ImportedRow => ({
  id: `job-${ext}`,
  external_job_id: ext,
  import_status,
  missed_syncs,
  status: "active",
});

describe("detectSource", () => {
  it("reads Greenhouse, Lever (incl. EU) and Ashby URLs", () => {
    expect(detectSource("https://boards.greenhouse.io/glossier")).toEqual({ sourceType: "greenhouse", identifier: "glossier" });
    expect(detectSource("https://job-boards.greenhouse.io/glossier/jobs/123")).toEqual({ sourceType: "greenhouse", identifier: "glossier" });
    expect(detectSource("https://boards.greenhouse.io/embed/job_board?for=acme")).toEqual({ sourceType: "greenhouse", identifier: "acme" });
    expect(detectSource("https://jobs.lever.co/spotify")).toEqual({ sourceType: "lever", identifier: "spotify" });
    expect(detectSource("https://jobs.eu.lever.co/acme/123")).toEqual({ sourceType: "lever", identifier: "eu:acme" });
    expect(detectSource("https://jobs.ashbyhq.com/ramp")).toEqual({ sourceType: "ashby", identifier: "ramp" });
    expect(detectSource("https://acme.com/careers")).toBeNull();
  });
});

describe("role filter", () => {
  it("keeps brand/marketing/creative roles and drops the rest", () => {
    expect(isRelevant("Brand Design Lead")).toBe(true);
    expect(isRelevant("Senior Manager, Growth Marketing")).toBe(true);
    expect(isRelevant("Chief Marketing Officer")).toBe(true);
    expect(isRelevant("Head of Communications")).toBe(true);
    expect(isRelevant("Account Executive - Commercial")).toBe(false);
    expect(isRelevant("Senior Software Engineer")).toBe(false);
    expect(isRelevant("Marketing Engineer")).toBe(false); // exclude wins
    expect(isRelevant("Brand Protection Analyst")).toBe(false);
    expect(isRelevant("Product Designer")).toBe(false);
  });
  it("maps to existing categories and levels", () => {
    expect(toDepartment("Brand Design Lead", "Brand")).toBe("Brand");
    expect(toDepartment("Chief Marketing Officer", "")).toBe("Executive/C-Suite");
    expect(toDepartment("Social Media Manager", "Marketing")).toBe("Marketing");
    expect(toRoleLevel("VP, Brand Marketing")).toBe("VP");
    expect(toRoleLevel("Head of Content")).toBe("Director");
    expect(toRoleLevel("Marketing Coordinator")).toBe("Entry");
  });
});

describe("planSync: dedupe and safe closing", () => {
  it("inserts only new relevant roles, never duplicates", () => {
    const p = planSync([row("1")], [job("1"), job("2"), job("3", "Software Engineer")]);
    expect(p.insert.map((j) => j.externalId)).toEqual(["2"]);
    expect(p.seen.map((s) => s.row.external_job_id)).toEqual(["1"]);
    expect(p.skippedIrrelevant).toBe(1);
  });
  it("closes a role only after two successful syncs without it", () => {
    let p = planSync([row("1")], [job("2")]);
    expect(p.missed).toEqual([{ row: row("1"), close: false }]); // 1st miss: possibly closed, still live
    p = planSync([row("1", "possibly_closed", 1)], [job("2")]);
    expect(p.missed[0].close).toBe(true); // 2nd miss: closed
  });
  it("brings back a possibly-closed role that reappears, and reopens a closed one", () => {
    const p = planSync([row("1", "possibly_closed", 1), row("2", "closed", 2)], [job("1"), job("2")]);
    expect(p.seen.map((s) => [s.row.external_job_id, s.reopen])).toEqual([["1", false], ["2", true]]);
    expect(p.missed).toEqual([]);
  });
  it("never touches an excluded role", () => {
    const p = planSync([row("1", "excluded")], [job("1")]);
    expect(p.seen).toEqual([]);
    expect(p.insert).toEqual([]);
    expect(planSync([row("1", "excluded")], []).missed).toEqual([]);
  });
  it("treats a sudden empty feed as suspicious, not as everything closing", () => {
    expect(looksSuspiciouslyEmpty([row("1")], [])).toBe(true);
    expect(looksSuspiciouslyEmpty([], [])).toBe(false);
  });
});

// Live check against real public boards. Run with: LIVE_FEEDS=1 npx vitest run src/lib/feeds
describe.skipIf(!process.env.LIVE_FEEDS)("live feeds (dry run, nothing saved)", () => {
  it.each([
    ["greenhouse", "glossier", "Glossier"],
    ["lever", "spotify", "Spotify"],
    ["ashby", "ramp", "Ramp"],
    ["ashby", "notion", "Notion"],
  ] as const)("%s / %s", async (type, id, name) => {
    const { fetchFeed } = await import("./providers");
    const all = await fetchFeed(type, id, name);
    const keep = all.filter((j) => isRelevant(j.title));
    console.log(`${name} (${type}): ${all.length} roles, ${keep.length} relevant\n  ` + keep.map((j) => `${j.title} · ${j.location} · ${toDepartment(j.title, j.department)}/${toRoleLevel(j.title)}${j.salaryMax ? ` · $${j.salaryMin}-${j.salaryMax}` : ""}`).join("\n  "));
    expect(all.length).toBeGreaterThan(0);
  }, 30000);
});
