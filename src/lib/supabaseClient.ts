import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://eoqdgkshvcntuznyyqqs.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcWRna3NodmNudHV6bnl5cXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNDM1OTIsImV4cCI6MjEwNzcxOTU5Mn0.bcxGQRihsOczY6R4CevkChBRvo9UoPBZunHHgyTdLPQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export const KWACHA_SUPABASE_CONFIG = {
  url: SUPABASE_URL,
  isConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
};
