import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/db";
import { getJwtSecret } from "@/lib/env";

// Force runtime to be nodejs to ensure proper server-side execution
export const runtime = "nodejs";

/**
 * POST /api/verify-password
 *
 * Authenticates users by validating their email and password against the database.
 * Supports 'USER', 'ADMIN', and 'SUPER_ADMIN' roles.
 *
 * Security considerations:
 * - Password hashing with bcrypt
 * - JWT token generation for sessions
 * - Database-based user management
 * - Role-based authentication for access control
 *
 * @param request - NextRequest containing the email and password to verify
 * @returns NextResponse with JWT token and user info if valid
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user in database
    let users;
    try {
      const db = getDb();
      console.log("Database connection established for login");
      
      users = await db`
        SELECT id, email, name, "hashedPassword", role 
        FROM users 
        WHERE email = ${email.toLowerCase()}
      `;
      
      console.log(`Found ${users.length} users for email: ${email}`);
    } catch (dbError) {
      console.error("Database error during login:", dbError);
      return NextResponse.json(
        { error: "Database connection failed", details: dbError instanceof Error ? dbError.message : "Unknown error" },
        { status: 503 },
      );
    }

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate JWT token
    const jwtSecret = getJwtSecret();
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "24h" },
    );

    return NextResponse.json({
      isValid: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
