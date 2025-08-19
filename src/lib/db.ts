import { neon } from '@neondatabase/serverless';

// Get database connection
export function getDb() {
  const databaseUrl = 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL;

  if (!databaseUrl) {
    throw new Error('Database URL not found in environment variables');
  }

  return neon(databaseUrl);
}

// Export db for backward compatibility - will be initialized at runtime
export const db = (() => {
  try {
    return getDb();
  } catch (error) {
    // During build, return a placeholder
    console.warn('Database connection deferred until runtime');
    return null as any;
  }
})();
