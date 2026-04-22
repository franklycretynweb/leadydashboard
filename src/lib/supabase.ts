import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton dla client-side usage
let _client: ReturnType<typeof createClient> | null = null;
export function supabaseClient() {
  if (!_client) _client = getSupabase();
  return _client;
}
