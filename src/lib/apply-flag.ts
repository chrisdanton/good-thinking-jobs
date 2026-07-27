import { getSupabase } from "@/lib/supabase";
import { parseFlagNote } from "@/lib/flag-note";
import { cleanCompanyName } from "@/lib/extract-job";
import { sendFlagResult } from "@/lib/email";

// The "fix an existing job from a plain note" flow, shared by the /api/flag
// endpoint and the /api/share endpoint (which treats a share that carries a note
// as a fix rather than a new post). Resolving the job, applying the parsed patch,
// and emailing the confirmation all live here so both entry points behave
// identically.

export interface ApplyFlagResult {
  ok: boolean;
  status: number;
  message: string;
  id?: string;
  applied?: string[];
}

// A board job id looks like "job-1784997008475-mavs8" (or "sample-1"). Accept a
// raw id, a board URL that contains one, or fall back to matching an apply link.
export function jobIdFromUrl(raw: string): string | null {
  const s = (raw || "").trim();
  if (/^(?:job|sample)-[A-Za-z0-9-]+$/.test(s)) return s;
  const m = s.match(/\/jobs\/((?:job|sample)-[A-Za-z0-9-]+)/);
  return m ? m[1] : null;
}

export async function resolveJob(rawUrl: string) {
  const supabase = getSupabase();
  const id = jobIdFromUrl(rawUrl);
  if (id) {
    const { data } = await supabase.from("jobs").select("*").eq("id", id).limit(1);
    if (data?.[0]) return data[0];
  }
  // Not a board link — try to match the original apply URL.
  const url = (rawUrl || "").match(/https?:\/\/[^\s<>"')]+/)?.[0]?.replace(/[.,;)\]]+$/, "");
  if (url) {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("external_apply_url", url)
      .neq("status", "removed")
      .limit(1);
    if (data?.[0]) return data[0];
  }
  return null;
}

export async function applyFlag(rawUrl: string, note: string): Promise<ApplyFlagResult> {
  if (!note.trim()) {
    return {
      ok: false,
      status: 400,
      message: "Add a note saying what to fix (e.g. 'salary 166k-276k').",
    };
  }

  const job = await resolveJob(rawUrl);
  if (!job) {
    return { ok: false, status: 404, message: "Couldn't find that job on the board." };
  }

  const { patch, labels, leftover } = parseFlagNote(note);

  // Clean any Workday-style entity code off a company name typed in a hurry.
  if (typeof patch.company_name === "string") {
    patch.company_name = cleanCompanyName(patch.company_name);
  }

  const hasChanges = Object.keys(patch).length > 0;
  if (hasChanges) {
    const { error } = await getSupabase().from("jobs").update(patch).eq("id", job.id);
    if (error) {
      return { ok: false, status: 500, message: error.message };
    }
  }

  // Confirm by email (best-effort — a mail hiccup shouldn't fail the fix).
  try {
    await sendFlagResult({
      jobId: job.id as string,
      title: job.title as string,
      company: (patch.company_name as string) || (job.company_name as string),
      labels,
      leftover,
      removed: patch.status === "removed",
    });
  } catch (err) {
    console.error("Flag confirmation email failed:", err);
  }

  const summary = labels.length ? labels.join("; ") : "nothing auto-applied";
  const tail = leftover ? ` — noted for manual review: "${leftover}"` : "";
  return {
    ok: true,
    status: 200,
    id: job.id as string,
    applied: labels,
    message: hasChanges
      ? `Updated ${job.company_name}: ${summary}${tail}`
      : `Flagged ${job.company_name}${tail || " — I couldn't auto-apply that; check your email."}`,
  };
}
