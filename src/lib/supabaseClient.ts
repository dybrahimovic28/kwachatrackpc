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

/**
 * Returns the exact OAuth & email authentication redirect destination.
 * Automatically chooses the production domain on Vercel, localhost during development,
 * or the custom protocol (kwachatrack://login-callback) when running inside Electron.
 * Never includes hash fragments which violate OAuth 2.0 (RFC 6749 Section 3.1.2).
 */
export const getAuthRedirectUrl = (): string => {
  if (typeof window === 'undefined') return '';

  // Electron desktop application uses custom protocol registered with Windows OS
  if (window.electronAPI?.isDesktop) {
    return 'kwachatrack://login-callback';
  }

  // Explicit env override if set in Vercel or environment
  if (import.meta.env.VITE_AUTH_REDIRECT_URL) {
    const raw = import.meta.env.VITE_AUTH_REDIRECT_URL.trim();
    return raw.endsWith('/') ? raw : `${raw}/`;
  }

  // Current browser origin (e.g. https://kwachatrackpc.vercel.app/ or http://localhost:5173/)
  return `${window.location.origin}/`;
};
