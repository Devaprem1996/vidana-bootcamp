import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
// If not set, fall back to hardcoded values for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xksltuctylynthdhfuga.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrc2x0dWN0eWx5bnRoZGhmdWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDA2NjAsImV4cCI6MjA3OTgxNjY2MH0.Ys2FWYVCYB9pEPsLkyycPo8xhlMtWrM3iFSbrxxf0_0';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials are missing. Please check your .env.local file or lib/supabaseClient.ts');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);