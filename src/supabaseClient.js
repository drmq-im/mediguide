import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!envUrl || !envKey) {
  throw new Error("🚨 CRITICAL ERROR: Missing Supabase Environment Variables (.env)");
}

export const supabase = createClient(envUrl, envKey, {
  auth: {
    persistSession: true, // Giữ đăng nhập khi F5
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});