// The sync decision, kept pure (no database) so it can be tested.
//
// Given what's already imported for one employer and what their feed shows now:
//   - new relevant roles  → insert (live if the employer auto-publishes, else review queue)
//   - roles still listed  → refresh, reset their miss counter
//   - roles gone missing  → 1st successful sync without them: "possibly closed" (still live)
//                           2nd successful sync without them: closed and taken off the board
//   - closed roles that reappear → reopened
//   - excluded roles      → never touched again
// A failed or suspicious fetch never reaches this function, so it can't close anything.
import type { NormalizedJob } from "./providers";
import { isRelevant } from "./providers";

export const MISSES_TO_CLOSE = 2;

export interface ImportedRow {
  id: string;
  external_job_id: string;
  import_status: "active" | "possibly_closed" | "closed" | "excluded" | "";
  missed_syncs: number;
  status: string;
  manual_override?: boolean;
}

export interface Plan {
  insert: NormalizedJob[];
  seen: { row: ImportedRow; job: NormalizedJob; reopen: boolean }[];
  missed: { row: ImportedRow; close: boolean }[];
  skippedIrrelevant: number;
}

export function planSync(existing: ImportedRow[], feed: NormalizedJob[]): Plan {
  const byExt = new Map(existing.map((r) => [r.external_job_id, r]));
  const inFeed = new Set(feed.map((j) => j.externalId));
  const plan: Plan = { insert: [], seen: [], missed: [], skippedIrrelevant: 0 };

  for (const job of feed) {
    const row = byExt.get(job.externalId);
    if (row) {
      if (row.import_status === "excluded") continue;
      plan.seen.push({ row, job, reopen: row.import_status === "closed" });
    } else if (isRelevant(job.title)) {
      plan.insert.push(job);
    } else {
      plan.skippedIrrelevant++;
    }
  }

  for (const row of existing) {
    if (inFeed.has(row.external_job_id)) continue;
    if (row.import_status !== "active" && row.import_status !== "possibly_closed") continue;
    plan.missed.push({ row, close: (row.missed_syncs || 0) + 1 >= MISSES_TO_CLOSE });
  }
  return plan;
}

// A feed that suddenly comes back empty when we had live roles is more likely an
// ATS hiccup than every role closing at once. Treat it like a failed sync.
export function looksSuspiciouslyEmpty(existing: ImportedRow[], feed: NormalizedJob[]): boolean {
  const live = existing.filter((r) => r.import_status === "active" || r.import_status === "possibly_closed").length;
  return feed.length === 0 && live > 0;
}
