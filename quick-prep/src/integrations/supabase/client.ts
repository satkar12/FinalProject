import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zvokvsmekfanmtquwmxp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2b2t2c21la2Zhbm10cXV3bXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDA3MTksImV4cCI6MjA2ODUxNjcxOX0.INF__mn0VqxQJzBucmBfpDiQSBTXMuE-QZako6EMm-o";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
    }
});