import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

// The job page itself renders in the browser, so on its own a removed job
// answers "200 OK" with a "Job not found" message, which Google flags as a
// soft 404. Check the job exists here first so a missing one returns a real 404.
export const dynamic = "force-dynamic";

export default async function JobLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { data } = await getSupabase()
    .from("jobs")
    .select("id")
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();

  return children;
}
