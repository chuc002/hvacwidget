import { createClient } from '@supabase/supabase-js';

// Check if environment variables are set
if (!process.env.DATABASE_URL) {
  console.warn('Missing DATABASE_URL environment variable. Supabase integration will not work.');
}

// Create Supabase client (this uses the DATABASE_URL you provided)
export const supabase = process.env.DATABASE_URL 
  ? createClient(
      process.env.DATABASE_URL,
      process.env.SUPABASE_SERVICE_KEY || '' // Optional service role key
    )
  : null;