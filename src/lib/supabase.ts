import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
    // Never let Next.js cache a database read. supabase-js queries go through
    // fetch(), which the App Router caches by default for any stable URL — so a
    // job detail read (a fixed URL) would keep serving the row as it looked the
    // first time it was fetched, even after the job is edited. Forcing no-store
    // on the client's fetch makes every query hit the live database.
    _client = createClient(url, key, {
      global: {
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
      },
    });
  }
  return _client;
}
