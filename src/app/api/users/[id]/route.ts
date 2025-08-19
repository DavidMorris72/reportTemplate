import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/db";
import { getJwtSecret } from "@/lib/env";
import { z } from "zod";

// Force runtime to be nodejs to ensure proper server-side execution
export const runtime = "nodejs";

// Validation schema
const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
});

// Helper function to verify admin token
async function verifyAdminToken(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const jwtSecret = getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret) as any;

    if (decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN") {
      throw new Error("Insufficient permissions");
    }

    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await verifyAdminToken(request);

    const db = getDb();
    const users = await db`
      SELECT id, email, name, role, created_at, updated_at 
      FROM users 
      WHERE id = ${params.id}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user" },
      { status: error.message === "Insufficient permissions" ? 403 : 401 },
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const currentUser = await verifyAdminToken(request);
    const body = await request.json();

    // Validate input
    const validatedData = UpdateUserSchema.parse(body);

    // Check if user exists
    const db = getDb();
    const existingUsers = await db`
      SELECT id, email, role FROM users WHERE id = ${params.id}
    `;

    if (existingUsers.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingUser = existingUsers[0];

    // Check if email is being changed and already exists
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await db`
        SELECT id FROM users WHERE email = ${validatedData.email.toLowerCase()}
      `;

      if (emailExists.length > 0) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 },
        );
      }
    }

    // Only Super Admins can create/modify other Admins
    if (
      validatedData.role &&
      (validatedData.role === "ADMIN" || validatedData.role === "SUPER_ADMIN")
    ) {
      if (currentUser.role !== "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "Only Super Administrators can modify Admin roles" },
          { status: 403 },
        );
      }
    }

    // Prepare update data
    const updates: any = { updated_at: new Date() };
    if (validatedData.email) updates.email = validatedData.email.toLowerCase();
    if (validatedData.name) updates.name = validatedData.name;
    if (validatedData.role) updates.role = validatedData.role;
    if (validatedData.password) {
      updates.hashed_password = await bcrypt.hash(validatedData.password, 12);
    }

    // Update user with individual queries for simplicity
    let updatedUsers;
    if (validatedData.email && validatedData.name && validatedData.role && validatedData.password) {
      updatedUsers = await db`
        UPDATE users 
        SET email = ${updates.email}, name = ${updates.name}, role = ${updates.role}, 
            hashed_password = ${updates.hashed_password}, updated_at = NOW()
        WHERE id = ${params.id}
        RETURNING id, email, name, role, created_at, updated_at
      `;
    } else if (validatedData.email && validatedData.name && validatedData.role) {
      updatedUsers = await db`
        UPDATE users 
        SET email = ${updates.email}, name = ${updates.name}, role = ${updates.role}, updated_at = NOW()
        WHERE id = ${params.id}
        RETURNING id, email, name, role, created_at, updated_at
      `;
    } else if (validatedData.email && validatedData.name) {
      updatedUsers = await db`
        UPDATE users 
        SET email = ${updates.email}, name = ${updates.name}, updated_at = NOW()
        WHERE id = ${params.id}
        RETURNING id, email, name, role, created_at, updated_at
      `;
    } else if (validatedData.email) {
      updatedUsers = await db`
        UPDATE users 
        SET email = ${updates.email}, updated_at = NOW()
        WHERE id = ${params.id}
        RETURNING id, email, name, role, created_at, updated_at
      `;
    } else if (validatedData.name) {
      updatedUsers = await db`
        UPDATE users 
        SET name = ${updates.name}, updated_at = NOW()
        WHERE id = ${params.id}
        RETURNING id, email, name, role, created_at, updated_at
      `;
    } else if (validatedData.role) {
      updatedUsers = await db`
        UPDATE users 
        SET role = ${updates.role}, updated_at = NOW()
        WHERE id = ${params.id}
        RETURNING id, email, name, role, created_at, updated_at
      `;
    } else if (validatedData.password) {
      updatedUsers = await db`
        UPDATE users 
        SET hashed_password = ${updates.hashed_password}, updated_at = NOW()
        WHERE id = ${params.id}
        RETURNING id, email, name, role, created_at, updated_at
      `;
    } else {
      // No updates, just return current user
      updatedUsers = await db`
        SELECT id, email, name, role, created_at, updated_at 
        FROM users 
        WHERE id = ${params.id}
      `;
    }

    return NextResponse.json({ user: updatedUsers[0] });
  } catch (error: any) {
    console.error("Error updating user:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: error.message === "Insufficient permissions" ? 403 : 500 },
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const currentUser = await verifyAdminToken(request);

    // Check if user exists
    const db = getDb();
    const existingUsers = await db`
      SELECT id, role FROM users WHERE id = ${params.id}
    `;

    if (existingUsers.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingUser = existingUsers[0];

    // Prevent self-deletion
    if (existingUser.id === currentUser.userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    // Only Super Admins can delete other Admins
    if (existingUser.role === "ADMIN" || existingUser.role === "SUPER_ADMIN") {
      if (currentUser.role !== "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "Only Super Administrators can delete Admin users" },
          { status: 403 },
        );
      }
    }

    // Delete user
    await db`DELETE FROM users WHERE id = ${params.id}`;

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: error.message === "Insufficient permissions" ? 403 : 500 },
    );
  }
}
