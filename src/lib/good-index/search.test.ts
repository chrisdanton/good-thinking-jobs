import { existsSync } from "fs";
import { describe, expect, it } from "vitest";
import { FUTURE, SIGNS, relatedTo, searchArchive, tokens } from "./search";

// Needs the local (git-ignored) archive file; skipped where it isn't present.
const hasArchive = existsSync("src/data/good-index/passages.json");

describe.skipIf(!hasArchive)("GOOD INDEX search", () => {
  it("finds B2B passages, original text only", async () => {
    const r = await searchArchive("B2B");
    expect(r.length).toBeGreaterThan(3);
    expect(r[0].text.toLowerCase()).toContain("b2b");
    if (process.env.SHOW) r.slice(0, 4).forEach((p) => console.log(p.date, p.title, "|", p.text.slice(0, 140)));
  });
  it("stems simple plurals", () => {
    expect(tokens("Brands")).toEqual(tokens("brand"));
  });
  it("relates every anchor to something in the archive", async () => {
    for (const a of [...SIGNS, ...FUTURE["2026"]]) {
      const { before, after } = await relatedTo(a);
      if (process.env.SHOW) console.log(a.name, before.length, after.length, [...before, ...after].slice(0, 2).map((p) => p.text.slice(0, 80)));
      expect(before.length + after.length).toBeGreaterThan(0);
    }
  });
});
