import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function getSupabase(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

let _client: SupabaseClient | null = null;
export function supabaseClient(): SupabaseClient {
  if (!_client) _client = getSupabase();
  return _client;
}
