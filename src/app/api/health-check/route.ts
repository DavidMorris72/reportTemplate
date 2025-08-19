import { NextResponse } from "next/server";

/**
 * GET /api/health-check
 *
 * Simple health check endpoint to verify the API is running.
 * Returns basic system information and timestamp.
 *
 * @returns NextResponse with health status and system info
 */
export async function GET() {
  try {
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
