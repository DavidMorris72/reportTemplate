import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Force runtime to be nodejs
export const runtime = "nodejs";

/**
 * GET /api/debug/db
 * Debug endpoint to check database connection and table structure
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    console.log("Debug: Database connection established");

    // Check if users table exists
    const tableCheck = await db`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      ) as exists;
    `;

    console.log("Users table exists:", tableCheck[0]?.exists);

    if (tableCheck[0]?.exists) {
      // Get table structure
      const tableStructure = await db`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `;

      // Count users
      const userCount = await db`SELECT COUNT(*) as count FROM users`;

      return NextResponse.json({
        success: true,
        database_connected: true,
        users_table_exists: true,
        table_structure: tableStructure,
        user_count: userCount[0]?.count || 0,
        environment: process.env.NODE_ENV,
        database_url_set: !!process.env.DATABASE_URL,
      });
    } else {
      return NextResponse.json({
        success: false,
        database_connected: true,
        users_table_exists: false,
        message: "Users table does not exist. Please run the schema.sql script.",
        environment: process.env.NODE_ENV,
        database_url_set: !!process.env.DATABASE_URL,
      });
    }
  } catch (error) {
    console.error("Database debug error:", error);
    return NextResponse.json(
      {
        success: false,
        database_connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
        environment: process.env.NODE_ENV,
        database_url_set: !!process.env.DATABASE_URL,
      },
      { status: 500 }
    );
  }
}