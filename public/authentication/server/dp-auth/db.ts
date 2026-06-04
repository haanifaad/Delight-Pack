import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required to connect to PostgreSQL. Please set it in your .env file.');
    }
    pool = new Pool({
      connectionString,
      // In production, you might want to uncomment ssl handling depending on your provider
      // ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}
