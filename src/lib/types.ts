export type Department =
  | "Marketing"
  | "Brand"
  | "Creative"
  | "Strategy"
  | "Media"
  | "Operations"
  | "Executive/C-Suite"
  | "Other";

export type LocationType = "Remote" | "Hybrid" | "On-site";

export type RoleLevel = "Entry" | "Mid" | "Senior" | "Director" | "VP" | "C-Suite";

export type Tier = "free" | "standard" | "premium";

export type JobStatus = "awaiting_payment" | "pending" | "active" | "rejected" | "removed" | "expired";

export type ApplicationStatus = "new" | "reviewed" | "archived";

export interface Job {
  id: string;
  posterName: string;
  posterEmail: string;
  companyName: string;
  companyLogo: string;
  companyWebsite: string;
  title: string;
  department: Department;
  location: string;
  locationType: LocationType;
  roleLevel: RoleLevel;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string;
  externalApplyUrl: string;
  tier: Tier;
  status: JobStatus;
  flaggedForNewsletter: boolean;
  approvalToken: string;
  createdAt: string;
  expiresAt: string;
  referralCode?: string;
}

export interface Application {
  id: string;
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantLinkedIn: string;
  resumeFileName: string;
  coverNote: string;
  status: ApplicationStatus;
  createdAt: string;
}
