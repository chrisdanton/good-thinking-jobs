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

// Launch promo: every listing (all tiers) is comped (free) through this date.
// Ends end-of-day June 23, 2026 (midnight ET June 24).
export const PROMO_END = new Date("2026-06-24T04:00:00Z");

export function isPromoActive(): boolean {
  return new Date() < PROMO_END;
}

export const PROMO_LABEL = "Launch offer: all plans are free through June 23.";
