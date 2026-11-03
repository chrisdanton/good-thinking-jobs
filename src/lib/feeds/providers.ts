// Employer feeds: read published roles from an ATS's PUBLIC job-board API and turn
// them into one shape. Only Greenhouse, Lever and Ashby. No scraping.
import type { Department, LocationType, RoleLevel } from "@/lib/types";
import filterConfig from "@/config/role-filter.json";

export type SourceType = "greenhouse" | "lever" | "ashby";

export interface NormalizedJob {
  externalId: string;
  title: string;
  company: string;
  location: string;
  locationType: LocationType;
  department: string; // the ATS's own department/team label
  description: string;
  sourceUrl: string;
  applyUrl: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  publishedAt?: string;
  updatedAt?: string;
}

// ── Careers URL → which ATS + its public identifier ──
export function detectSource(careersUrl: string): { sourceType: SourceType; identifier: string } | null {
  let u: URL;
  try {
    u = new URL(careersUrl.trim());
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase();
  const first = u.pathname.split("/").filter(Boolean)[0] || "";
  if (/(^|\.)greenhouse\.io$/.test(host)) {
    const forParam = u.searchParams.get("for");
    const id = forParam || (first === "embed" ? "" : first);
    return id ? { sourceType: "greenhouse", identifier: id } : null;
  }
  if (host === "jobs.lever.co" && first) return { sourceType: "lever", identifier: first };
  if (host === "jobs.eu.lever.co" && first) return { sourceType: "lever", identifier: `eu:${first}` };
  if (host === "jobs.ashbyhq.com" && first) return { sourceType: "ashby", identifier: first };
  return null;
}

// ── Mapping into GOOD JOBS fields ──
const has = (s: string, re: RegExp) => re.test(s.toLowerCase());

export function toDepartment(title: string, dept: string): Department {
  const s = `${title} ${dept}`;
  if (has(s, /\b(cmo|chief marketing|chief brand|chief creative)\b/)) return "Executive/C-Suite";
  if (has(s, /\bbrand\b/)) return "Brand";
  if (has(s, /\b(creative|design|art director|copywrit|copy)\b/)) return "Creative";
  if (has(s, /\bmedia\b/) && !has(s, /\bsocial media\b/)) return "Media";
  if (has(s, /\b(marketing|marketer|growth|communications|comms|social|content|pr|public relations|community|partnership|influencer|campaign)\b/)) return "Marketing";
  if (has(s, /\b(strateg|insight)/)) return "Strategy";
  return "Other";
}

export function toRoleLevel(title: string): RoleLevel {
  const t = title.toLowerCase();
  if (/\b(chief|cmo|cbo|cco)\b/.test(t)) return "C-Suite";
  if (/\b(svp|evp|vp|vice president)\b/.test(t)) return "VP";
  if (/\b(director|head of)\b/.test(t)) return "Director";
  if (/\b(senior|sr\.?|lead|principal|staff)\b/.test(t)) return "Senior";
  if (/\b(associate|coordinator|assistant|junior|jr\.?)\b/.test(t)) return "Entry";
  return "Mid";
}

function toLocationType(s: string | undefined | null, isRemote?: boolean): LocationType {
  const v = (s || "").toLowerCase();
  if (v.includes("hybrid")) return "Hybrid";
  if (v.includes("remote") || isRemote) return "Remote";
  return "On-site";
}

// ── Relevance filter (config in src/config/role-filter.json) ──
function termRegex(term: string) {
  const esc = term.trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${esc}($|[^a-z0-9])`, "i");
}
const INCLUDE = (filterConfig.include as string[]).map(termRegex);
const EXCLUDE = (filterConfig.exclude as string[]).map(termRegex);

export function isRelevant(title: string): boolean {
  const t = ` ${title} `;
  if (EXCLUDE.some((re) => re.test(t))) return false;
  return INCLUDE.some((re) => re.test(t));
}

// ── Fetchers ──
const strip = (html: string) =>
  (html || "")
    .replace(/<\/(p|li|h\d|div)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const decodeEntities = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} from ${new URL(url).hostname}`);
  return res.json();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function greenhouse(token: string, employer: string): Promise<NormalizedJob[]> {
  const d: any = await getJson(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs?content=true`);
  if (!d || !Array.isArray(d.jobs)) throw new Error("Greenhouse returned an unexpected response");
  return d.jobs.map((j: any) => ({
    externalId: String(j.id),
    title: String(j.title || "").trim(),
    company: j.company_name || employer,
    location: j.location?.name || "",
    locationType: toLocationType(j.location?.name),
    department: (j.departments || []).map((x: any) => String(x.name || "").trim()).filter(Boolean).join(", "),
    description: strip(decodeEntities(j.content || "")),
    sourceUrl: j.absolute_url,
    applyUrl: j.absolute_url,
    salaryMin: 0,
    salaryMax: 0,
    salaryCurrency: "",
    publishedAt: j.first_published || undefined,
    updatedAt: j.updated_at || undefined,
  }));
}

async function lever(identifier: string, employer: string): Promise<NormalizedJob[]> {
  const eu = identifier.startsWith("eu:");
  const site = eu ? identifier.slice(3) : identifier;
  const d: any = await getJson(`https://api${eu ? ".eu" : ""}.lever.co/v0/postings/${encodeURIComponent(site)}?mode=json`);
  if (!Array.isArray(d)) throw new Error("Lever returned an unexpected response");
  return d.map((j: any) => ({
    externalId: String(j.id),
    title: String(j.text || "").trim(),
    company: employer,
    location: j.categories?.location || (j.categories?.allLocations || []).join(", ") || "",
    locationType: toLocationType(j.workplaceType || j.categories?.location),
    department: [j.categories?.department, j.categories?.team].filter(Boolean).join(", "),
    description: [j.descriptionPlain, ...(j.lists || []).map((l: any) => `${l.text}\n${strip(l.content)}`), j.additionalPlain]
      .filter(Boolean)
      .join("\n\n")
      .trim(),
    sourceUrl: j.hostedUrl,
    applyUrl: j.applyUrl || j.hostedUrl,
    salaryMin: Math.round(Number(j.salaryRange?.min) || 0),
    salaryMax: Math.round(Number(j.salaryRange?.max) || 0),
    salaryCurrency: j.salaryRange?.currency || "",
    publishedAt: j.createdAt ? new Date(j.createdAt).toISOString() : undefined,
  }));
}

async function ashby(name: string, employer: string): Promise<NormalizedJob[]> {
  const d: any = await getJson(`https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(name)}?includeCompensation=true`);
  if (!d || !Array.isArray(d.jobs)) throw new Error("Ashby returned an unexpected response");
  return d.jobs
    .filter((j: any) => j.isListed !== false) // publicly listed roles only
    .map((j: any) => {
      const salary = (j.compensation?.summaryComponents || []).find((c: any) => c.compensationType === "Salary");
      return {
        externalId: String(j.id),
        title: String(j.title || "").trim(),
        company: employer,
        location: [j.location, ...(j.secondaryLocations || []).map((l: any) => l.location)].filter(Boolean).slice(0, 3).join(" · "),
        locationType: toLocationType(j.workplaceType, j.isRemote),
        department: [j.department, j.team].filter(Boolean).join(", "),
        description: j.descriptionPlain || strip(j.descriptionHtml || ""),
        sourceUrl: j.jobUrl,
        applyUrl: j.applyUrl || j.jobUrl,
        salaryMin: Math.round(Number(salary?.minValue) || 0),
        salaryMax: Math.round(Number(salary?.maxValue) || 0),
        salaryCurrency: salary?.currencyCode || "",
        publishedAt: j.publishedAt || undefined,
      };
    });
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Throws on any network/format problem, so a bad response can never close jobs.
export async function fetchFeed(sourceType: SourceType, identifier: string, employer: string): Promise<NormalizedJob[]> {
  const jobs =
    sourceType === "greenhouse" ? await greenhouse(identifier, employer)
    : sourceType === "lever" ? await lever(identifier, employer)
    : await ashby(identifier, employer);
  return jobs.filter((j) => j.externalId && j.title && /^https?:\/\//.test(j.applyUrl || ""));
}
