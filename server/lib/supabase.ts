import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Check if environment variables are set
if (!process.env.DATABASE_URL) {
  console.warn('Missing DATABASE_URL environment variable. Database connection will not work.');
}

// Create postgres client
const queryClient = process.env.DATABASE_URL 
  ? postgres(process.env.DATABASE_URL)
  : null;

// Create drizzle client
export const db = queryClient ? drizzle(queryClient) : null;