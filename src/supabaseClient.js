import { createClient } from '@supabase/supabase-js';

// Support both VITE_ (for old React SPA) and NEXT_PUBLIC_ (for Next.js) prefixes
const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) 
  || (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL)
  || 'https://xanrkptipcdhvklrvcia.supabase.co';

const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) 
  || (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbnJrcHRpcGNkaHZrbHJ2Y2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNzc0NzgsImV4cCI6MjA3MzY1MzQ3OH0.MYsMX0bVG9s20samitbTLzhvAVuZBMDEWtVqJJ2Pc0g';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
