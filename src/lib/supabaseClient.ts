import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Otechy MW] Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "to your .env file (local) or your host's environment variables (production), then restart/redeploy."
  );
}

// IMPORTANT: createClient() throws immediately if given an empty URL/key.
// That throw used to happen at module-import time, which crashed every page
// that (even indirectly) imports this file, with no way to catch it.
// We only ever call createClient() with a real-looking URL, so the client
// is either a working SupabaseClient or `null` — it can never throw here.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
