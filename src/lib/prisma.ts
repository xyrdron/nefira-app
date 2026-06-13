import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. Create your database connection pool
// Configure connection pool. For managed Postgres providers like Supabase
// we often need to enable SSL with relaxed cert verification in Node.
const poolConfig: any = {
  connectionString: process.env.DATABASE_URL,
};

// If the DATABASE_URL looks like a Supabase-hosted URL, enable SSL with
// rejectUnauthorized=false to avoid cert verification issues. You can also
// set an explicit env var like DATABASE_SSL=true to force this behavior.
if (
  process.env.DATABASE_SSL === "true" ||
  (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("supabase"))
) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

// 2. Wrap it in the Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Construct PrismaClient with the adapter configuration
export const prisma = new PrismaClient({ adapter });