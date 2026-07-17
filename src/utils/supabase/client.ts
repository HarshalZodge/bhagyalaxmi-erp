import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export function createClient() {
  if (!isSupabaseConfigured) {
    if (typeof window !== "undefined") {
      console.warn("Bhagyalaxmi ERP: Supabase credentials not found in environment variables. Falling back to local Sandbox Mode.");
    }
  }
  
  return createBrowserClient(
    supabaseUrl || "https://mock.supabase.co",
    supabaseAnonKey || "mock-anon-key"
  );
}
