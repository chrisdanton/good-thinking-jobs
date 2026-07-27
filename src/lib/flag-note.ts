import { DEPARTMENTS, LOCATION_TYPES, ROLE_LEVELS } from "@/lib/constants";

// Turning a plain-English "fix this" note (typed on a phone) into a concrete set
// of column updates for a job row. Kept deliberately deterministic — no LLM — so
// a flag can never mangle a listing into something the note didn't ask for, and
// so it can be unit-tested exhaustively. Anything it doesn't clearly understand
// is left in `leftover` for a human to read rather than guessed at.

export interface FlagPatch {
  salary_min?: number;
  salary_max?: number;
  company_name?: string;
  location?: string;
  location_type?: string;
  title?: string;
  role_level?: string;
  department?: string;
  status?: "removed";
}

export interface FlagParse {
  patch: FlagPatch;
  // Human-readable "what changed" lines, e.g. "Salary → $166K–$276K".
  labels: string[];
  // The parts of the note we couldn't turn into an update, trimmed of filler.
  leftover: string;
}

// Annual salaries are always in the thousands. A bare number under 1000 is
// therefore shorthand ("166" means 166,000), and a trailing k always multiplies.
// Anything outside a sane annual band is rejected so a stray number can't land in
// the salary field.
function toSalary(numRaw: string, kFlag: boolean): number | null {
  let n = parseFloat(numRaw.replace(/,/g, ""));
  if (!isFinite(n)) return null;
  if (kFlag) n *= 1000;
  else if (n < 1000) n *= 1000;
  n = Math.round(n);
  // Floor well above any real shorthand so a stray tiny number ("salary 9")
  // can't land in the field; no leadership role on this board pays under $10k.
  if (n < 10_000 || n > 5_000_000) return null;
  return n;
}

function fmtK(n: number): string {
  return `$${Math.round(n / 1000)}K`;
}

// Pulls up to two salary figures out of a segment that mentions pay.
function parseSalary(seg: string): { min: number; max: number } | null {
  const moneyRe = /\$?\s*(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(k)?/gi;
  const found: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = moneyRe.exec(seg)) && found.length < 2) {
    const val = toSalary(m[1], Boolean(m[2]));
    if (val !== null) found.push(val);
  }
  if (found.length === 0) return null;
  if (found.length === 1) return { min: found[0], max: 0 };
  const [a, b] = found;
  return { min: Math.min(a, b), max: Math.max(a, b) };
}

// Matches a value against one of our fixed lists, tolerating case and a few
// everyday synonyms. Returns the canonical list value or null.
function matchEnum(
  value: string,
  allowed: readonly string[],
  synonyms: Record<string, string> = {}
): string | null {
  const v = value.trim().toLowerCase();
  const syn = synonyms[v];
  if (syn) return syn;
  return allowed.find((a) => a.toLowerCase() === v) || null;
}

const LOCATION_TYPE_SYNONYMS: Record<string, string> = {
  onsite: "On-site",
  "on site": "On-site",
  "in office": "On-site",
  "in-office": "On-site",
};

const ROLE_LEVEL_SYNONYMS: Record<string, string> = {
  "c-suite": "C-Suite",
  csuite: "C-Suite",
  exec: "C-Suite",
  executive: "C-Suite",
  "vice president": "VP",
  senior: "Senior",
  mid: "Mid",
  "mid-level": "Mid",
  junior: "Entry",
  entry: "Entry",
};

// field-label → the column it writes and how to validate/normalise the value.
type FieldSpec = {
  column: keyof FlagPatch;
  label: string;
  normalise: (raw: string) => string | null;
};

