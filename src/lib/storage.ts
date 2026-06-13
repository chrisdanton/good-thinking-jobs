import { Job, Application } from "./types";
import { seedJobs, seedApplications } from "./seed";

const JOBS_KEY = "gt_jobs";
const APPS_KEY = "gt_applications";
const SEEDED_KEY = "gt_seeded";
const SEED_VERSION = "4";

function isExpired(job: Job): boolean {
  return new Date(job.expiresAt) < new Date();
}

function ensureSeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY) === SEED_VERSION) return;
  localStorage.setItem(JOBS_KEY, JSON.stringify(seedJobs));
  localStorage.setItem(APPS_KEY, JSON.stringify(seedApplications));
  localStorage.setItem(SEEDED_KEY, SEED_VERSION);
}

// Jobs

export function getJobs(): Job[] {
  ensureSeeded();
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(JOBS_KEY);
  if (!raw) return [];
  const jobs: Job[] = JSON.parse(raw);
  return jobs.filter((j) => !isExpired(j) && j.status === "active");
}

export function getAllJobs(): Job[] {
  ensureSeeded();
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(JOBS_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export function getJob(id: string): Job | undefined {
  ensureSeeded();
  if (typeof window === "undefined") return undefined;
  const raw = localStorage.getItem(JOBS_KEY);
  if (!raw) return undefined;
  const jobs: Job[] = JSON.parse(raw);
  return jobs.find((j) => j.id === id);
}

export function addJob(job: Job): void {
  const jobs = getAllJobs();
  jobs.push(job);
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function updateJob(id: string, updates: Partial<Job>): void {
  const jobs = getAllJobs();
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return;
  jobs[idx] = { ...jobs[idx], ...updates };
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function removeJob(id: string): void {
  updateJob(id, { status: "removed" });
}

// Applications

export function getApplications(): Application[] {
  ensureSeeded();
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(APPS_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export function getApplicationsForJob(jobId: string): Application[] {
  return getApplications().filter((a) => a.jobId === jobId);
}

export function addApplication(app: Application): void {
  const apps = getApplications();
  apps.push(app);
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}
