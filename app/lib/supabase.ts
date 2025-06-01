import { createClient } from '@supabase/supabase-js'

declare global {
  interface Window {
    ENV: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    };
  }
}

const supabaseUrl = typeof window !== 'undefined' 
  ? window.ENV.SUPABASE_URL 
  : process.env.SUPABASE_URL!

const supabaseAnonKey = typeof window !== 'undefined' 
  ? window.ENV.SUPABASE_ANON_KEY 
  : process.env.SUPABASE_ANON_KEY!


export const supabase = createClient(supabaseUrl, supabaseAnonKey)