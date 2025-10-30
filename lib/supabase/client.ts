import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Centralized browser Supabase client using public env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;


