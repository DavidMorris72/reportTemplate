import { neon } from '@neondatabase/serverless';

// Get database connection
function getDbConnection() {
  const databaseUrl = 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL;

  if (!databaseUrl) {
    throw new Error('Database URL not found in environment variables');
  }

  return neon(databaseUrl);
}

export const db = getDbConnection();
