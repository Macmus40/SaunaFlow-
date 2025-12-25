import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  // 1. Priorytet: Vite Environment (Netlify/Local)
  const meta = import.meta as any;
  if (typeof meta !== 'undefined' && meta.env && meta.env[key]) {
    return meta.env[key];
  }
  // 2. Fallback: Window (AI Studio Preview)
  const win = window as any;
  if (win.__ENV__ && win.__ENV__[key]) {
    return win.__ENV__[key];
  }
  return '';
};

export const SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY');
export const IS_TEST_MODE = getEnv('VITE_TEST_MODE') === 'true';

export const IS_CONFIGURED = !!(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('placeholder') &&
  SUPABASE_URL.startsWith('https://')
);

// Konfiguracja Auth v2 - kluczowa dla SPA i Magic Linków
export const supabase = createClient(
  SUPABASE_URL || 'https://missing-config.supabase.co',
  SUPABASE_ANON_KEY || 'missing-key',
  {
    auth: {
      detectSessionInUrl: true, // KRYTYCZNE: SDK musi szukać tokenów w #
      persistSession: true,     // Zapisywanie w localStorage
      autoRefreshToken: true,
      storageKey: 'saunaflow-auth-session'
    }
  }
);

// Ekspozycja dla debugowania w konsoli
if (typeof window !== 'undefined') {
    (window as any).supabase = supabase;
}

export const maskKey = (key: string) => {
  if (!key || key.length < 10) return '********';
  return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
};