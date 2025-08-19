import { NextRequest, NextResponse } from "next/server";

// Force runtime to be nodejs to ensure proper server-side execution
export const runtime = "nodejs";
// Force dynamic rendering since we use searchParams
export const dynamic = "force-dynamic";

/**
 * GET /api/debug/env - Debug environment variables (TEMPORARY)
 *
 * This endpoint shows what database environment variables are available
 * in production to help debug the Neon-Vercel integration issue.
 *
 * WARNING: This endpoint should be removed after debugging!
 */
export async function GET(request: NextRequest) {
  try {
    // Only allow in development or with specific debug key
    const debugKey = request.nextUrl.searchParams.get("debug");
    if (
      process.env.NODE_ENV === "production" &&
      debugKey !== "neon-debug-2024"
    ) {
      return NextResponse.json(
        {
          error: "Debug endpoint not available in production without debug key",
        },
        { status: 404 },
      );
    }

    // Get all database-related environment variables
    const dbEnvVars = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? "SET (hidden)" : "NOT_SET",
      POSTGRES_URL: process.env.POSTGRES_URL ? "SET (hidden)" : "NOT_SET",
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL
        ? "SET (hidden)"
        : "NOT_SET",
      POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING
        ? "SET (hidden)"
        : "NOT_SET",
      POSTGRES_USER: process.env.POSTGRES_USER ? "SET" : "NOT_SET",
      POSTGRES_HOST: process.env.POSTGRES_HOST ? "SET" : "NOT_SET",
      POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD
        ? "SET (hidden)"
        : "NOT_SET",
      POSTGRES_DATABASE: process.env.POSTGRES_DATABASE
        ? process.env.POSTGRES_DATABASE
        : "NOT_SET",
      JWT_SECRET: process.env.JWT_SECRET ? "SET (hidden)" : "NOT_SET",
    };

    // Check which URL would be used by Prisma
    const selectedUrl =
      process.env.POSTGRES_PRISMA_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL;

    return NextResponse.json({
      message: "Database environment variables debug info",
      environment: process.env.NODE_ENV,
      envVars: dbEnvVars,
      selectedDatabaseUrl: selectedUrl ? "SELECTED" : "NONE_AVAILABLE",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