const FIELD_SPECS: Record<string, FieldSpec> = {
  company: { column: "company_name", label: "Company", normalise: (v) => v || null },
  "company name": { column: "company_name", label: "Company", normalise: (v) => v || null },
  brand: { column: "company_name", label: "Company", normalise: (v) => v || null },
  location: { column: "location", label: "Location", normalise: (v) => v || null },
  city: { column: "location", label: "Location", normalise: (v) => v || null },
  title: { column: "title", label: "Title", normalise: (v) => v || null },
  role: { column: "title", label: "Title", normalise: (v) => v || null },
  type: {
    column: "location_type",
    label: "Location type",
    normalise: (v) => matchEnum(v, LOCATION_TYPES, LOCATION_TYPE_SYNONYMS),
  },
  "location type": {
    column: "location_type",
    label: "Location type",
    normalise: (v) => matchEnum(v, LOCATION_TYPES, LOCATION_TYPE_SYNONYMS),
  },
  level: {
    column: "role_level",
    label: "Level",
    normalise: (v) => matchEnum(v, ROLE_LEVELS, ROLE_LEVEL_SYNONYMS),
  },
  "role level": {
    column: "role_level",
    label: "Level",
    normalise: (v) => matchEnum(v, ROLE_LEVELS, ROLE_LEVEL_SYNONYMS),
  },
  seniority: {
    column: "role_level",
    label: "Level",
    normalise: (v) => matchEnum(v, ROLE_LEVELS, ROLE_LEVEL_SYNONYMS),
  },
  department: {
    column: "department",
    label: "Department",
    normalise: (v) => matchEnum(v, DEPARTMENTS),
  },
  dept: {
    column: "department",
    label: "Department",
    normalise: (v) => matchEnum(v, DEPARTMENTS),
  },
};

// Longest labels first so "company name" wins over "company".
const FIELD_LABELS = Object.keys(FIELD_SPECS).sort((a, b) => b.length - a.length);

// Strips connective filler between a field label and its value: "company should
// be X", "salary is X", "title: X", "location -> X".
function stripConnector(s: string): string {
  return s.replace(/^\s*(?:should be|shld be|should|is|are|to|:|=|->|→|the)\s+/i, "").trim();
}

const REMOVE_RE = /\b(remove|delete|unpublish|take (?:it|this)?\s*down|taken down|expired|filled)\b/i;
const SALARY_CONTEXT_RE = /(\bsalary\b|\bsalaries\b|\bpay\b|\bcomp(?:ensation)?\b|\bmakes?\b|\$)/i;

export function parseFlagNote(note: string): FlagParse {
  const patch: FlagPatch = {};
  const labels: string[] = [];
  const leftoverParts: string[] = [];

  const segments = String(note || "")
    .split(/[\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const seg of segments) {
    // 1) "take it down" — strongest, act on it and move on.
    if (REMOVE_RE.test(seg) && !SALARY_CONTEXT_RE.test(seg)) {
      patch.status = "removed";
      labels.push("Remove from board");
      continue;
    }

    // 2) A labelled field: "company: X", "location is Y", "level Director".
    let handled = false;
    for (const lbl of FIELD_LABELS) {
      const re = new RegExp(`(?:^|\\b)${lbl}\\b`, "i");
      const mm = re.exec(seg);
      if (!mm) continue;
      const rawValue = stripConnector(seg.slice(mm.index + mm[0].length))
        .replace(/^["'“”]+|["'“”.]+$/g, "")
        .trim();
      const spec = FIELD_SPECS[lbl];
      const value = spec.normalise(rawValue);
      if (value) {
        patch[spec.column] = value as never;
        labels.push(`${spec.label} → ${value}`);
        handled = true;
      }
      break;
    }
    if (handled) continue;

    // 3) A pay figure: "salary 166k-276k", "$166,000 to $276,000".
    if (SALARY_CONTEXT_RE.test(seg)) {
      const sal = parseSalary(seg);
      if (sal) {
        patch.salary_min = sal.min;
        patch.salary_max = sal.max;
        const shown = sal.max
          ? `${fmtK(sal.min)}–${fmtK(sal.max)}`
          : `From ${fmtK(sal.min)}`;
        labels.push(`Salary → ${shown}`);
        continue;
      }
    }

    // Understood nothing here — hand it to a human verbatim.
    leftoverParts.push(seg);
  }

  return { patch, labels, leftover: leftoverParts.join("; ") };
}
