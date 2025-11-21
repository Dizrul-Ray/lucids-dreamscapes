import { createClient } from '@supabase/supabase-js';

// Safely retrieve environment variables
const getEnvVar = (key: string, processKey?: string): string => {
  // 1. Check import.meta.env (Vite standard)
  try {
    if (import.meta && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch (e) {}

  // 2. Check process.env (injected via vite.config.ts define)
  try {
    if (processKey && (process as any).env && (process as any).env[processKey]) {
      return (process as any).env[processKey];
    }
  } catch (e) {}

  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase keys are missing! Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Cloudflare/Environment.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);