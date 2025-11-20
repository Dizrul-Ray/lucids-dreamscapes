import { createClient } from '@supabase/supabase-js';

// Safely retrieve environment variables to prevent crashes if import.meta.env is undefined
const getEnvVar = (key: string): string => {
  try {
    // Check if import.meta.env exists (Vite standard)
    if (import.meta && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch (e) {
    // Ignore access errors
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase keys are missing! Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Cloudflare/Environment.');
}

// Initialize with valid strings or placeholders to ensure the app doesn't crash on startup.
// The connection will simply fail gracefully (network error) if keys are invalid, rather than crashing the whole app.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);