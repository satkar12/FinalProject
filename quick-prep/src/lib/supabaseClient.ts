import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl) {
    throw new Error("❌ Supabase URL is required. Did you set VITE_SUPABASE_URL in .env?");
}
if (!supabaseAnonKey) {
    throw new Error("❌ Supabase anon key is required. Did you set VITE_SUPABASE_ANON_KEY in .env?");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
