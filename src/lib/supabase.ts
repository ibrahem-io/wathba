import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.error('Supabase URL or Anon Key is missing or contains placeholder values. Please check your environment variables.');
  
  // Create a mock client to prevent the app from crashing
  export const supabase = createClient(
    'https://placeholder.supabase.co',
    'placeholder-anon-key'
  );
} else {
  export const supabase = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
}

export default supabase;