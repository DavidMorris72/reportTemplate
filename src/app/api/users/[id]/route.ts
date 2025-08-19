import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { getJwtSecret } from '@/lib/env';
import { z } from 'zod';

// Force runtime to be nodejs to ensure proper server-side execution
export const runtime = 'nodejs';

// Validation schema
const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional()
});

// Helper function to verify admin token
async function verifyAdminToken(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const jwtSecret = getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      throw new Error('Insufficient permissions');
    }

    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    await verifyAdminToken(request);

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: error.message === 'Insufficient permissions' ? 403 : 401 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const currentUser = await verifyAdminToken(request);
    const body = await request.json();

    // Validate input
    const validatedData = UpdateUserSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and already exists
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email.toLowerCase() }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
    }

    // Only Super Admins can create/modify other Admins
    if (validatedData.role && (validatedData.role === 'ADMIN' || validatedData.role === 'SUPER_ADMIN')) {
      if (currentUser.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: 'Only Super Administrators can modify Admin roles' },
          { status: 403 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (validatedData.email) updateData.email = validatedData.email.toLowerCase();
    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.role) updateData.role = validatedData.role;
    if (validatedData.password) {
      updateData.hashedPassword = await bcrypt.hash(validatedData.password, 12);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: error.message === 'Insufficient permissions' ? 403 : 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const currentUser = await verifyAdminToken(request);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent self-deletion
    if (existingUser.id === currentUser.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Only Super Admins can delete other Admins
    if (existingUser.role === 'ADMIN' || existingUser.role === 'SUPER_ADMIN') {
      if (currentUser.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: 'Only Super Administrators can delete Admin users' },
          { status: 403 }
        );
      }
    }

    // Delete user
    await prisma.user.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: error.message === 'Insufficient permissions' ? 403 : 500 }
    );
  }
}