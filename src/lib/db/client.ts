import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Database connection for edge functions
export function createDbClient(databaseUrl: string) {
  const client = postgres(databaseUrl);
  return drizzle(client);
}