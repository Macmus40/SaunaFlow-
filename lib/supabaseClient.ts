
import { createClient } from '@supabase/supabase-js';

// Dane do połączenia z Twoim projektem Supabase
const supabaseUrl = 'https://ipdzreofebvkeizqpnhm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwZHpyZW9mZWJ2a2VpenFwbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3NzQxMTcsImV4cCI6MjAxNDM1MDExN30.8i9Yd8d21zP-584kM9fL-M62C2zQjMlMlZThYWnJHQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
