import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import { neon } from '@neondatabase/serverless';

// Check if environment variables are set
if (!process.env.DATABASE_URL) {
  console.warn('Missing DATABASE_URL environment variable. Database connection will not work.');
}

// Create postgres client - use neon serverless if it's a neon database URL
let queryClient;
if (process.env.DATABASE_URL) {
  if (process.env.DATABASE_URL.includes('neon.tech')) {
    // For Neon database
    queryClient = neon(process.env.DATABASE_URL);
  } else {
    // For regular postgres
    queryClient = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  }
} else {
  queryClient = null;
}

// Create drizzle client
export const db = queryClient ? drizzle(queryClient, { schema }) : null;