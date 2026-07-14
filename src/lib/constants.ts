import { Department, LocationType, RoleLevel, Tier } from "./types";

export const DEPARTMENTS: Department[] = [
  "Marketing",
  "Brand",
  "Creative",
  "Strategy",
  "Media",
  "Operations",
  "Executive/C-Suite",
  "Other",
];

export const LOCATION_TYPES: LocationType[] = ["Remote", "Hybrid", "On-site"];

export const ROLE_LEVELS: RoleLevel[] = [
  "Entry",
  "Mid",
  "Senior",
  "Director",
  "VP",
  "C-Suite",
];

export const TIERS = {
  free: {
    name: "Free",
    price: 0,
    salaryLabel: "Under $100K",
    features: ["Listed on job board", "30-day listing"],
  },
  standard: {
    name: "Standard",
    price: 75,
    salaryLabel: "$100K – $200K",
    features: ["Listed on job board", "Priority placement", "30-day listing"],
  },
  premium: {
    name: "Premium",
    price: 350,
    salaryLabel: "$200K+ / C-Suite",
    features: [
      "Listed on job board",
      "Featured in newsletter (17K subscribers)",
      "Pinned to top of the board",
      '"Featured" badge & highlight',
      "30-day listing",
    ],
  },
} as const;

// Salary band each tier is meant for (US dollars). These mirror the salaryLabel
// shown on the plan cards and are enforced when a job is posted.
//   Free      → under $100K
//   Standard  → $100K to $200K
//   Premium   → $200K and up (no ceiling)
export const TIER_SALARY_BANDS: Record<Tier, { min: number; max: number | null }> = {
  free: { min: 0, max: 100000 },
  standard: { min: 100000, max: 200000 },
  premium: { min: 200000, max: null },
};

// Returns a human-readable error if the salary range doesn't fit the tier, else null.
export function validateSalaryForTier(tier: Tier, min: number, max: number): string | null {
  if (!min || !max || min <= 0 || max <= 0) return "Enter a salary range.";
  if (min > max) return "Salary min can't be higher than max.";

  if (tier === "free" && max >= 100000) {
    return "The Free tier is for roles under $100K. For $100K and up, choose Standard ($100K–$200K) or Premium ($200K+).";
  }
  if (tier === "standard" && min < 100000) {
    return "The Standard tier is for $100K–$200K roles. For roles under $100K, use the Free tier.";
  }
  if (tier === "standard" && max > 200000) {
    return "The Standard tier caps at $200K. For $200K and up, choose Premium.";
  }
  if (tier === "premium" && min < 200000) {
    return "The Premium tier is for $200K+ roles. For lower salaries, choose Free (under $100K) or Standard ($100K–$200K).";
  }
  return null;
}

export const EXPIRY_DAYS = 30;

// Curated jobs (ones GOOD THINKING sources and posts itself, not paid submissions)
// are tagged by this poster name so the board can label them and route "Apply" to
// the original listing. They also run longer before expiring, since re-curating is
// manual work.
export const CURATED_POSTER_NAME = "GOOD THINKING";
export const CURATED_POSTER_EMAIL = "goodjobs@weareingoodco.com";
export const CURATED_EXPIRY_DAYS = 60;

export function isCuratedJob(job: { posterName?: string }): boolean {
  return job.posterName === CURATED_POSTER_NAME;
}

// Launch promo: every listing (all tiers) is comped (free) through this date.
// Ends end-of-day June 23, 2026 (midnight ET June 24).
export const PROMO_END = new Date("2026-06-24T04:00:00Z");

export function isPromoActive(): boolean {
  return new Date() < PROMO_END;
}

export const PROMO_LABEL = "Launch offer: all plans are free through June 23.";

// Referral codes comp a paid listing (skip Stripe) once the launch promo ends.
// Hand a code to a brand and their listing posts free. Set the valid codes in the
// REFERRAL_CODES environment variable as a comma-separated list, e.g.
// "CODE1,CODE2". Codes are case-insensitive. This runs server-side only,
// so the list is never exposed to the browser and the code can't be bypassed.
export function isValidReferralCode(code: string | null | undefined): boolean {
  if (!code) return false;
  const valid = (process.env.REFERRAL_CODES || "")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
  return valid.includes(code.trim().toLowerCase());
}
