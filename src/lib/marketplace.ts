// Jobs, Projects and Asks: three kinds of listing on one board, one table.
//
//   job      permanent or fractional roles
//   project  finite paid work: freelance, contract, interim, project-based
//   ask      not employment: a sponsor, speaker, partner, venue, collaborator, intro
//
// Rule: hiring a person for paid work → job or project. Needing a partner,
// participant, sponsor, connection or opportunity → ask.
//
// All three live in the existing `jobs` table, told apart by `marketplace_type`
// (see supabase-marketplace.sql). Rows from before that column existed are jobs.

export type MarketplaceType = "job" | "project" | "ask";
export type AskType = "sponsor" | "speaker" | "partner" | "venue" | "collaborator" | "introduction" | "other";

export const MARKETPLACE_TYPES: { type: MarketplaceType; label: string; param: string; noun: string }[] = [
  { type: "job", label: "Jobs", param: "jobs", noun: "job" },
  { type: "project", label: "Projects", param: "projects", noun: "project" },
  { type: "ask", label: "Asks", param: "asks", noun: "ask" },
];

export const ASK_TYPES: { type: AskType; label: string }[] = [
  { type: "sponsor", label: "Sponsor" },
  { type: "speaker", label: "Speaker" },
  { type: "partner", label: "Partner" },
  { type: "venue", label: "Venue" },
  { type: "collaborator", label: "Collaborator" },
  { type: "introduction", label: "Introduction" },
  { type: "other", label: "Other" },
];

// Asks expire on their own after this many days. Admin can renew.
export const ASK_EXPIRY_DAYS = 30;

export function typeFromParam(p: string | null | undefined): MarketplaceType {
  return MARKETPLACE_TYPES.find((t) => t.param === p || t.type === p)?.type ?? "job";
}

export function paramForType(t: MarketplaceType): string {
  return MARKETPLACE_TYPES.find((m) => m.type === t)?.param ?? "jobs";
}

export function isAskType(v: unknown): v is AskType {
  return ASK_TYPES.some((a) => a.type === v);
}

// Extra fields read from a `jobs` row. Missing columns (before the SQL is run) read as a job.
export function marketplaceFields(row: Record<string, unknown>) {
  const t = row.marketplace_type;
  return {
    marketplaceType: (t === "project" || t === "ask" ? t : "job") as MarketplaceType,
    askType: (isAskType(row.ask_type) ? row.ask_type : undefined) as AskType | undefined,
    eventDate: (row.event_date as string) || undefined,
  };
}

// True when an insert failed only because the marketplace columns don't exist yet.
export function missingMarketplaceColumns(message: string | undefined) {
  return /marketplace_type|ask_type|event_date/i.test(message || "");
}
